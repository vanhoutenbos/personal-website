---
title: "NGINX Ingress naar Istio: kracht, complexiteit en wanneer het de moeite waard is"
date: 2026-05-21 06:00:00 +0200
categories: [Kubernetes, Networking]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Istio is de meest krachtige Gateway API-implementatie — maar ook de meest complexe. Dit artikel beschrijft de migratie van NGINX Ingress naar Istio, de annotatie-vertaling, en eerlijk advies over wanneer Istio de juiste keuze is."
image: /assets/img/post-default.svg
image_alt: "Migratie van NGINX Ingress naar Istio Gateway API"
tags: [Kubernetes, Networking, Gateway API, Istio, NGINX, Ingress, Service Mesh, Migratie]
series: "Kubernetes Top-Down"
series_order: 12
series_path: "gateway-api-istio-migratie"
lang: nl
---

# NGINX Ingress naar Istio: kracht, complexiteit en wanneer het de moeite waard is

Istio is niet alleen een Gateway API-implementatie. Het is een service mesh — een volledig platform voor netwerkcommunicatie tussen services, met mTLS, traffic policies, circuit breaking, retry-logica en distributed tracing ingebakken. Als je van NGINX Ingress naar Istio migreert, stap je niet alleen over naar een andere ingress-controller. Je voegt een complete infrastructuurlaag toe.

Dat is precies waarom Istio voor veel teams complexer aanvoelt dan verwacht. De documentatie is uitgebreid, de API heeft veel resources, en het gedrag verschilt aanzienlijk per versie. Istio bestaat al een tijdje en heeft een aantal architectonische overhauls gehad — van de oorspronkelijke Mixer-architectuur naar Istiod, naar de huidige ambient mesh-modus. Wat je leest in een artikel van twee jaar geleden klopt mogelijk niet meer voor de versie die je nu installeert.

Dit artikel beschrijft de migratie van dezelfde NGINX Ingress-annotaties als het vorige artikel, maar nu met Istio als doel. En het beschrijft eerlijk wanneer die keuze de moeite waard is — en wanneer niet.

## Istio en Gateway API: twee API-smaken

Istio ondersteunt Gateway API naast zijn eigen propriëtaire API. Dat geeft je een keuze:

**Propriëtaire Istio API** gebruikt `Gateway` en `VirtualService` van de `networking.istio.io`-groep. Dit is de oudere aanpak, goed gedocumenteerd, met veel voorbeelden online. Nadeel: het koppelt je volledig aan Istio.

**Gateway API** gebruikt de standaard `gateway.networking.k8s.io`-resources. Istio is een van de meest conformante Gateway API-implementaties — het ondersteunt bijna de volledige spec, inclusief uitbreidingen. Dit is de richting die Istio aanraadt voor nieuwe installaties.

In dit artikel gebruik ik de Gateway API-aanpak. De Istio-extensies die aanvullende functionaliteit bieden, gebruik ik via aparte policy-resources.

## Installatie en basis Gateway-configuratie

Installeer Istio via de officiële Helm chart met Gateway API-ondersteuning:

```bash
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

# Installeer de Istio base (CRDs)
helm install istio-base istio/base \
  --namespace istio-system \
  --create-namespace

# Installeer istiod (control plane)
helm install istiod istio/istiod \
  --namespace istio-system \
  --set pilot.env.PILOT_ENABLE_GATEWAY_API=true \
  --wait

# Installeer de ingress gateway
helm install istio-ingressgateway istio/gateway \
  --namespace istio-ingress \
  --create-namespace
```

De GatewayClass wordt door Istio automatisch aangemaakt:

```yaml
# Wordt automatisch aangemaakt door istiod
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: istio
spec:
  controllerName: istio.io/gateway-controller
```

Je eigen Gateway:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: prod-gateway
  namespace: istio-ingress
spec:
  gatewayClassName: istio
  listeners:
  - name: https
    port: 443
    protocol: HTTPS
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        name: prod-tls-cert
    allowedRoutes:
      namespaces:
        from: All
```

## De annotaties vertalen

Met dezelfde annotaties als uitgangspunt als in het vorige artikel, dit is hoe ze in Istio worden opgelost.

### Body size limiet

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/proxy-body-size: "10m"
```

In Istio gebruik je een `EnvoyFilter` om de upstream body-limiet te configureren, of je configureert het op de Envoy proxy via een `WasmPlugin`. Maar de meest pragmatische aanpak voor alleen body-size is het instellen op de applicatielaag, of via een `VirtualService` policy als je de propriëtaire API gebruikt.

Via de Istio-propriëtaire API (als je die nog gebruikt naast Gateway API):

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: payments-body-size
  namespace: payments-prod
spec:
  workloadSelector:
    labels:
      app: payments-api
  configPatches:
  - applyTo: HTTP_FILTER
    match:
      context: SIDECAR_INBOUND
      listener:
        filterChain:
          filter:
            name: "envoy.filters.network.http_connection_manager"
    patch:
      operation: MERGE
      value:
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          max_request_bytes: 10485760  # 10MB
```

`EnvoyFilter` is krachtig — het geeft je directe toegang tot de Envoy-configuratie — maar het is ook foutgevoelig en versie-afhankelijk. De structuur van een `EnvoyFilter` kan breken bij een Istio-upgrade als de interne Envoy-configuratie wijzigt. Gebruik het spaarzaam en documenteer goed welke versie er werd gebruikt toen je het schreef.

### Timeouts

**Ingress-annotaties:**
```yaml
nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
```

Via Gateway API HTTPRoute (standaard):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: payments-api
  namespace: payments-prod
spec:
  parentRefs:
  - name: prod-gateway
    namespace: istio-ingress
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /payments
    timeouts:
      request: 60s
      backendRequest: 60s
    backendRefs:
    - name: payments-api-svc
      port: 8080
```

Dit is identiek aan de NGF-aanpak — het `timeouts`-veld is onderdeel van de standaard spec. Hier zie je de kracht van de standaard: dezelfde HTTPRoute-configuratie werkt op beide implementaties.

### IP whitelisting

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,192.168.1.0/24"
```

In Istio gebruik je `AuthorizationPolicy` voor access control op basis van source-IP. Dit is een van de plaatsen waar Istio aanzienlijk krachtiger is dan een standalone ingress-controller:

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: payments-api-whitelist
  namespace: payments-prod
spec:
  selector:
    matchLabels:
      app: payments-api
  action: ALLOW
  rules:
  - from:
    - source:
        ipBlocks:
        - "10.0.0.0/8"
        - "192.168.1.0/24"
```

Let op: `AuthorizationPolicy` werkt op basis van de IP die Envoy ziet. Als er een load balancer voor zit, moet je `X-Forwarded-For` correct doorgeven en de `numTrustedProxies` instellen in de mesh-configuratie — anders evalueert Istio het IP van de load balancer in plaats van de client.

### Rate limiting

**Ingress-annotaties:**
```yaml
nginx.ingress.kubernetes.io/limit-rps: "10"
nginx.ingress.kubernetes.io/limit-connections: "5"
```

Istio heeft geen ingebouwde rate limiting in de standaard Gateway API-resources. Rate limiting gaat via een externe service — typisch via de Envoy Rate Limit Service of via een WASM-plugin:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: payments-ratelimit
  namespace: payments-prod
spec:
  workloadSelector:
    labels:
      app: istio-ingressgateway
  configPatches:
  - applyTo: HTTP_FILTER
    match:
      context: GATEWAY
      listener:
        filterChain:
          filter:
            name: "envoy.filters.network.http_connection_manager"
            subFilter:
              name: "envoy.filters.http.router"
    patch:
      operation: INSERT_BEFORE
      value:
        name: envoy.filters.http.ratelimit
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.http.ratelimit.v3.RateLimit
          domain: payments-api
          rate_limit_service:
            grpc_service:
              envoy_grpc:
                cluster_name: rate_limit_cluster
            transport_api_version: V3
```

Dit vereist een aparte rate limit service naast Istio. Voor de meeste teams is dat te zwaar voor iets wat NGINX Ingress met een enkele annotatie afhandelde. De eerlijke conclusie: als rate limiting op ingress-niveau een kernvereiste is, dan is Istio niet de meest efficiënte oplossing. Overweeg dan rate limiting op een API gateway-laag die beter is uitgerust voor dat patroon.

## Wat Istio toevoegt boven een ingress-controller

Tot nu toe leken de migratie-uitdagingen groot en de voordelen klein. Dat is een vertekend beeld, want het echte voordeel van Istio zit niet in de annotatie-vervanging — het zit in wat er daarna mogelijk is.

**mTLS tussen services** is met Istio triviaal. Zodra de sidecar-proxies actief zijn, kun je mTLS cluster-breed afdwingen:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

Eén resource, en al het service-to-service verkeer in het cluster is versleuteld en geverifieerd. Geen aanpassingen aan applicaties. Dat is een beveiligingsmaatregel die je met een standalone ingress-controller niet krijgt.

**Traffic splitting** voor canary releases:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: payments-api
  namespace: payments-prod
spec:
  parentRefs:
  - name: prod-gateway
    namespace: istio-ingress
  rules:
  - backendRefs:
    - name: payments-api-v1
      port: 8080
      weight: 90
    - name: payments-api-v2
      port: 8080
      weight: 10
```

**Circuit breaking en retry-beleid** via `DestinationRule`:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: payments-api
  namespace: payments-prod
spec:
  host: payments-api-svc
  trafficPolicy:
    connectionPool:
      http:
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
```

Dit zijn capabilities die je met NGINX Ingress alleen krijgt via extra tooling of een service mesh bovenop de ingress-controller.

## De eerlijke keerzijde: complexiteit en versieverschillen

Istio is complex. Niet op een manier die je kunt omzeilen door betere documentatie te lezen — het is intrinsiek complex omdat het veel meer doet dan een ingress-controller.

Er zijn meer resource-types om te kennen: `Gateway`, `VirtualService`, `DestinationRule`, `AuthorizationPolicy`, `PeerAuthentication`, `ServiceEntry`, `Sidecar`, `EnvoyFilter`. Elk heeft zijn eigen gedragsregels en interacties. Teams die gewend zijn aan NGINX Ingress-annotaties onderschatten systematisch hoeveel Istio vraagt om goed te begrijpen.

Een extra complicatie is dat Istio een langere historische ontwikkeling heeft gehad en op meerdere punten architectureel is veranderd. De Mixer-component die in oudere versies traffiek-policies afhandelde is volledig vervangen. Ambient mesh — waarbij geen sidecar-proxies meer nodig zijn — is in recente versies beschikbaar maar nog niet overal productierijp. Wat werkt in Istio 1.16 werkt soms anders in Istio 1.21. Artikelen en StackOverflow-antwoorden zijn zonder versie-context weinig waard.

Dat leidt tot een praktisch probleem: als je Istio wilt upgraden, moet je goed begrijpen welke API-changes er zijn. `EnvoyFilter`-configs die afhankelijk zijn van interne Envoy-structuren breken regelmatig bij een major upgrade. Het is niet ongebruikelijk dat een team na een upgrade uren kwijt is aan het debuggen van een `EnvoyFilter` die de upgrade niet heeft overleefd.

## Wanneer is Istio de juiste keuze — en wanneer niet?

Istio is de juiste keuze als je **meer dan een ingress-controller nodig hebt**. Als de behoeften van je organisatie zijn:

- mTLS cluster-breed, zonder applicatiecode aan te passen
- Fijnmazige traffic policies per service (canary, circuit breaking, retries)
- Centraal beheer van service-to-service autorisatie
- Distributed tracing geïntegreerd in de netwerklaag

Dan is Istio een serieuze kandidaat. De complexiteit is dan gerechtvaardigd.

Istio is **niet** de juiste keuze als je alleen betere ingress-routering wilt. Als je vandaag NGINX Ingress gebruikt met een handvol annotaties voor timeouts en body-limieten, levert Istio onevenredig veel complexiteit voor de functionaliteit die je daadwerkelijk gebruikt. NGF of Envoy Gateway zijn dan efficiëntere keuzes.

Een patroon dat ik in de praktijk heb gezien: sommige teams combineren vendors per laag. Ze gebruiken NGF of Envoy Gateway voor de ingresslaag — simpel, snel, goed begrepen — en voegen Istio toe als sidecar mesh voor service-to-service policies. Dat is een verdedigbare architectuurkeuze. Je hebt dan twee tools in plaats van één, maar elk met een duidelijk afgebakende verantwoordelijkheid.

Wat per team anders kan zijn:

- Teams met een sterk platform-team dat Istio begrijpt en beheert, ervaren de complexiteit anders dan teams die het zelf moeten uitzoeken
- Teams in een regulated environment waar mTLS en audit logging harde vereisten zijn, hebben meer aan Istio dan teams waar dat niet speelt
- Teams die al Envoy kennen (via andere tools) hebben een kortere leercurve naar Istio dan teams die er koud in stappen

Er is geen universeel juist antwoord. De architectuurblog aan het begin van deze reeks beschrijft de beslisboom — maar de input voor die beslissing verschilt per organisatie.

## Conclusie

De migratie van NGINX Ingress naar Istio is meer werk dan naar NGF, en de annotatie-vertaling is minder direct. Maar Istio geeft je ook fundamenteel meer: mTLS, traffic management en service-level policies op een manier die geen standalone ingress-controller biedt.

De keuze hangt niet af van welke tool technisch het best is. Die hangt af van wat jouw teams aankunnen, welke features je daadwerkelijk nodig hebt, en of je de complexiteit van Istio kunt dragen — operationeel en organisatorisch.

Een goed platform-team dat Istio kent en beheert, verandert de ervaring van applicatieteams enorm. Zonder dat fundament wordt Istio een bron van frustratie in plaats van een enabler.

**Istio geeft je een weg — maar je moet wel de navigatie begrijpen voor je gaat rijden.**

### Volgende stappen

- **Architectuuroverzicht en vendorkeuze:** het eerste artikel in deze reeks — {% include smart-link.html slug="ingress-naar-gateway-api" text="Van Ingress naar Gateway API" fallback="Van Ingress naar Gateway API: architectuur, vendors en hoe je kiest" %}
- **NGF-migratie vergeleken:** {% include smart-link.html slug="nginx-ingress-naar-nginx-gateway-fabric" text="NGINX Ingress naar NGF" fallback="NGINX Ingress naar NGINX Gateway Fabric: de migratie in de praktijk" %}
- **Istio documentatie:** [istio.io/latest/docs](https://istio.io/latest/docs/)
- **Gateway API in Istio:** [istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api](https://istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api/)
- **Performance benchmarks:** [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench)

---

*Jean-Paul van Houten-Bos is DevOps Engineer gespecialiseerd in Kubernetes-netwerken en service mesh-architecturen. Hij begeleidt enterprise-teams bij de keuze en implementatie van Gateway API-oplossingen in productieomgevingen.*

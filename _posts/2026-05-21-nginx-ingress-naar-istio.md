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

Istio is meer dan een Gateway API-implementatie. Je kunt het ook als service mesh gebruiken, met mTLS, traffic policies, circuit breaking, retries en distributed tracing voor verkeer tussen services. Migreer je van NGINX Ingress naar Istio, dan verander je dus niet alleen van ingress-controller. Je haalt er een extra infrastructuurlaag bij.

Daar zit ook de reden dat Istio voor veel teams ingewikkelder is dan verwacht. Er is veel documentatie, je krijgt met meer resources te maken en gedrag kan per versie verschillen. Istio heeft bovendien een paar grote architectuurveranderingen doorgemaakt: van Mixer naar Istiod en later naar ambient mesh. Een artikel van twee jaar geleden beschrijft dus niet automatisch de versie die je nu gebruikt.

In dit artikel vertaal ik dezelfde NGINX Ingress-annotaties als in het vorige artikel naar Istio. Daarna kijk ik wanneer die overstap iets oplevert en wanneer je beter een andere keuze maakt.

## Istio en Gateway API: twee API-smaken

Istio ondersteunt de standaard Gateway API en heeft daarnaast eigen API's. Je kunt dus kiezen:

**De Istio API** gebruikt `Gateway` en `VirtualService` uit de `networking.istio.io`-groep. Dit is de oudere aanpak. Je vindt er veel documentatie en voorbeelden voor, maar je configuratie is wel aan Istio gekoppeld.

**Gateway API** gebruikt de standaardresources uit `gateway.networking.k8s.io`. Istio ondersteunt een groot deel van de specificatie, inclusief uitbreidingen. Voor nieuwe installaties raadt Istio deze richting aan.

In dit artikel gebruik ik Gateway API. Waar extra Istio-functionaliteit nodig is, voeg ik aparte policy-resources toe.

## Installatie en basis Gateway-configuratie

{: .notice--info}
> **Geteste omgeving:** deze voorbeelden zijn gebaseerd op OpenShift met Red Hat OpenShift Service Mesh 1.22, beheerd via de OpenShift Service Mesh Operator. De Helm-commando's hieronder zijn een generiek upstream-Istio-voorbeeld en beschrijven niet hoe Istio in deze OpenShift-omgeving is geïnstalleerd.

Ter vergelijking: zo ziet een generieke upstream-Istio-installatie met Gateway API-ondersteuning via Helm eruit:

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

Ik gebruik dezelfde annotaties als in het vorige artikel. Zo vertaal je ze naar Istio.

### Body size limiet

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/proxy-body-size: "10m"
```

Voor deze limiet kun je in Istio een `EnvoyFilter` gebruiken, of de Envoy-proxy configureren met een `WasmPlugin`. Heb je alleen een limiet op de requestgrootte nodig, dan is configuratie in de applicatie vaak eenvoudiger. Gebruik je de Istio API, dan kun je ook een `VirtualService`-policy overwegen.

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

Met `EnvoyFilter` pas je de Envoy-configuratie rechtstreeks aan. Dat geeft veel controle, maar maakt je configuratie ook gevoelig voor fouten en versieverschillen. Verandert de interne Envoy-configuratie bij een Istio-upgrade, dan kan je filter stukgaan. Gebruik `EnvoyFilter` daarom alleen als het nodig is en noteer bij welke versie je de configuratie hebt gemaakt.

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

Dit werkt hetzelfde als bij NGF: het veld `timeouts` hoort bij de standaard. Daardoor kun je dezelfde `HTTPRoute` op beide implementaties gebruiken.

### IP whitelisting

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,192.168.1.0/24"
```

In Istio kun je `AuthorizationPolicy` gebruiken om toegang op basis van het bron-IP te regelen. Dat biedt meer mogelijkheden dan een losse ingress-controller:

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

Let op: `AuthorizationPolicy` kijkt naar het IP-adres dat Envoy ziet. Staat er een load balancer vóór Envoy, dan ziet Envoy mogelijk het adres van die load balancer in plaats van dat van de client. In dat geval moet je `X-Forwarded-For` goed doorgeven en `numTrustedProxies` instellen in de mesh-configuratie.

### Rate limiting

**Ingress-annotaties:**
```yaml
nginx.ingress.kubernetes.io/limit-rps: "10"
nginx.ingress.kubernetes.io/limit-connections: "5"
```

De standaard Gateway API-resources van Istio hebben geen ingebouwde rate limiting. Je hebt hiervoor een externe service nodig, bijvoorbeeld de Envoy Rate Limit Service, of een WASM-plugin:

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

Hiervoor moet je dus naast Istio ook een rate limit service beheren. Dat kan veel werk zijn voor een functie waarvoor NGINX Ingress één annotatie nodig had. Is rate limiting op ingress-niveau een harde eis, dan is Istio misschien niet de handigste oplossing. Kijk dan ook naar een API gateway die dit patroon standaard ondersteunt.

## Wat Istio toevoegt boven een ingress-controller

Tot nu toe klinkt de migratie misschien als veel werk voor weinig winst. Dat beeld is niet compleet. De waarde van Istio zit niet alleen in het vervangen van annotaties, maar ook in de mogelijkheden die je daarna kunt inzetten.

**mTLS tussen services** kun je met Istio afdwingen zodra de sidecar-proxies actief zijn:

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

Met één resource versleutel en verifieer je zo het service-to-service-verkeer in het cluster. Je hoeft daarvoor de applicaties niet aan te passen. Een standalone ingress-controller biedt dit niet.

**Traffic splitting** helpt je bijvoorbeeld bij canary releases:

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

Met `DestinationRule` stel je **circuit breaking en retry-beleid** in:

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

Met NGINX Ingress heb je voor dit soort mogelijkheden extra tooling of een service mesh nodig.

## De eerlijke keerzijde: complexiteit en versieverschillen

Istio is complex. Dat los je niet alleen op door de documentatie beter te lezen. Istio doet nu eenmaal meer dan een ingress-controller.

Je krijgt ook meer resource-types om te leren kennen: `Gateway`, `VirtualService`, `DestinationRule`, `AuthorizationPolicy`, `PeerAuthentication`, `ServiceEntry`, `Sidecar` en `EnvoyFilter`. Ze hebben elk hun eigen regels en werken op elkaar in. Wie gewend is aan NGINX Ingress-annotaties onderschat al snel hoeveel je van Istio moet begrijpen.

Daar komt bij dat Istio in de loop van de tijd op meerdere punten is veranderd. Mixer, dat in oudere versies traffic policies afhandelde, is vervangen. Ambient mesh werkt zonder sidecar-proxies. Het is in recente versies beschikbaar, maar nog niet overal productierijp. Ook kan iets wat werkt in Istio 1.16 anders werken in Istio 1.21. Een artikel of Stack Overflow-antwoord is daarom pas bruikbaar als je weet voor welke versie het is geschreven.

Dat merk je vooral bij upgrades. Je moet weten welke API-wijzigingen eraan komen. Een `EnvoyFilter` die leunt op interne Envoy-structuren kan bij een grote upgrade breken. Dan ben je na de upgrade misschien uren aan het zoeken naar de reden dat je filter niet meer werkt.

## Wanneer is Istio de juiste keuze — en wanneer niet?

Istio past wanneer je **meer nodig hebt dan een ingress-controller**. Denk bijvoorbeeld aan:

- mTLS cluster-breed, zonder applicatiecode aan te passen
- Fijnmazige traffic policies per service (canary, circuit breaking, retries)
- Centraal beheer van service-to-service autorisatie
- Distributed tracing geïntegreerd in de netwerklaag

In dat geval is Istio een serieuze kandidaat. De extra complexiteit kan dan de moeite waard zijn.

Wil je alleen betere ingress-routering, dan is Istio waarschijnlijk niet de juiste keuze. Gebruik je nu NGINX Ingress met een paar annotaties voor timeouts en body-limieten, dan haal je met Istio veel complexiteit binnen voor weinig extra functionaliteit. NGF of Envoy Gateway kan dan een eenvoudigere keuze zijn.

Een patroon dat ik in de praktijk heb gezien: teams combineren soms vendors per laag. Ze gebruiken NGF of Envoy Gateway voor inkomend verkeer en zetten Istio daarnaast als sidecar mesh in voor policies tussen services. Dat is een verdedigbare keuze. Je beheert dan twee tools in plaats van één, maar elke tool heeft een duidelijke verantwoordelijkheid.

De afweging verschilt per team:

- Een platformteam dat Istio kent en beheert, kan de complexiteit beter opvangen dan een team dat alles zelf moet uitzoeken.
- In een gereguleerde omgeving kunnen mTLS en audit logging harde eisen zijn. Dan kan Istio meer waarde bieden.
- Ken je Envoy al uit andere tools, dan is de stap naar Istio waarschijnlijk kleiner.

Er is geen keuze die voor iedereen klopt. De architectuurblog aan het begin van deze reeks helpt je de opties af te wegen. Welke optie past, hangt af van je organisatie en je eisen.

## Conclusie

De overstap van NGINX Ingress naar Istio kost meer werk dan de overstap naar NGF. Ook vertaal je annotaties minder rechtstreeks. Daar staat tegenover dat Istio meer kan bieden, zoals mTLS, traffic management en policies voor verkeer tussen services.

De beste tool is niet automatisch de beste keuze voor jouw team. Kijk naar wat je nodig hebt, wat je team kan beheren en of je de extra complexiteit kunt dragen.

Een platformteam dat Istio goed beheert, maakt voor applicatieteams een groot verschil. Zonder dat fundament kan Istio vooral extra werk opleveren.

Istio kan veel, maar je moet wel weten welke onderdelen je nodig hebt. Begin dus met je eisen, niet met het aantal features.

### Volgende stappen

- **Architectuuroverzicht en vendorkeuze:** het eerste artikel in deze reeks — {% include smart-link.html slug="ingress-naar-gateway-api" text="Van Ingress naar Gateway API" fallback="Van Ingress naar Gateway API: architectuur, vendors en hoe je kiest" %}
- **NGF-migratie vergeleken:** {% include smart-link.html slug="nginx-ingress-naar-nginx-gateway-fabric" text="NGINX Ingress naar NGF" fallback="NGINX Ingress naar NGINX Gateway Fabric: de migratie in de praktijk" %}
- **Istio documentatie:** [istio.io/latest/docs](https://istio.io/latest/docs/)
- **Gateway API in Istio:** [istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api](https://istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api/)
- **Performance benchmarks:** [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench)

---

*Jean-Paul van Houten-Bos is DevOps Engineer gespecialiseerd in Kubernetes-netwerken en service mesh-architecturen. Hij begeleidt enterprise-teams bij de keuze en implementatie van Gateway API-oplossingen in productieomgevingen.*

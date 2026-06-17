---
title: "NGINX Ingress naar NGINX Gateway Fabric: de migratie in de praktijk"
date: 2026-05-14 06:00:00 +0200
categories: [Kubernetes, Networking]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Hoe migreer je van NGINX Ingress naar NGINX Gateway Fabric? Een praktijkverslag met annotatie-mapping, bekende bugs in NGF 2.5.2 en eerlijke adviezen over wanneer je deze weg juist niet moet nemen."
image: /assets/img/post-default.svg
image_alt: "Migratie van NGINX Ingress naar NGINX Gateway Fabric"
tags: [Kubernetes, Networking, Gateway API, NGINX, NGF, Ingress, Migratie]
series: "Kubernetes Top-Down"
series_order: 11
series_path: "gateway-api-ngf-migratie"
lang: nl
---

# NGINX Ingress naar NGINX Gateway Fabric: de migratie in de praktijk

Op papier is de migratie van NGINX Ingress naar NGINX Gateway Fabric (NGF) de meest voor de hand liggende stap. Zelfde vendor, vertrouwde configuratiefilosofie, en een directe migratiestap die NGINX zelf aanbiedt. In de praktijk stuit je op een jonger project met ruwe kanten — inclusief een aantal bugs die je pas ontdekt als je verder gaat dan de basisconfiguratie.

Dit artikel beschrijft de migratie zoals ik hem in de praktijk heb doorgemaakt. Niet de happy path uit de documentatie, maar de annotaties die je moet vertalen, de beperkingen die je tegenkomt en de keuzes die je daarin maakt.

Voor context: het vorige artikel in deze reeks beschrijft de architectuur van Gateway API en hoe je een vendor kiest. Dit artikel gaat ervan uit dat je die keuze al hebt gemaakt.

## De annotaties die je moet vertalen

Veel NGINX Ingress-configuratie zit in annotaties. Gateway API werkt niet met annotaties — het werkt met aparte policy-resources en met velden in de route-spec zelf. De mapping is niet altijd één op één.

### Body size limiet

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/proxy-body-size: "10m"
```

**NGF-equivalent met ClientSettingsPolicy:**
```yaml
apiVersion: gateway.nginx.org/v1alpha1
kind: ClientSettingsPolicy
metadata:
  name: payments-api-client-settings
  namespace: payments-prod
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: payments-api
  body:
    maxSize: "10m"
```

Dit werkt — als je een NGF-versie gebruikt zonder de namespace-bug. Meer daarover verderop.

### Timeouts

**Ingress-annotaties:**
```yaml
nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
```

**NGF-equivalent via HTTPRoute timeouts (Gateway API v1.1+):**
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: payments-api
  namespace: payments-prod
spec:
  parentRefs:
  - name: prod-gateway
    namespace: gateway-infra
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

Het `timeouts`-veld is onderdeel van de standaard Gateway API-spec en is dus niet NGF-specifiek. Controleer wel of de versie van de spec die je gebruikt dit ondersteunt — het is toegevoegd in v1.1.

### IP whitelisting

**Ingress-annotatie:**
```yaml
nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,192.168.1.0/24"
```

**NGF-equivalent:** Gateway API heeft geen standaard resource voor IP-filtering. In NGF gebruik je een `HTTPRoute`-filter als de implementatie dat ondersteunt, of je wacht op de `SecurityPolicy` CRD die in development is. Tijdelijke oplossing: regels afdwingen op netwerkniveau via NetworkPolicy, of upstream via een cloud-native firewall (NSG op AKS, Security Groups op EKS).

Als je whitelisting zwaar gebruikt, is dit een punt om vroeg in je migratie te adresseren. De standaard biedt hier voorlopig nog geen volwassen oplossing.

### Rate limiting

**Ingress-annotaties:**
```yaml
nginx.ingress.kubernetes.io/limit-rps: "10"
nginx.ingress.kubernetes.io/limit-connections: "5"
nginx.ingress.kubernetes.io/limit-burst-multiplier: "3"
```

**NGF-equivalent:** Er is momenteel geen standalone `RateLimitPolicy` in de standaard Gateway API-spec. NGF heeft dit niet als eigen CRD. De opties zijn:

1. Rate limiting afhandelen in een upstream WAF of API gateway (zoals Azure API Management)
2. Wachten op de [GEP-713 Policy Attachment](https://gateway-api.sigs.k8s.io/geps/gep-713/) implementaties
3. Tijdelijk rate limiting implementeren via de applicatielaag

Dit is een reële beperking van de huidige staat van Gateway API. Als rate limiting via de ingress-laag een harde vereiste is, moet je ofwel een vendor kiezen die dit via eigen CRDs biedt, ofwel een extra laag toevoegen.

## De bugs die je tegenkomt in NGF 2.5.2

NGF is een jonger project dan NGINX Ingress. Dat betekent dat je buiten de gebaande paden snel tegen limitaties aanloopt. In versie 2.5.2 zijn er twee problemen die de praktische bruikbaarheid beïnvloeden.

### ClientSettingsPolicy en meerdere namespaces

De `ClientSettingsPolicy` koppelt aan een HTTPRoute via een `targetRef`. Het probleem: NGF 2.5.2 houdt bij die koppeling niet altijd rekening met de namespace als unieke identifier. Als je dezelfde route-naam gebruikt in meerdere namespaces — wat bij grote platforms gebruikelijk is — kan de policy aan de verkeerde route worden gekoppeld, of helemaal niet worden toegepast.

Concreet: een `ClientSettingsPolicy` in namespace `payments-prod` die koppelt aan een HTTPRoute met de naam `api` werkt niet betrouwbaar als er in namespace `orders-prod` ook een HTTPRoute `api` bestaat.

De bug is gerapporteerd en staat open. De workaround die NGINX aanraadt is het gebruik van **SnippetsFilter** — een NGF-specifieke CRD waarmee je ruwe NGINX-configuratie kunt injecteren:

```yaml
apiVersion: gateway.nginx.org/v1alpha1
kind: SnippetsFilter
metadata:
  name: body-size-snippet
  namespace: payments-prod
spec:
  snippets:
  - context: http
    value: "client_max_body_size 10m;"
```

**Mijn aanbeveling: gebruik SnippetsFilter niet.** De reden is principieel: SnippetsFilter geeft je directe toegang tot de NGINX-configuratielaag, inclusief alle mogelijkheden die daar bij horen. Server snippets in NGINX Ingress hebben een bekende geschiedenis van CVE's waarbij een verkeerd geconfigureerde snippet een security-bypass mogelijk maakt. NGF's SnippetsFilter heeft dezelfde risicoprofielen. Je ruilt een buggy beleidsresource in voor een krachtigere maar risicovollere workaround.

Als je de ClientSettingsPolicy-bug raakt, zijn de betere opties:

1. **Gebruik unieke route-namen over namespaces heen.** In plaats van `api` in elke namespace, gebruik `payments-api`, `orders-api`, etc. Dat is toch al een betere naamgevingsconventie.
2. **Stel body-limieten in op de service zelf**, via de applicatieconfiguratie of een sidecar.
3. **Wacht op een NGF-versie die de bug heeft opgelost** voordat je deze feature in productie zet.

### Security context en mTLS

NGF gebruikt op sommige plekken een root security context. Dat heeft een directe consequentie: mTLS is in NGF niet mogelijk op de manier waarop je dat bij Istio of Envoy Gateway zou verwachten.

mTLS vereist dat de proxy de client-certificaten kan lezen en valideren. De manier waarop NGF's root context is ingericht, staat dat niet toe op het niveau van de data plane. Als mTLS een vereiste is — en in enterprise-omgevingen is dat steeds vaker het geval — is NGF de verkeerde keuze.

Op OpenShift maakt de root security context de installatie überhaupt problematisch. OpenShift's Security Context Constraints (SCC's) blokkeren standaard containers die root vereisen. NGF uitrollen op OpenShift vereist custom SCC-configuratie, en zelfs dan zijn er beperkingen in wat de controller kan doen.

## De migratieaanpak in de praktijk

Met al het bovenstaande in het achterhoofd, dit is de aanpak die ik aanbeveel:

**Inventariseer je annotaties voor je begint.** Maak een overzicht van alle annotaties die je gebruikt over al je Ingress-resources. Splits ze op in drie categorieën:
- Annotaties die direct naar Gateway API-standaard migreren (timeouts, redirects, rewrites)
- Annotaties die naar NGF-specifieke CRDs migreren (body size via ClientSettingsPolicy)
- Annotaties waarvoor geen directe equivalent bestaat (rate limiting, sommige whitelist-patronen)

Die derde categorie zijn je risico's. Los die op voordat je begint met migreren, niet tijdens.

**Draai NGF parallel aan NGINX Ingress.** Je kunt beide controllers tegelijk draaien. Wijs in het begin alleen testverkeer of interne services toe aan NGF. Gebruik de bestaande NGINX Ingress als fallback totdat je zeker weet dat NGF stabiel werkt voor jouw use cases.

**Test je ClientSettingsPolicy-koppeling vroeg.** Als je meerdere namespaces hebt met vergelijkbare route-namen, test dan expliciet of de policies correct worden gekoppeld. Doe dit niet pas in productie.

**Documenteer de afwijkingen.** Elke plek waar je een annotatie niet één op één hebt kunnen vertalen, verdient documentatie. Dat maakt toekomstige upgrades en eventuele vendor-switches begrijpelijk.

## Is NGF de juiste keuze voor jou?

NGF is een logische stap als je NGINX Ingress gebruikt en een incrementele migratie wilt. De config-filosofie is vertrouwd, de debugging-tooling ook, en de overstap is kleiner dan naar een volledig nieuwe vendor.

Maar NGF is op dit moment een project dat nog groeit. De bugs die ik beschrijf zijn reële beperkingen — niet theoretisch, maar praktisch aangelopen in productieomgevingen. Als je gebruik maakt van features zoals mTLS, zware multi-namespace beleidsconfiguratie of strenge security context-vereisten, is NGF nu waarschijnlijk niet de juiste keuze.

In die gevallen is Istio de andere richting. Het volgende artikel in deze reeks beschrijft die migratie — inclusief waarom Istio krachtiger is, maar ook eerlijker over wat die kracht kost aan complexiteit.

**Een bekende vendor met een jong API-model is beter dan een onbekende vendor met een volwassen API — zolang je de grens van dat jonge model kent.**

### Volgende stappen

- **Migratie naar Istio:** het volgende artikel beschrijft de migratie van NGINX Ingress naar Istio, met dezelfde annotaties als uitgangspunt
- **NGF documentatie en bekende issues:** [github.com/nginxinc/nginx-gateway-fabric](https://github.com/nginxinc/nginx-gateway-fabric)
- **Gateway API conformance status voor NGF:** [gateway-api.sigs.k8s.io/implementations](https://gateway-api.sigs.k8s.io/implementations/)
- **Performance vergelijking:** [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench)

---

*Jean-Paul van Houten-Bos is DevOps Engineer gespecialiseerd in Kubernetes-netwerken. Hij heeft meerdere teams begeleid bij de migratie van NGINX Ingress naar Gateway API-implementaties in productie.*

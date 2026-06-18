---
title: "Van Ingress naar Gateway API: architectuur, vendors en hoe je kiest"
date: 2026-05-07 06:00:00 +0200
categories: [Kubernetes, Networking]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Kubernetes Ingress heeft zijn grenzen bereikt. Gateway API is het alternatief — maar welke vendor kies je, en hoe pakt die keuze uit op AKS, EKS of OpenShift? Dit artikel legt het uit."
image: /assets/img/post-default.svg
image_alt: "Van Kubernetes Ingress naar Gateway API: architectuur en vendorkeuze"
tags: [Kubernetes, Networking, Gateway API, Ingress, NGINX, Istio, AKS, EKS, OpenShift]
series: "Kubernetes Top-Down"
series_order: 10
series_path: "gateway-api-migratie-architectuur"
lang: nl
---

# Van Ingress naar Gateway API: architectuur, vendors en hoe je kiest

Als je al een tijdje met Kubernetes werkt, ken je het patroon: je begint met een Ingress-resource, plakt er een NGINX Ingress Controller achter, en voegt daarna beetje bij beetje annotaties toe. `nginx.ingress.kubernetes.io/proxy-body-size`, `nginx.ingress.kubernetes.io/limit-rps`, een whitelist hier, een timeout daar. Het werkt — maar je bouwt steeds meer op iets wat nooit bedoeld was om zo te groeien.

Kubernetes Ingress was altijd een minimale API. Het dekte het basisgeval: route HTTP-verkeer naar een service op basis van hostname en pad. Alles daarboven was leveranciersspecifieke annotaties. Geen standaard voor traffic splitting. Geen standaard voor header-based routing. Geen duidelijke scheiding tussen wie de gateway beheert en wie de routes beheert. En naarmate je platform groeit, gaan die grenzen wringen.

Gateway API is de door SIG-Network aanbevolen opvolger van Ingress voor moderne Kubernetes-netwerkarchitecturen. Ingress is niet deprecated, maar Gateway API lost een aantal ontwerpbeperkingen van de oorspronkelijke Ingress API op. Dit artikel legt uit wat het anders doet, welke vendors er zijn, hoe je een keuze maakt, en wat de impact is van de Kubernetes-distributie die je gebruikt.

## Wat er mis is met Ingress

Ingress heeft een fundamenteel ontwerpprobleem voor managed kubernetes: het is een API met één object voor verantwoordelijkheden die eigenlijk bij drie partijen horen.

Een platform-engineer wil bepalen welke load balancer er wordt ingezet en hoe die is geconfigureerd. Een security-engineer wil TLS-terminatie en access policies beheren. Een applicatieteam wil routes definiëren voor hun eigen services. In het Ingress-model doen ze dat allemaal in hetzelfde object, of erger: het platform-team zet annotaties op het Ingress-object van het applicatieteam.

Daarnaast zijn er concrete technische beperkingen:

- **Geen traffic splitting op gewicht.** Canary-releases via standaard Ingress vereisen vendor-specifieke annotaties of een service mesh.
- **Geen header-based routing.** Wil je verkeer routeren op basis van een `X-Feature-Flag` header? Annotaties.
- **De Ingress API standaardiseert alleen HTTP(S)-routing.** Ondersteuning voor gRPC, TCP, UDP en andere protocollen is afhankelijk van de gekozen controller.
- **Geen RBAC-scheiding.** Een Ingress-object zit in één namespace, maar heeft soms cluster-brede impact.

Gateway API lost dit op door de verantwoordelijkheden expliciet te splitsen.

## De structuur van Gateway API

Gateway API introduceert drie resource-typen die samen het verkeer van buiten naar binnen beschrijven.

**GatewayClass** beschrijft het type gateway — de implementatie die je gebruikt.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: gateway.nginx.org/nginx-gateway-controller
```

**Gateway** is een instantie van die class — een concreet inkomstpunt voor verkeer. De Gateway-resource uit de standaard Gateway API is altijd namespace-scoped. Sommige vendors bieden aanvullende abstraheringen of beheerlagen met clusterbreed gedrag, maar de standaard Gateway-resource zelf blijft namespace-scoped.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: prod-gateway
  namespace: gateway-infra
spec:
  gatewayClassName: nginx
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

**HTTPRoute** beschrijft de routing voor een specifieke applicatie. Dit wordt beheerd door het applicatieteam in hun eigen namespace:

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
  hostnames:
  - "api.mijnbedrijf.nl"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /payments
    backendRefs:
    - name: payments-api-svc
      port: 8080
```

Dit is de kernverandering ten opzichte van Ingress: het applicatieteam definieert hun routes zonder toegang te hebben tot de gateway-configuratie. Het platform-team bepaalt welke gateways er zijn en welke namespaces er gebruik van mogen maken. De scheiding is in de API ingebakken, niet afhankelijk van afspraken of naamgevingsconventies.

Naast HTTPRoute zijn er ook `TCPRoute`, `GRPCRoute`, `TLSRoute` en `UDPRoute` — allemaal onderdeel van dezelfde spec.

### ReferenceGrant en veilige cross-namespace koppelingen

Een van de sterkste ontwerpkeuzes van Gateway API is dat cross-namespace referenties expliciet moeten worden toegestaan.

Wanneer een route of policy een resource in een andere namespace wil gebruiken, gebeurt dat via een `ReferenceGrant`.

Dat voorkomt dat applicatieteams ongemerkt resources uit andere namespaces kunnen gebruiken en maakt multi-tenant clusters veiliger en beter beheersbaar.

### Begrijp de conformance-niveaus

Niet elke Gateway API-implementatie ondersteunt dezelfde functionaliteit.

De specificatie maakt onderscheid tussen:

* **Core** – functionaliteit die iedere conformante implementatie moet ondersteunen.
* **Extended** – optionele functionaliteit die veel implementaties ondersteunen.
* **Implementation Specific** – vendor-specifieke uitbreidingen buiten de standaard.

Een vendor die "Gateway API compatible" claimt ondersteunt dus niet automatisch alle features uit de documentatie van een andere vendor.

Controleer daarom altijd de officiële conformance-matrix voordat je een keuze maakt.

## Vendor keuze: het landschap

Er zijn tientallen implementaties van Gateway API. De meeste teams zullen kiezen uit een handvol volwassen opties. De officiële conformance-resultaten en feature-vergelijking zijn te vinden op [gateway-api.sigs.k8s.io/implementations](https://gateway-api.sigs.k8s.io/implementations/) — de meest betrouwbare bron voor wat welke vendor daadwerkelijk ondersteunt.

Voor performance-benchmarks is de [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench) repository van Howard John een goede referentie. Die laat zien hoe vendors zich verhouden op throughput, latency en resource-gebruik onder vergelijkbare omstandigheden.

De grote namen:

**NGINX Gateway Fabric (NGF)** is NGINX's eigen implementatie van Gateway API. Als je vandaag NGINX Ingress gebruikt, is dit de meest logische migratiestap. De config-structuur is vertrouwd, de debugervaring ook. NGF is relatief jong als project — er zijn nog ruwe kanten, en in sommige versies zitten bekende bugs die pas in latere releases zijn opgelost. Meer over de praktijkervaring in het volgende artikel in deze reeks.

**Envoy Gateway** is de officiële Envoy-gebaseerde implementatie, onder het beheer van de Envoy-gemeenschap. Envoy is de proxy die ook Istio en Contour gebruiken, dus de basis is bewezen. Envoy Gateway is snel, heeft uitstekende conformance scores, en is minder complex dan een volledige service mesh. Een sterke keuze als je geen service mesh nodig hebt maar wel feature-rijke routering.

**Istio** implementeert Gateway API naast zijn eigen propriëtaire API. Istio is meer dan een ingress-controller — het is een volledig service mesh-platform met mTLS, traffic policies, circuit breaking en observability ingebakken. De prijs daarvoor is complexiteit: Istio heeft een steile leercurve, de API is uitgebreid, en het gedrag verschilt significant per versie. Voor teams die de volledige service mesh-functionaliteit nodig hebben, is Istio de standaard. Voor teams die alleen betere ingress-routering willen, is het waarschijnlijk te veel.

**Cilium Gateway API** is interessant als je Cilium al gebruikt als CNI. Cilium combineert eBPF voor networking en load balancing met Envoy voor Layer-7 functionaliteit zoals HTTP-routing. Daardoor profiteer je van de integratie met het Cilium-netwerkmodel terwijl je gebruikmaakt van een volwassen proxy voor Gateway API-functionaliteit. Afhankelijk van workload en configuratie kan dit leiden tot lagere latency en minder overhead, maar de exacte winst verschilt per omgeving.

**Contour** is al langer bezig met Gateway API-ondersteuning en is stabiel en volwassen. Gebaseerd op Envoy, goed gedocumenteerd, en met name populair in VMware-omgevingen.

**Azure Application Gateway for Containers** (AGC) is Microsoft's managed Gateway API implementatie voor AKS. De control plane wordt grotendeels als managed dienst aangeboden door Azure, waardoor beheerlast voor platformteams afneemt.

### Gateway API buiten ingress: GAMMA

Gateway API wordt niet alleen gebruikt voor north-south verkeer.

Het GAMMA-initiatief (Gateway API for Mesh Management and Administration) gebruikt dezelfde API-principes voor service meshes.

Daardoor convergeren ingress-routing en mesh-routing steeds verder naar hetzelfde model. Implementaties zoals Istio en andere service meshes investeren actief in deze richting.

Voor teams die op termijn een service mesh overwegen kan dit een extra argument zijn om nu al op Gateway API te standaardiseren.

### Hoe kies je?

| Situatie | Aanbeveling |
|----------|-------------|
| Al NGINX Ingress, migratiepad met minimale impact | NGINX Gateway Fabric |
| Cilium als CNI, sterke integratie met networking-stack gewenst | Cilium Gateway API |
| Service mesh-functionaliteit nodig (mTLS, circuit breaking) | Istio |
| AKS, voorkeur voor managed oplossing | Azure Application Gateway for Containers |
| Multi-cloud of cloud-agnostisch, geen service mesh | Envoy Gateway |
| VMware omgeving of behoefte aan Envoy zonder Istio | Contour |
| Maximale portability binnen het CNCF-ecosysteem | Envoy Gateway |

Wat je niet moet doen: een vendor kiezen puur op basis van features in de documentatie. De conformance-status en openstaande issues in de GitHub-repository geven een realistischer beeld van wat er in productie werkt.

## De impact van je Kubernetes-distributie

Dit is een factor die in de meeste Gateway API-artikelen onderbelicht blijft: de Kubernetes-distributie die je draait bepaalt wat haalbaar is.

**AKS** geeft je de meeste vrijheid. Azure biedt zowel AGIC (Application Gateway Ingress Controller) als AGC (Application Gateway for Containers) als managed opties, maar je kunt ook elke andere vendor installeren.

**EKS** op AWS ondersteunt Gateway API via de AWS Gateway API-controller en integratie met AWS-loadbalancingdiensten. Controleer wel de actuele conformance-status, omdat de ondersteunde features per release kunnen verschillen.

**GKE** heeft GKE Gateway — Google's eigen managed implementatie van Gateway API. Sterk geïntegreerd met Cloud Load Balancing en relatief eenvoudig op te zetten. De beperkingen zitten in de vendor-lock-in: GKE Gateway werkt alleen op GKE.

**OpenShift** is het meest restrictieve platform als het gaat om security contexts. Sommige Gateway API-implementaties vereisen aanvullende configuratie of aangepaste security-instellingen om goed samen te werken met OpenShift SCC's. Controleer daarom altijd de documentatie van de specifieke versie die je gebruikt. De compatibiliteit verschilt sterk per implementatie en release.

De vuistregel: controleer altijd de security context-vereisten van een implementatie voordat je begint met migreren, zeker op gemanagde of opinionated platforms.

## Wat je van Ingress-annotaties kwijtraakt — en terugkrijgt

### Policies in plaats van annotaties

Een belangrijk verschil met Ingress is dat veel configuratie niet langer via annotaties gebeurt maar via aparte resources.

Sommige daarvan zijn onderdeel van de Gateway API-standaard, zoals:

* ReferenceGrant
* BackendTLSPolicy

Daarnaast leveren veel implementaties eigen policy-resources voor zaken zoals:

* Rate limiting
* Client instellingen
* Security policies
* WAF-configuratie
* mTLS-instellingen

De namen en mogelijkheden van deze resources verschillen per vendor.

Dat maakt configuratie beter valideerbaar, versieerbaar en beter te beheren door verschillende teams, maar betekent ook dat volledige portabiliteit ophoudt zodra je vendor-specifieke uitbreidingen gebruikt.

De meest concrete vraag bij een migratie: wat doe ik met al mijn annotaties?

Gateway API werkt met uitbreidingsresources in plaats van annotaties.

[rest van de bestaande sectie ongewijzigd]

## Migratiestrategie

...

**Stap 4: Verwijder de Ingress-resources pas als de migratie is geverifieerd.** Houd de Ingress Controller tijdelijk draaien als fallback. Gebruik tijdens de migratie actief de Gateway API status conditions zoals `Accepted`, `Programmed` en `ResolvedRefs`. Deze geven veel sneller inzicht in configuratieproblemen dan traditionele controllerlogs alleen.

...
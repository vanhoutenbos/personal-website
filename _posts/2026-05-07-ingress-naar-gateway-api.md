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

Gateway API is het officiële alternatief. Dit artikel legt uit wat het anders doet, welke vendors er zijn, hoe je een keuze maakt, en wat de impact is van de Kubernetes-distributie die je gebruikt.

## Wat er mis is met Ingress

Ingress heeft een fundamenteel ontwerpprobleem voor managed kubernetes: het is een API met één object voor verantwoordelijkheden die eigenlijk bij drie partijen horen.

Een platform-engineer wil bepalen welke load balancer er wordt ingezet en hoe die is geconfigureerd. Een security-engineer wil TLS-terminatie en access policies beheren. Een applicatieteam wil routes definiëren voor hun eigen services. In het Ingress-model doen ze dat allemaal in hetzelfde object, of erger: het platform-team zet annotaties op het Ingress-object van het applicatieteam.

Daarnaast zijn er concrete technische beperkingen:

- **Geen traffic splitting op gewicht.** Canary-releases via standaard Ingress vereisen vendor-specifieke annotaties of een service mesh.
- **Geen header-based routing.** Wil je verkeer routeren op basis van een `X-Feature-Flag` header? Annotaties.
- **Geen multi-protocol support.** gRPC, WebSocket, TCP — allemaal buiten de standaard spec.
- **Geen RBAC-scheiding.** Een Ingress-object zit in één namespace, maar heeft soms cluster-brede impact.

Gateway API lost dit op door de verantwoordelijkheden expliciet te splitsen.

## De structuur van Gateway API

Gateway API introduceert drie resource-typen die samen het verkeer van buiten naar binnen beschrijven.

**GatewayClass** beschrijft het type gateway — de implementatie die je gebruikt. Gateway is een namespace-scoped resource. Sommige vendors bieden additionele abstraheringen die clusterbreed gedrag mogelijk maken, maar de standaard Gateway-resource zelf is altijd namespace-scoped, soms biedt het platform team een eigen gateway aan in een andere namespace, die kun je dan prima benaderen;

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: gateway.nginx.org/nginx-gateway-controller
```

**Gateway** is een instantie van die class — een concreet inkomstpunt voor verkeer. Ook beheerd door het platform-team, maar namespace-scoped of cluster-scoped afhankelijk van de vendor:

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

## Vendor keuze: het landschap

Er zijn meer dan twintig implementaties van Gateway API. De meeste teams zullen kiezen uit een handvol volwassen opties. De officiële conformance-resultaten en feature-vergelijking zijn te vinden op [gateway-api.sigs.k8s.io/implementations](https://gateway-api.sigs.k8s.io/implementations/) — de meest betrouwbare bron voor wat welke vendor daadwerkelijk ondersteunt.

Voor performance-benchmarks is de [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench) repository van Howard John een goede referentie. Die laat zien hoe vendors zich verhouden op throughput, latency en resource-gebruik onder vergelijkbare omstandigheden.

De grote namen:

**NGINX Gateway Fabric (NGF)** is NGINX's eigen implementatie van Gateway API. Als je vandaag NGINX Ingress gebruikt, is dit de meest logische migratiestap. De config-structuur is vertrouwd, de debugervaring ook. NGF is relatief jong als project — er zijn nog ruwe kanten, en in sommige versies zitten bekende bugs die pas in latere releases zijn opgelost. Meer over de praktijkervaring in het volgende artikel in deze reeks.

**Envoy Gateway** is de officiële Envoy-gebaseerde implementatie, onder het beheer van de Envoy-gemeenschap. Envoy is de proxy die ook Istio en Contour gebruiken, dus de basis is bewezen. Envoy Gateway is snel, heeft uitstekende conformance scores, en is minder complex dan een volledige service mesh. Een sterke keuze als je geen service mesh nodig hebt maar wel feature-rijke routering.

**Istio** implementeert Gateway API naast zijn eigen propriëtaire API. Istio is meer dan een ingress-controller — het is een volledig service mesh-platform met mTLS, traffic policies, circuit breaking en observability ingebakken. De prijs daarvoor is complexiteit: Istio heeft een steile leercurve, de API is uitgebreid, en het gedrag verschilt significant per versie. Voor teams die de volledige service mesh-functionaliteit nodig hebben, is Istio de standaard. Voor teams die alleen betere ingress-routering willen, is het waarschijnlijk te veel.

**Cilium Gateway API** is interessant als je Cilium al gebruikt als CNI. Cilium implementeert Gateway API in eBPF, wat betekent dat verkeer niet via een aparte proxy-pod loopt maar direct in de kernel wordt afgehandeld. Dat levert aanzienlijk betere latency op. De trade-off is dat je aan Cilium als CNI vastzit.

**Contour** is al langer bezig met Gateway API-ondersteuning en is stabiel en volwassen. Gebaseerd op Envoy, goed gedocumenteerd, en met name populair in VMware-omgevingen.

**Azure Application Gateway for Containers** (AGC) is Microsoft's managed Gateway API implementatie voor AKS. Het runlet de gateway-controller in Azure in plaats van in je cluster, wat RBAC en beheer vereenvoudigt voor teams die diep in Azure zitten.

### Hoe kies je?

Een simpele beslisboom die ik in de praktijk gebruik:

| Situatie | Aanbeveling |
|----------|-------------|
| Al NGINX Ingress, migratiepad met minimale impact | NGINX Gateway Fabric |
| Cilium als CNI, performance is prioriteit | Cilium Gateway API |
| Service mesh-functionaliteit nodig (mTLS, circuit breaking) | Istio |
| AKS, voorkeur voor managed oplossing | Azure Application Gateway for Containers |
| Multi-cloud of cloud-agnostisch, geen service mesh | Envoy Gateway |
| VMware omgeving of behoefte aan Envoy zonder Istio | Contour |

Wat je niet moet doen: een vendor kiezen puur op basis van features in de documentatie. De conformance-status en openstaande issues in de GitHub-repository geven een realistischer beeld van wat er in productie werkt.

## De impact van je Kubernetes-distributie

Dit is een factor die in de meeste Gateway API-artikelen onderbelicht blijft: de Kubernetes-distributie die je draait bepaalt wat haalbaar is.

**AKS** geeft je de meeste vrijheid. Azure biedt zowel AGIC (Application Gateway Ingress Controller) als AGC (Application Gateway for Containers) als managed opties, maar je kunt ook elke andere vendor installeren. Node-security contexts zijn standaard behoorlijk permissief, wat installatie van controllers met root-vereisten makkelijker maakt — maar niet per se veiliger.

**EKS** op AWS werkt goed met AWS Load Balancer Controller voor de gateway-laag, maar dat is geen Gateway API-implementatie in de strikte zin. Voor pure Gateway API-conformance op EKS werkt Envoy Gateway of Istio het best. Let op dat EKS-nodepools soms beperkingen hebben op privileged containers afhankelijk van je node-configuratie.

**GKE** heeft GKE Gateway — Google's eigen managed implementatie van Gateway API. Sterk geïntegreerd met Cloud Load Balancing en relatief eenvoudig op te zetten. De beperkingen zitten in de vendor-lock-in: GKE Gateway werkt alleen op GKE.

**OpenShift** is het meest restrictieve platform als het gaat om security contexts. OpenShift heeft standaard strenge Security Context Constraints (SCC's). Veel Gateway API-implementaties die root of privileged containers vereisen, werken niet out-of-the-box op OpenShift. NGF gebruikt op sommige plekken een root security context, wat op OpenShift problemen geeft — en ook mTLS onmogelijk maakt omdat de certificaat-handling daar root-rechten verwacht. Istio heeft specifieke OpenShift-ondersteuning via Red Hat's Istio-distributie (onderdeel van OpenShift Service Mesh), maar dat is een ander product dan upstream Istio. Als je op OpenShift zit, is de vendor-keuze daadwerkelijk beperkt tot implementaties die SCC-conform zijn.

De vuistregel: controleer altijd de security context-vereisten van een implementatie voordat je begint met migreren, zeker op gemanagde of opinionated platforms.

## Wat je van Ingress-annotaties kwijtraakt — en terugkrijgt

De meest concrete vraag bij een migratie: wat doe ik met al mijn annotaties?

Gateway API werkt met uitbreidingsresources in plaats van annotaties. De exacte resource-namen variëren per vendor, maar de patronen zijn vergelijkbaar:

| Nginx Ingress-annotatie | Gateway API-equivalent |
|------------------------|------------------------|
| `proxy-body-size` | `ClientSettingsPolicy` (requestBodySize) |
| `proxy-read-timeout` / `proxy-send-timeout` | HTTPRoute `timeouts` veld (v1.1+) of `BackendLBPolicy` |
| `whitelist-source-range` | HTTPRoute filter of `SecurityPolicy` |
| `limit-rps` / `limit-connections` | `RateLimitPolicy` of vendor-specifieke filter |
| `ssl-redirect` | HTTPRoute redirect filter (standaard) |
| `rewrite-target` | HTTPRoute `URLRewrite` filter (standaard) |
| `proxy-buffering` / `proxy-buffers` | Vendor-specifieke policy |

De standaard-features zitten in de spec. De vendor-specifieke uitbreidingen — rate limiting, client-settings, mTLS-configuratie — zitten in aparte CRD's die per implementatie anders heten. Dat betekent dat een migratie van vendor A naar vendor B minder portable is dan de spec doet vermoeden.

## Migratiestrategie

Een big bang-migratie — alle Ingress-resources tegelijk omzetten — is vrijwel altijd een slecht idee. De aanpak die werkt:

**Stap 1: Installeer Gateway API parallel aan je bestaande Ingress-setup.** Beide kunnen naast elkaar draaien. Gebruik in eerste instantie een andere hostname of een afgeschermde testnamespace.

**Stap 2: Migreer per team of namespace.** Begin met de minst kritische services. Leer de quirks van de implementatie kennen voordat je productieverkeer migreert.

**Stap 3: Annotaties één voor één vertalen.** Maak per annotatie een expliciete keuze: zit dit in de standaard Gateway API-spec, of heb ik een vendor-extensie nodig? Documenteer wat je kiest en waarom.

**Stap 4: Verwijder de Ingress-resources pas als de migratie is geverifieerd.** Houd de Ingress Controller tijdelijk draaien als fallback.

De volgende twee artikelen in deze reeks beschrijven de migratie in de praktijk: eerst van NGINX Ingress naar NGINX Gateway Fabric, daarna van NGINX Ingress naar Istio. Inclusief de annotatie-mapping, de gevonden problemen en de workarounds.

## Conclusie

Gateway API is geen marginale verbetering op Ingress — het is een fundamenteel ander ontwerp dat de verantwoordelijkheden op de goede plek legt. De overstap kost tijd en vereist een bewuste vendorkeuze, maar het levert een robuustere en beter beheersbare netwerklaag op.

De vendorkeuze is niet universeel. Die hangt af van wat je al gebruikt, welke features je echt nodig hebt, en welk platform je op draait. Lees de conformance-resultaten, kijk naar de performance-benchmarks, en test op je eigen platform voordat je een keuze definitief maakt.

**De belofte van Gateway API is portabiliteit — maar die portabiliteit stopt waar de vendor-extensies beginnen. Kies bewust.**

### Volgende stappen

- **Migratie naar NGINX Gateway Fabric:** het volgende artikel in deze reeks gaat in op de praktijk — annotatie-mapping, bekende bugs en workarounds
- **Conformance-status per vendor:** [gateway-api.sigs.k8s.io/implementations](https://gateway-api.sigs.k8s.io/implementations/)
- **Performance benchmarks:** [gateway-api-bench](https://github.com/howardjohn/gateway-api-bench) door Howard John
- **Gateway API spec lezen:** [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/)

---

*Jean-Paul van Houten-Bos is DevOps Engineer gespecialiseerd in Kubernetes-netwerken en cloud-native architecturen. Hij begeleidt teams bij de migratie van traditionele Ingress-setups naar Gateway API in productieomgevingen.*

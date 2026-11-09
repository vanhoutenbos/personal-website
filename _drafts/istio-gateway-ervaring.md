---
title: "Istio Gateway in de praktijk: architectuur en learnings"
date: 2026-11-09
draft: true
categories: [Kubernetes, Networking]
---

# Istio Gateway in de praktijk: architectuur en learnings

> **Werkdraft:** beantwoord de vragen tussen de secties. Antwoorden mogen voorlopig steekwoorden zijn. Daarna maken we er een doorlopend artikel van.

## Waarom Istio Gateway?

De migratiepost beschrijft waarom Istio als alternatief voor NGINX Ingress is gekozen. Dit artikel zoomt in op de architectuur die daadwerkelijk draait en op wat je tijdens het gebruik hebt geleerd.

- Wat was de concrete aanleiding om Istio Gateway te gebruiken?
- Welke vereisten waren doorslaggevend (bijvoorbeeld Gateway API, TLS, certificaatvalidatie, policies, andere)?
- Welke alternatieven zijn serieus overwogen, en waarom vielen die af?
- Wat verwachtte je vooraf van Istio, en welke verwachting bleek niet te kloppen?
- Welke passage uit de bestaande migratiepost moeten we hier alleen kort aanhalen en waarnaar linken?

## De architectuur en request-flow

Beschrijf de daadwerkelijke verkeersstroom, van de externe client tot aan de applicatie.

- Welke resources staan in de configuratie: `GatewayClass`, `Gateway`, `HTTPRoute` en eventuele aanvullende Istio-resources?
- Welke component maakt en beheert de Gateway-proxy? Is deze door de Gateway API-controller aangemaakt of op een andere manier uitgerold?
- Waar vindt TLS-terminatie plaats? Welke verbindingen bestaan er daarna richting backend?
- Hoe worden DNS, load balancer, listener, route en backend aan elkaar gekoppeld?
- In welke namespaces staan Gateway, routes, Secrets en applicaties? Welke cross-namespace koppelingen spelen een rol?
- Welke onderdelen zijn standaard Gateway API en welke zijn Istio-specifiek?
- Kun je een vereenvoudigd architectuurdiagram of request-flow opschrijven?

**Versies voor de publicatie:** Kubernetes: [...], Istio: [...], Gateway API: [...], cloud/platform: [...].

### Testomgeving en geteste parameters

Leg de omgeving vast waarin de voorbeelden echt zijn getest. OpenShift 4.22 is het uitgangspunt voor deze reeks; vul de overige gegevens in en schrijf expliciet op wat niet is getest. Een lezer moet kunnen onderscheiden welke ervaring OpenShift-specifiek is en wat waarschijnlijk breder geldt.

| Parameter | Geteste waarde |
|---|---|
| Platform/distributie | OpenShift 4.22 ([exacte release/build indien relevant]) |
| Installatie van Istio | [upstream Istio / Red Hat OpenShift Service Mesh / anders; operator of Helm en versie] |
| Istio control plane | [versie en installatieprofiel] |
| Gateway dataplane | [Gateway API-managed gateway / anders; image en Envoy-versie indien bekend] |
| Gateway API | [CRD release/version en gebruikte API versions] |
| GatewayClass/controller | [naam en controllerName] |
| OpenShift exposure | [LoadBalancer / NodePort / OpenShift Route / anders; beschrijf de externe verkeersroute] |
| Netwerk/CNI | [OpenShift SDN of OVN-Kubernetes; relevante configuratie] |
| Gateway-namespace en security | [namespace, service account, SCC/security context indien relevant] |
| TLS/certificaatbeheer | [Secret type, issuer of handmatige rotatie; geen certificaatinhoud] |
| Testclient en testmethode | [curl, openssl, applicatieclient, testomgeving] |
| Niet getest | [andere OpenShift/Istio-versies, cloudplatformen, installatiemethoden] |

**Vragen om de scope scherp te maken:**

- Is dit upstream Istio op OpenShift, Red Hat OpenShift Service Mesh, of een andere distributie? Welke support- en lifecycle-afweging hoort daarbij?
- Hoe wordt de Gateway van buiten het cluster bereikt? Zit er vóór Envoy een OpenShift Route of load balancer, en waar eindigt TLS precies?
- Welke OpenShift-specifieke permissies of security constraints waren nodig om de Gateway-pods te laten draaien?
- Zijn de voorbeelden getest op een schone omgeving en na een upgrade, of alleen op de huidige clusterconfiguratie?

## Van configuratie naar werkende Gateway

- Hoe ziet de kleinste werkende `Gateway` en `HTTPRoute` eruit in jouw setup?
- Hoe wordt de Gateway geïnstalleerd en beheerd (bijvoorbeeld Helm, GitOps of platform automation)?
- Welke configuratie staat centraal bij het platformteam en welke kunnen applicatieteams zelf beheren?
- Welke `status.conditions` of andere signalen gebruik je om te zien dat Gateway en route geaccepteerd zijn?
- Welke commando's of dashboards gebruik je om de gegenereerde Envoy-configuratie te controleren?
- Wat was de eerste configuratiefout die je tegenkwam, en hoe heb je die gevonden?

**Code om later toe te voegen:** minimale, opgeschoonde YAML voor de Gateway en één route. Geen interne domeinen, IP-adressen of secrets.

Noem bij ieder codevoorbeeld de API-versies en prerequisites. Scheid generieke Gateway API-YAML van OpenShift/Istio-specifieke installatie- of exposure-stappen. Beschrijf eventuele handmatige stappen en defaults die in jouw cluster anders zijn ingesteld.

## Wat bleek anders dan verwacht?

- Wat was de vreemdste of minst intuïtieve Gateway/Istio-eigenaardigheid?
- Welke instelling leek goed, maar werd niet toegepast? Hoe ontdekte je waarom?
- Welke foutmelding of status was misleidend?
- Waren er namespace-, referentie- of permissieproblemen? Wat was de oplossing?
- Welke documentatie of versie-afhankelijkheid kostte de meeste tijd?
- Welke tip had je graag vóór de implementatie geweten?

## Security en verantwoordelijkheden

- Welke security-eigenschappen levert de Gateway-configuratie zelf, en welke moeten door de applicatie of het platform worden afgedwongen?
- Hoe voorkom je dat clients zelf headers meesturen die als identiteit of vertrouwenssignaal worden gezien?
- Wie mag Gateway-resources, routes, policies en certificaat-Secrets aanpassen?
- Kan verkeer de backend buiten de Gateway om bereiken? Zo ja, is dat gewenst en hoe wordt het beheerst?
- Welke onderdelen zijn in productie nog niet opgelost of bewust buiten scope gelaten?

> Dit artikel gaat over Istio als Gateway. De setup gebruikt geen Istio service mesh; mesh-capabilities komen alleen terug in de latere verkenning.

## Conclusies en advies

- Voor welk type workload of team is deze aanpak geschikt gebleken?
- Wat zou je hetzelfde doen bij een volgende implementatie?
- Wat zou je anders doen?
- Wanneer zou je Istio Gateway juist niet adviseren?
- Welke open vragen zijn een eigen vervolgpost waard?

## Bronnen en vervolg

- Welke officiële Istio- en Gateway API-documentatie sloot aan op de gebruikte versies?
- Link terug naar [NGINX Ingress naar Istio](../_posts/2026-05-21-nginx-ingress-naar-istio.md) voor de migratie-afweging.
- Verwijs naar de volgende conceptpost over [PKI-clientcertificaten, mTLS en OIN](./istio-gateway-pki-mtls.md).

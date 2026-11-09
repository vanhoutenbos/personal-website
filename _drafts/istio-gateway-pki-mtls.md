---
title: "mTLS aan de Istio Gateway: PKI-clientcertificaat en OIN"
date: 2026-11-09
draft: true
categories: [Kubernetes, Networking, Security]
---

# mTLS aan de Istio Gateway: PKI-clientcertificaat en OIN

> **Werkdraft:** deze post gaat over clientcertificaat-authenticatie aan de Gateway, niet over mTLS tussen workloads in een Istio service mesh. Vul de vragen aan vanuit jouw implementatie. Gebruik alleen fictieve certificaatgegevens en OIN-waarden.

## Geteste omgeving en scope

De PKI- en Envoy-configuratie is alleen reproduceerbaar als de platform- en componentversies erbij staan. OpenShift 4.22 is het uitgangspunt; vul de rest in en vermeld expliciet wat je niet hebt getest.

| Parameter | Geteste waarde |
|---|---|
| Platform/distributie | OpenShift 4.22 ([exacte release/build indien relevant]) |
| Istio-distributie en installatie | [upstream Istio / Red Hat OpenShift Service Mesh / anders; operator of Helm en versie] |
| Istio- en Envoy-versie | [versie(s)] |
| Gateway API | [CRD release/version en gebruikte API versions] |
| Gateway workload | [GatewayClass/controller, namespace en relevante selector] |
| Externe TLS-route | [client → eventuele Route/load balancer → Envoy; TLS-terminatiepunten] |
| Backendverbinding | [protocol en TLS wel/niet; geen mesh aannemen] |
| Clientcertificaat- en CA-profiel | [testcertificaatprofiel en test-CA; geen echte identificatoren] |
| Testmethode | [client/tooling, verwachte positieve en negatieve resultaten] |
| Niet getest | [versies, platformen en alternatieve installaties] |

- Is dit upstream Istio op OpenShift of Red Hat OpenShift Service Mesh? Welke gevolgen heeft dat voor ondersteunde versies, installatie en upgrades?
- Staat er een OpenShift Route of andere proxy vóór de Gateway? Zo ja, wordt TLS daar doorgestuurd of daar al beëindigd?
- Welke OpenShift-specifieke netwerk- of pod-security-instellingen waren noodzakelijk?

## De use case

- Welke applicatie of API moest clientcertificaten accepteren?
- Waarom was een PKI-certificaat nodig en waarom moest de applicatie de OIN kunnen gebruiken?
- Wie zijn de clients (bijvoorbeeld organisaties, systemen of gebruikerscategorieën; geanonimiseerd)?
- Welke beslissing neemt de applicatie op basis van de certificaatidentiteit/OIN?
- Wat waren de security- en functionele eisen?

## Wat betekent mTLS in deze Gateway-architectuur?

- Welke TLS-verbinding maakt de client met de Gateway?
- Welk servercertificaat presenteert de Gateway?
- Wanneer en hoe wordt het clientcertificaat gevalideerd?
- Welke CA-keten vertrouwt de Gateway, en hoe wordt vastgesteld dat dit de juiste trust anchor is?
- Waar eindigt TLS? Wat voor verbinding gebruikt de Gateway daarna naar de backend?
- Krijgt de backend het originele certificaat, of alleen door de Gateway afgeleide certificaatinformatie?
- Wat is het verschil tussen authenticatie van het certificaat en autorisatie van de bijbehorende identiteit?

## De twee Kubernetes Secrets

Dit is een belangrijk praktisch leermoment, maar de precieze reden moet uit de echte configuratie worden afgeleid; maak er geen algemene Istio-regel van.

- Welke twee Secrets maak je? Wat zijn hun namen en namespaces (vervang echte namen door fictieve voorbeelden)?
- Welke component consumeert elk Secret?
- Welke data-keys bevat ieder Secret, bijvoorbeeld `tls.crt`, `tls.key` of `ca.crt`? Bevatten Secrets certificaatketens of alleen certificaten?
- Waarom werkte één Secret in jouw geval niet? Welke fout of configuratiebeperking liet dat zien?
- Hoe zijn de Secrets aangemaakt en geroteerd?
- Welke RBAC- of opslagmaatregelen beperken toegang ertoe?

**Schema om na beantwoording in te vullen:**

| Secret (fictieve naam) | Gebruikt door | Bevat (bestandsnamen, geen inhoud) | Doel |
|---|---|---|---|
| `[...]` | `[...]` | `[...]` | `[...]` |
| `[...]` | `[...]` | `[...]` | `[...]` |

## Van gevalideerd certificaat naar OIN in de applicatie

- Hoe haalt Envoy of de `EnvoyFilter` de relevante certificaatinformatie op?
- Welke filter- of requestfase wordt aangepast, en waarom op die plek?
- Hoe wordt de OIN uit het certificaat gevonden of afgeleid? Welk veld of welke extensie is relevant (zonder echte waarde)?
- In welke vorm ontvangt de backend de identiteit (header, metadata of iets anders)?
- Welke precieze headernaam en encoding gebruiken jullie? Vervang interne namen desgewenst door representatieve voorbeelden.
- Hoe test je dat het om de identiteit uit het gevalideerde certificaat gaat, en niet om een waarde die de client zelf heeft ingestuurd?
- Wat gebeurt er met requests zonder certificaat, met een niet-vertrouwde CA of met een certificaat zonder verwachte OIN?

**Flow in één regel:** client → [...] → Gateway TLS-validatie → [...] → backend.

## EnvoyFilter: waarom nodig en hoe veilig houden?

- Welke functionaliteit ontbrak in de standaard Gateway API-configuratie of bestaande Istio-resources?
- Waarom was `EnvoyFilter` de gekozen oplossing? Welke alternatieven heb je onderzocht?
- Op welke Gateway-workload, listener, context en filter chain matcht de filter?
- Welke selectors en matchvoorwaarden beperken de impact tot de bedoelde Gateway?
- Hoe controleer je de resulterende Envoy-configuratie?
- Welke Istio- of Envoy-upgrade kan deze configuratie breken? Hoe wordt dat vóór productie getest?
- Welke eigenaar, documentatie, test en rollback horen bij deze filter?

**Code om later toe te voegen:** geredigeerde `EnvoyFilter` en alleen de relevante Gateway/Secret-referenties. Verwijder private keys, certificaatinhoud, echte domeinen en organisatie-identificatoren.

Vermeld direct boven elk manifest welke versies/API-versies erbij horen en of het manifest ongewijzigd op OpenShift 4.22 is getest. Als een veld, filternaam of match afhankelijk is van Envoy/Istio-versie, benoem die afhankelijkheid expliciet.

## Security-review van de trust boundary

- Kan een externe client zelf de header/metadata aanleveren die de backend als OIN vertrouwt?
- Overschrijft of verwijdert de Gateway zulke aangeleverde waarden vóór hij de geverifieerde waarde zet?
- Kan een client de backend rechtstreeks bereiken en daarmee de Gateway omzeilen?
- Hoe weet de applicatie dat de identity-header van een vertrouwde Gateway komt?
- Welke certificaat-, keten-, geldigheids- en revocation-controles worden uitgevoerd?
- Welke logs zijn nuttig voor audit/troubleshooting, en welke certificaatgegevens moeten juist niet worden gelogd?
- Hoe verlopen certificaat- en CA-rotatie? Wat gebeurt er tijdens overlap of bij een foutieve rotatie?
- Welke tests bewijzen de negatieve gevallen (ongeldig, verlopen, ontbrekend of verkeerd certificaat)?

## Troubleshooting en lessons learned

- Wat was de fout die je het langst kostte om te diagnosticeren?
- Welke `kubectl`-status, logregel, metric of Envoy-inspectie gaf uiteindelijk de doorbraak?
- Welke onverwachte eigenschap van Secrets, certificaatketens of Envoy-filtervolgorde bleek belangrijk?
- Wat moet iemand versie-specifiek controleren voordat die jouw voorbeeld overneemt?
- Welke configuratie zou je nu anders ontwerpen?

## Afsluiting

- Wat is de belangrijkste les voor platform engineers?
- Wat moet het ontwikkelteam zelf valideren?
- Wat moet een security reviewer expliciet controleren?
- Welke details zijn specifiek voor jouw PKI of organisatie en dus niet één-op-één overdraagbaar?

## Bronnen en vervolg

- Link terug naar [Istio Gateway in de praktijk](./istio-gateway-ervaring.md).
- Noteer exacte Istio-, Envoy-, Kubernetes- en Gateway API-versies en link naar bijpassende documentatie.
- Verwijs alleen naar officiële PKI-documentatie die publiek gedeeld mag worden.

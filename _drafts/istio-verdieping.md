---
title: "Istio: conceptreeks en interviewvragen"
date: 2026-11-09
draft: true
categories: [Kubernetes, Networking, Security]
---

# Istio: van Gateway-learnings naar bredere mogelijkheden

Dit document is de inhoudsopgave en werkvolgorde voor drie conceptposts. De posts zijn bewust opgezet als vragen aan de auteur: beantwoord de vragen vanuit je ervaring, dan werken we de antwoorden daarna om tot een samenhangend verhaal.

Voor de technische posts is OpenShift 4.22 de gemelde testbasis. Leg ook vast welke Istio-distributie en installatiemethode zijn gebruikt, welke Istio- en Gateway API-versies/controller actief zijn, hoe verkeer van buiten bij Envoy komt, en welke voorbeelden daadwerkelijk op dit platform zijn getest. Neem geen OpenShift- of Istio-defaults aan zonder die te controleren.

## Volgorde

1. **Istio Gateway in de praktijk: architectuur en learnings** — eerst de setup die je echt gebruikt; onderscheidt zich van de bestaande migratiepost door in te zoomen op runtime, ontwerpkeuzes en praktijklessen.
2. **mTLS aan de Istio Gateway: PKI-clientcertificaat en OIN** — de security- en development-deep dive, inclusief de twee Secrets en EnvoyFilter.
3. **Wat kan Istio nog meer? Van Gateway naar service mesh** — verbreedt het perspectief naar mesh en andere Istio-mogelijkheden; maak duidelijk wat eigen ervaring is en wat een verkenning.

De nummering 13–15 is voorlopig en sluit aan op de bestaande serievolgorde: de artikelen over Gateway API, NGF-migratie en Istio-migratie hebben volgorde 10–12.

## Relatie met bestaande artikelen

- [Van Ingress naar Gateway API](../_posts/2026-05-07-ingress-naar-gateway-api.md): architectuur en keuze van Gateway API-implementaties.
- [NGINX Ingress naar NGINX Gateway Fabric](../_posts/2026-05-14-nginx-ingress-naar-nginx-gateway-fabric.md): alternatief migratiepad.
- [NGINX Ingress naar Istio](../_posts/2026-05-21-nginx-ingress-naar-istio.md): migratie-afwegingen en vertaling van NGINX-annotaties.

Herhaal in de nieuwe posts niet de vendorvergelijking of annotatie-voor-annotatie-migratie. Verplaats bestaande passages pas nadat duidelijk is welke post de informatie het beste nodig heeft; behoud de bestaande post als migratieverhaal.

## Werkwijze

Beantwoord de vragen in de drie drafts in steekwoorden of met ruwe technische details. Deel geen private keys, echte certificaatgegevens, echte OIN-nummers, interne hostnamen of andere vertrouwelijke gegevens. Noteer bij configuratie de OpenShift-, Istio-, Envoy- en Gateway API-versies, en label uitspraken als **eigen ervaring**, **algemene uitleg**, **lab-getest** of **nog te verifiëren**.

Werk eerst post 13 uit. Gebruik de antwoorden om te bepalen hoeveel configuratie- en troubleshootingdetail nodig is in post 14. Begin post 15 pas daarna: die kan dan voortbouwen op wat de Gateway in jouw architectuur wel en niet doet.

## Conceptposts

- [13. Istio Gateway in de praktijk](./istio-gateway-ervaring.md)
- [14. PKI-clientcertificaat, mTLS en OIN](./istio-gateway-pki-mtls.md)
- [15. Van Istio Gateway naar service mesh](./istio-mogelijkheden-service-mesh.md)

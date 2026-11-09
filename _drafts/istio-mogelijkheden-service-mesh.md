---
title: "Wat kan Istio nog meer? Van Gateway naar service mesh"
date: 2026-11-09
draft: true
categories: [Kubernetes, Networking, Architecture]
---

# Wat kan Istio nog meer? Van Gateway naar service mesh

> **Werkdraft voor later in de reeks:** onze huidige ervaring is Istio als Gateway, niet als service mesh. Gebruik de Gateway-posts als basis en scheid eigen ervaring duidelijk van documentatieonderzoek, een labproef of toekomstig plan.

## Referentieomgeving en ervaringsniveau

De eerdere Gateway-artikelen zijn gebaseerd op OpenShift 4.22 en de concrete Istio-installatie die daar is getest. Vul exacte componentversies in via de testomgevingstabel van die artikelen. Voor service mesh geldt: markeer elke capability als **zelf getest**, **in een lab getest**, **uit documentatie beschreven** of **nog niet onderzocht**. Presenteer Gateway-ervaring niet als productie-ervaring met mesh.

- Is service mesh in dezelfde OpenShift/Istio-distributie beschikbaar en ondersteund?
- Welke verschillen tussen upstream Istio en de gebruikte OpenShift-integratie moeten lezers kennen?
- Zijn sidecar en ambient mode daadwerkelijk beschikbaar/getest in de relevante versie, of bespreek je ze alleen conceptueel?
- Welke claims zijn bevestigd op OpenShift 4.22 en welke gelden mogelijk alleen voor andere Istio-versies of platformen?

## Waarom breder kijken?

- Welke vraag kwam op nadat je Istio als Gateway had leren kennen?
- Welke Istio-capabilities wil je verkennen en waarom?
- Is er een concreet probleem dat een service mesh zou oplossen, of gaat het om een architectuurverkenning?
- Welke onderwerpen verdienen een eigen artikel in plaats van een sectie hier?

## Gateway en service mesh zijn verschillende rollen

- Wat betekent north-south verkeer in jouw huidige Gateway-opzet?
- Wat zou east-west verkeer tussen services toevoegen?
- Welke onderdelen uit de Gateway-artikelen blijven bruikbaar als je óók een mesh inzet?
- Welke onderdelen van je bestaande architectuur zouden dan veranderen?
- Hoe voorkom je de misvatting dat Istio Gateway automatisch betekent dat applicaties in een mesh zitten?

## Wat biedt een service mesh?

Vul alleen mogelijkheden in die je wilt uitleggen; maak onderscheid tussen Istio-capability en wat je daadwerkelijk hebt getest.

- Wat zou mesh-mTLS tussen workloads opleveren, en welk probleem lost het op?
- Welke identity- en autorisatiepatronen tussen services zijn relevant?
- Zijn traffic management, retries, timeouts, circuit breaking of canary-routing nodig binnen het cluster?
- Welke telemetry of tracing wil je uit de netwerklaag halen?
- Wat zouden sidecars of ambient mode betekenen voor jouw workloads en platform?
- Welke eisen stellen deze opties aan latency, resources, debugging en teamkennis?

## Architectuur en operationele afwegingen

- Welke workloads zouden in scope zijn voor een mesh en welke juist niet?
- Hoe zou onboarding en uitsluiten van workloads werken?
- Welke afhankelijkheid ontstaat van control plane, dataplane-configuratie en certificaatuitgifte?
- Hoe zouden upgrades, incident response en troubleshooting veranderen?
- Welke risico's ontstaan door extra proxy's of policy-lagen?
- Welke organisatorische verantwoordelijkheid hoort bij platform, security en applicatieteams?

## Hoe zou je dit verantwoord onderzoeken?

- Kun je het idee eerst in een lab valideren? Welke representatieve services heb je nodig?
- Welke meetbare succescriteria bepalen of de mesh waarde toevoegt?
- Welke tests zijn nodig voor connectiviteit, identiteit, policy en performance?
- Hoe voorkom je dat een verkenning als productie-ervaring wordt gepresenteerd?
- Welke Istio-versie en modus (sidecar/ambient) onderzoek je, en waarom?

## Conclusie: nu, later of niet?

- Is een service mesh op basis van de verkenning nodig, mogelijk nuttig of overbodig?
- Welke problemen lost Istio Gateway al op zonder mesh?
- Wat zou eerst moeten veranderen voordat je een mesh overweegt?
- Welke vervolgpost of hands-on proef is de logische volgende stap?

## Bronnen en vervolg

- Link terug naar [Istio Gateway in de praktijk](./istio-gateway-ervaring.md) en de [PKI/mTLS-case](./istio-gateway-pki-mtls.md).
- Gebruik bronnen die passen bij de onderzochte Istio-versie en markeer nog niet geteste claims.

---
layout: single
title: "Waarom kiezen zoveel developers voor Kubernetes?"
permalink: /blog/:year/:month/:day/:title.html
date: 2025-10-15 06:00:00 +0200
description: "Ontdek wanneer Kubernetes wel of niet de juiste keuze is voor jouw organisatie. Een praktische gids over schaalbaarheid, kostenbeheer en soevereiniteit, met persoonlijke ervaringen uit het veld."
image: /assets/img/post-default.svg
image_alt: "Kubernetes container orchestration"
categories: [blog, kubernetes]
toc: true
lang: nl
excerpt: "Wanneer kies je wél of niet voor Kubernetes? Gids over schaalbaarheid, kostenbeheer en soevereiniteit met praktijkvoorbeelden."
tags: [kubernetes, AKS, OpenShift, containers, schaalbaarheid, kostenbeheer, cloud native, soevereiniteit]
series: "Kubernetes Top-Down"
---

# Waarom kiezen zoveel developers voor Kubernetes?

Je hebt er ongetwijfeld over gehoord: Kubernetes. Dat magische platform dat schaalbaarheid belooft, kosten moet besparen en de toekomst van cloud-native applicaties zou zijn. Maar klopt dat verhaal eigenlijk wel? En belangrijker: is het iets voor jouw organisatie?


> 💡 **Tip:** Wil je weten welk Kubernetes-platform het beste bij jouw situatie past? Lees ook mijn [Kubernetes Keuzehulp](../2025-10-29-kubernetes-keuzehulp) voor een complete vergelijking en beslismatrix.


Na jaren ervaring met Kubernetes – van mijn eerste stappen met Docker Swarm tot complexe productie-omgevingen – deel ik graag een eerlijk verhaal over wanneer je wel en niet voor Kubernetes moet kiezen. Geen hype, gewoon praktische inzichten.

## Wat is Kubernetes eigenlijk?

Kubernetes is een **container orchestration platform** dat oorspronkelijk binnen Google is ontstaan om hun schaalbaarheid-uitdagingen op te lossen. Het is uitgegroeid tot het de-facto platform voor het beheren van gecontaineriseerde applicaties – en dat niet zonder reden.

Wat maakt Kubernetes zo bijzonder? Het is **platform-agnostisch** en **taal-onafhankelijk**. Of je nu PHP, C#, Python, Java of Go schrijft, of je draait een frontend, een API, een database of cron jobs – Kubernetes kan het allemaal orchestreren. Deze flexibiliteit, gecombineerd met **vendor-soevereiniteit** (je bent niet vast aan één cloudprovider), heeft ervoor gezorgd dat Kubernetes de nieuwe standaard is geworden, waar traditionele VM's ooit waren.

### Mijn eerste kennismaking

Mijn eerste echte ervaring was bij GGN, waar we een platform bouwden dat automatisch bankbetalingen moest koppelen aan dossiers. Soms waren dat een paar betalingen per dag, soms duizenden. Het moest **schaalbaar** zijn – alle verwerkingen moesten klaar zijn voordat de werkdag begon, zodat medewerkers eventuele uitval konden behandelen.

We kozen toen voor Docker Swarm (een Kubernetes-alternatief), en werkten samen met een ervaren partner. Het resultaat was een extreem schaalbaar platform waarop zowel de backend-koppelingen als de frontend voor medewerkers draaiden. Ik kwam van een achtergrond met weinig operations-ervaring – ik had nauwelijks met IIS of VM's gewerkt – dus de leercurve was groot. Maar met het juiste team leerde ik snel de principes van container orchestration.

Die ervaring leerde me één ding: **schaalbaarheid hoeft niet complex te zijn, als je het juiste platform kiest**.

## Het probleem dat Kubernetes oplost

Laat me een metafoor gebruiken: **Kubernetes is als een intelligent openbaar vervoer systeem**.

Traditioneel hadden we tijdens daluren veel te veel treinen (servers) rijden die voor 5% bezet waren. Tijdens piekuren hadden we juist te weinig capaciteit. Met Kubernetes kun je binnen enkele minuten je capaciteit vervijfvoudigen of zelfs vertienvoudigen, en even snel weer afschalen als het rustiger wordt. Je kunt treinen langer maken (verticaal opschalen) of meer treinen inzetten (horizontaal opschalen).

**Het resultaat?** Je gooit geen geld weg aan servers die niemand gebruikt.

### Het oude probleem: gokken met capaciteit

Vóór Kubernetes was capaciteitsplanning grotendeels giswerk. Je deed loadtests, maakte een educated guess, en schaalde op basis van verwachtingen. Het resultaat? Servers die voor 95% van de tijd bijna niks deden, maar wel voor 100% betaald moesten worden. Of erger: servers die crashten tijdens onverwachte piekbelasting.

Kubernetes lost dit op met **auto-scaling**: je platform schaalt automatisch op en af op basis van daadwerkelijk gebruik. En met managed services zoals **Azure Kubernetes Service (AKS)** wordt het beheer nog eenvoudiger.

## Wanneer is Kubernetes de juiste keuze?

Kubernetes is niet voor iedereen. Laten we eerlijk zijn over wanneer het wel en niet zinvol is.

### Kubernetes is geschikt als:

- **Je schaalbaarheid nodig hebt**: Je applicatie moet kunnen groeien van 10 naar 10.000 gebruikers zonder handmatige interventie
- **Je multi-cloud of hybrid-cloud** strategieën overweegt: souvereiniteit en vendor-lock-in voorkomen zijn belangrijk
- **Je complexe applicaties** hebt met meerdere services (microservices-architectuur)
- **Je zero-downtime deployments** wilt: rolling updates zonder dat gebruikers het merken
- **Je self-healing** belangrijk vindt: containers die automatisch herstarten bij crashes
- **Kostenbeheer** essentieel is: betaal alleen voor wat je daadwerkelijk gebruikt

### Kubernetes is overkill als:

- Je een **simpele website** hebt (zoals een CV-site of klein portfolio)
- Je een **enkele applicatie** draait zonder schaalbaarheid-eisen
- Je **geen DevOps/operations-capaciteit** hebt om het platform te onderhouden (tenzij je kiest voor volledig beheerde oplossingen)
- Je team **geen ervaring** heeft met containers en de leercurve te steil is voor je tijdslijn

Voor eenvoudige scenario's zijn alternatieven zoals **Azure App Service**, **Azure Container Instances (ACI)** of zelfs statische hosting vaak een betere keuze.

## Voordelen voor developers: vrijheid en flexibiliteit

Als developer vind ik **taal-agnosticisme** het grootste voordeel. Je kunt in dezelfde organisatie Python-developers, C#-engineers en frontend-specialisten hebben, en iedereen kan hun applicaties op hetzelfde platform draaien. Multi-disciplinaire teams worden hierdoor veel efficiënter.

Daarnaast is het **zelf hosten van tooling** fantastisch. Wil je een RabbitMQ-cluster voor messaging? Een Redis-cache voor snellere responses? Een PostgreSQL-database? Je spint deze met een paar commando's op, volledig geïntegreerd in je Kubernetes-cluster.

### Developer experience verbeteringen

Moderne tools zoals **Helm** (package manager voor Kubernetes) en **GitOps-workflows** maken deployment eenvoudiger dan ooit. Je definieert je gewenste state in Git, en tools zoals ArgoCD of Flux zorgen ervoor dat je cluster automatisch synchroon blijft.

## Voordelen voor bedrijven: kostenbesparing en schaalbaarheid

Laat me een concreet voorbeeld geven uit mijn eigen ervaring.

Tijdens een sportevenement hadden we normaal gesproken een paar honderd gebruikers online. Een voetbalwedstrijd duurt ongeveer 90 minuten, en we wisten uit ervaring dat direct na de wedstrijd alle gebruikers naar de app zouden komen om de uitslagen te bekijken. Deze piek duurde zo'n 20-30 minuten.

**Onze strategie:**
- Tijdens de wedstrijd: gemiddelde bezetting met auto-scaling aan (voor kleine fluctuaties)
- Bij minuut 80: proactief opschalen naar verwachte piekbelasting
- Na 30 minuten: geleidelijk afschalen naar normaal niveau

**Het resultaat?** In plaats van 120 minuten op tientallen servers te draaien, draaiden we effectief maar 30 minuten op volle capaciteit. Dat scheelde tienduizend

---
## Related articles

{% assign related_posts = site.posts | where_exp: "post", "post != page and post.tags | array_intersect: page.tags | size > 0" %}
{% if related_posts.size > 0 %}
<ul>
  {% for post in related_posts limit:5 %}
    <li><a href="{{ post.url }}">{{ post.title }}</a> <span style="color:#888;font-size:0.9em;">({{ post.date | date: '%Y-%m-%d' }})</span></li>
  {% endfor %}
</ul>
{% else %}
<p>Geen gerelateerde artikelen gevonden.</p>
{% endif %}

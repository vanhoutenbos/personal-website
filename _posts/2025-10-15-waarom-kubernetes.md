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

**Het resultaat?** In plaats van 120 minuten op tientallen servers te draaien, draaiden we effectief maar 30 minuten op volle capaciteit. Dat scheelde tienduizenden euro's per jaar aan infrastructuurkosten.

Dit soort **elastische schaalbaarheid** is waar Kubernetes echt in uitblinkt. Volgens onderzoek kunnen organisaties tot 40-50% besparen op infrastructuurkosten door efficiënt gebruik van resources ([plural.sh](https://www.plural.sh/blog/is-kubernetes-worth-it/)).

### Andere business voordelen

- **Hogere beschikbaarheid**: Self-healing en automatische failover reduceren downtime
- **Snellere time-to-market**: Gestandaardiseerde deployment pipelines versnellen releases
- **Multi-cloud flexibiliteit**: Geen vendor lock-in betekent betere onderhandelingspositie
- **Compliance en souvereiniteit**: Meer controle over waar en hoe data wordt verwerkt

## Microsoft en Open Source opties voor Kubernetes

Als je in het Microsoft-ecosysteem werkt, heb je verschillende opties:

### Azure Kubernetes Service (AKS)

**AKS** is de managed Kubernetes-service van Microsoft. De grootste voordelen:
- Gratis control plane (je betaalt alleen voor worker nodes)
- Naadloze integratie met Azure-services (Azure AD, Key Vault, Monitor, etc.)
- Automatische updates en patching
- Enterprise-grade beveiliging en compliance

AKS is ideaal als je een **pragmatische, managed oplossing** wilt zonder veel operationele overhead. Microsoft neemt het zware beheerwerk uit handen ([Cloud4C](https://www.cloud4c.com/blogs/in-depth-guide-to-azure-kubernetes-service)).

### Red Hat OpenShift

**OpenShift** bouwt voort op Kubernetes met extra enterprise-features:
- Geïntegreerde CI/CD pipelines
- Developer-vriendelijke web console
- Strengere security defaults
- Commerciële support van Red Hat

OpenShift biedt meer "out-of-the-box" functionaliteit, maar is daardoor ook opinionated en kan restrictiever zijn ([Northflank](https://northflank.com/blog/openshift-vs-kubernetes)). Het is een goede keuze voor organisaties die **maximaal gebruiksgemak** willen met enterprise support.

### Self-managed Kubernetes on-premise

Voor organisaties met strikte **data-souvereiniteit** eisen of specifieke compliance-vereisten kan een self-managed Kubernetes cluster on-premise de voorkeur hebben. Dit geeft maximale controle, maar vereist ook substantieel meer operations-expertise.

## Valkuilen en veelgemaakte fouten

Uit eigen ervaring en observaties, hier zijn de meest voorkomende fouten:

### 1. Stateful applicaties zonder state management

Een klassieker: je bouwt een stateful applicatie (bijvoorbeeld met sessie-informatie in-memory) en vergeet dat Kubernetes je applicatie over meerdere pods distribueert. Het resultaat? Gebruikers loggen in, refreshen de pagina, en zijn soms ingelogd en soms niet – afhankelijk van welke pod hun request behandelt.

**Oplossing**: Maak applicaties stateless, of gebruik gedeelde state (Redis, databases) wanneer state noodzakelijk is.

### 2. Onderschatten van de leercurve

Kubernetes heeft veel concepten: pods, deployments, services, ingress, persistent volumes, config maps, secrets... Voor teams zonder container-ervaring kan dit overweldigend zijn.

**Oplossing**: Begin klein, focus op één concept tegelijk, en gebruik managed services zoals AKS om complexiteit te reduceren ([AltexSoft](https://www.altexsoft.com/blog/kubernetes-pros-cons/)).

### 3. Geen resource limits instellen

Zonder resource limits kan één misbehaving applicatie het hele cluster plat leggen.

**Oplossing**: Stel altijd CPU en memory requests/limits in voor je containers.

### 4. Security als afterthought

Kubernetes heeft veel security-features (RBAC, network policies, pod security standards), maar die moet je wel activeren en configureren.

**Oplossing**: Volg het principle of least privilege, scan images op vulnerabilities, en gebruik tools zoals Azure Policy of OpenShift's security defaults.

## De keerzijde: wanneer Kubernetes te complex is

Laten we eerlijk zijn over de uitdagingen ([Medium](https://medium.com/@goyalarchana17/kubernetes-what-why-how-architecture-with-pros-cons-d0ffd1396df5)):

- **Steile leercurve**: Het duurt maanden om Kubernetes goed te begrijpen
- **Operationele complexiteit**: Self-managed clusters vereisen dedicated DevOps/SRE teams
- **Kosten**: Niet alleen infrastructuur, maar ook talent – Kubernetes-experts zijn duur
- **Overkill voor simpele apps**: Een static website hoeft echt niet op Kubernetes

De **Total Cost of Ownership (TCO)** van Kubernetes gaat verder dan alleen serverkosten. Je moet rekening houden met:
- Opleidingskosten voor je team
- Tijd besteed aan platform-onderhoud
- Licenties (bij commerciële distributies zoals OpenShift)
- Monitoring en observability tooling

Voor veel organisaties is dit de moeite waard vanwege schaalbaarheid en flexibiliteit. Voor anderen niet.

## Is Kubernetes iets voor jou?

Stel jezelf deze vragen:

1. **Heb je schaalbaarheid nodig** die verder gaat dan een enkele VM?
2. Is **kostenbeheer** belangrijk (betalen voor wat je gebruikt)?
3. Wil je **vendor-souvereiniteit** behouden (niet vast zitten aan één cloud)?
4. Heb je **multi-cloud of hybrid-cloud** strategieën?
5. Is je team **bereid om te investeren** in training en expertise-opbouw?

Als je 3+ van deze vragen met "ja" beantwoordt, is Kubernetes waarschijnlijk een goede fit.

## Conclusie: Kubernetes is een middel, geen doel

Kubernetes is geen silver bullet. Het is een krachtig platform dat schaalbaarheid, flexibiliteit en kostenbeheer mogelijk maakt – maar alleen als je het juist inzet.

Mijn advies voor beginners: **begin klein**. Experimenteer met een managed service zoals AKS om de operationele last te minimaliseren. Focus op één concept tegelijk. Bouw ervaring op met simpele applicaties voordat je volledige productie-workloads migreert.

Of je nu kiest voor **Azure Kubernetes Service** voor pragmatisch gemak, **OpenShift** voor enterprise-features, of een **self-managed cluster** voor maximale controle – de keuze hangt af van je organisatie's behoeften, capaciteiten en ambities.

**Benieuwd of Kubernetes iets voor jouw organisatie is?** Ik help graag met architectuur-advies, migratie-strategieën of training voor je team. Neem contact op, en we bespreken wat de beste aanpak is voor jouw situatie.

Later zal ik ook diepere dives publiceren over specifieke Kubernetes-onderwerpen – van netwerken tot security, van CI/CD tot monitoring. Stay tuned!

---

## Veelgestelde vragen (FAQ)

### Is Kubernetes moeilijk?

Het is conceptueel een flink stapje, maar niet onmogelijk. Er is veel informatie en veel mogelijkheden, maar als je je focust op **één onderwerp per keer** valt de leercurve best mee. Begin met de basics (pods, deployments, services) en bouw van daaruit verder.

### Wat zijn alternatieven voor Kubernetes?

Binnen het Microsoft-ecosysteem zijn **Azure Container Instances (ACI)** en **Azure Container Apps (ACA)** vereenvoudigde alternatieven die onderwater gebruikmaken van Kubernetes-concepten. Voor volledige container orchestration zijn de echte alternatieven **Docker Swarm**, **HashiCorp Nomad** en **Apache Mesos** – hoewel Kubernetes verreweg de meest volwassen en ondersteunde optie is.

### Hoe begin ik met Kubernetes?

Start op [kubernetes.io](https://kubernetes.io) voor officiële documentatie. Voor hands-on learning:
- Probeer **Minikube** of **kind** voor lokale clusters
- Gebruik de gratis tier van **Azure Kubernetes Service** voor cloud-experimenten
- Volg tutorials op YouTube, Udemy of Microsoft Learn
- Lees blogs en doe-het-zelf guides (zoals deze serie!)

Het mooie van Kubernetes: je kunt met elke programmeertaal aan de slag – Python, C#, PHP, Java, het maakt niet uit. Focus op de concepten, niet op de taal.

### Wat kost Kubernetes?

Dit verschilt enorm per setup:
- **AKS**: Gratis control plane, betaal alleen worker nodes (vanaf ~€70/maand voor een kleine cluster)
- **OpenShift**: Commerciële licenties bovenop infrastructuur
- **Self-managed**: Infrastructuurkosten + aanzienlijke operationele overhead

Vergeet niet de **indirecte kosten**: training, tooling, monitoring, en personeel met Kubernetes-expertise.

### Is AKS of OpenShift beter?

Dat hangt af van je prioriteiten:
- Kies **AKS** als je wilt integreren met Azure-services, lagere kosten prefereert, en meer flexibiliteit wilt
- Kies **OpenShift** als je enterprise-features out-of-the-box wilt, commerciële support belangrijk vindt, en een opinionated platform accepteert

Beide zijn uitstekende keuzes voor productie-workloads.

---

**Bronnen en verder lezen:**
- [Kubernetes: What, Why, How & Architecture (Pros & Cons)](https://medium.com/@goyalarchana17/kubernetes-what-why-how-architecture-with-pros-cons-d0ffd1396df5)
- [Is Kubernetes Worth It? A 2024 Guide to Cost & Benefits](https://www.plural.sh/blog/is-kubernetes-worth-it/)
- [Comparative Analysis of OpenShift, AKS, GKE](https://medium.com/@kshism/a-comparative-analysis-of-openshift-azure-kubernetes-service-aks-and-google-kubernetes-engine-655b961df1e5)
- [OpenShift vs Kubernetes: What should you use?](https://northflank.com/blog/openshift-vs-kubernetes)
- [The Good and the Bad of Kubernetes Container Orchestration](https://www.altexsoft.com/blog/kubernetes-pros-cons/)
- [Azure Kubernetes Service: In-Depth Guide](https://www.cloud4c.com/blogs/in-depth-guide-to-azure-kubernetes-service)

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

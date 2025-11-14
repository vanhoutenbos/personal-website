---
layout: single
title: "Van Docker tot Kubernetes: wanneer heb je orchestratie nodig?"
permalink: /blog/:year/:month/:day/:title.html
date: 2025-10-15 06:00:00 +0200
description: "Ontdek het verschil tussen containers en orchestratie. Wanneer volstaat Docker, en wanneer heb je Kubernetes nodig? Een praktische gids met real-world voorbeelden."
image: /assets/img/post-default.svg
image_alt: "Van containers naar Kubernetes orchestratie"
categories: [blog, kubernetes]
toc: true
lang: nl
excerpt: "Van containers basics tot Kubernetes: wanneer heb je orchestratie nodig en wanneer niet? Praktische gids met beslispunten."
tags: [kubernetes, docker, containers, orchestratie, schaalbaarheid, cloud native]
series: "Kubernetes Top-Down"
series_order: 1
series_path: "fundamentals"
---

# Van Docker tot Kubernetes: wanneer heb je orchestratie nodig?

Je hebt waarschijnlijk gehoord over containers en Kubernetes. Maar wat is het verschil? En belangrijker: heb je überhaupt Kubernetes nodig, of volstaat iets simpelers?

Na jaren ervaring met containers – van simpele Docker setups tot complexe Kubernetes productie-omgevingen – deel ik een eerlijk verhaal over wanneer je wat nodig hebt. Geen hype, gewoon praktische inzichten.

> 💡 **Tip:** Wil je direct naar platform-keuzes? Lees mijn {% include smart-link.html slug="kubernetes-keuzehulp" text="Kubernetes Keuzehulp" fallback="Kubernetes Keuzehulp" %} voor een complete vergelijking.

## Containers 101: de basis

Voordat we over Kubernetes praten, moeten we begrijpen wat **containers** zijn en waarom ze zo populair zijn.

### Wat zijn containers?

Een container is een gestandaardiseerde eenheid van software die:
- **Code** bevat (je applicatie)
- **Dependencies** bundelt (libraries, runtime)
- **Configuratie** meeneemt (environment settings)
- **Consistent** draait op elke machine (laptop, server, cloud)

**De metafoor:** Denk aan een container zoals een scheepvaartcontainer. Of je nu auto's, meubels of elektronica vervoert, de container zelf is gestandaardiseerd. Zo werken software containers ook – of je nu Python, Java of .NET draait, de container-interface blijft hetzelfde.

### Docker: de populairste container runtime

**Docker** is de meest bekende tool voor het bouwen en draaien van containers. Met Docker kun je:
- Een applicatie en al zijn dependencies verpakken in een image
- Die image overal draaien waar Docker geïnstalleerd is
- Snel starten en stoppen (seconden in plaats van minuten zoals bij VM's)

**Voorbeeld:** Een Node.js webserver in Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

Bouwen en draaien:
```bash
docker build -t my-web-app .
docker run -p 3000:3000 my-web-app
```

Dat is het! Je hebt nu een draaiende applicatie, zonder dat je Node.js op je systeem hoeft te installeren.

### Waarom zijn containers zo populair?

1. **"Works on my machine" is verleden tijd** - Als het in een container draait op je laptop, draait het ook in productie
2. **Snelle deployments** - Containers starten in seconden, VM's in minuten
3. **Efficiënt resource gebruik** - Tientallen containers op één server, zonder VM overhead
4. **Isolatie** - Elke container is geïsoleerd, crashes beïnvloeden andere containers niet
5. **Versioning** - Container images zijn versionable en reproduceerbaar

## Het beslispunt: wanneer heb je orchestratie nodig?

Oké, containers zijn geweldig. Maar wanneer volstaat **gewoon Docker**, en wanneer heb je **orchestratie** nodig?

### Scenario 1: Je hebt GEEN orchestratie nodig

**Situatie:**
- Je draait 1-5 containers
- Schaal verandert niet (of zelden)
- Downtime van een paar minuten is acceptabel
- Een enkel team beheert alles
- Eenvoudige architectuur

**Voorbeelden:**
- Een simpele website met database
- Een interne tool voor een klein team
- Een proof-of-concept of prototype
- Een side-project of portfolio site

**Wat je WEL kunt gebruiken:**
- **Docker Compose** voor lokale development
- **Azure Container Instances (ACI)** - run één container in de cloud
- **Azure Container Apps (ACA)** - serverless containers met auto-scaling
- **Azure App Service** - managed platform-as-a-service

💡 **Mijn advies:** Als je dit scenario herkent, lees dan verder bij {% include smart-link.html slug="getting-started-aca-aci" text="Containers zonder Kubernetes: ACA & ACI" fallback="ACA of ACI (blog volgt binnenkort)" %}

### Scenario 2: Je hebt orchestratie nodig

**Situatie:**
- Je draait 10+ containers (microservices)
- Schaalbaarheid is essentieel (van 10 naar 10.000 gebruikers)
- Zero-downtime deployments zijn vereist
- Meerdere teams deployen onafhankelijk
- Complexe networking tussen services
- Multi-cloud of hybrid-cloud strategie

**Voorbeelden:**
- E-commerce platform met piekbelasting
- SaaS applicatie met groeiende gebruikersbase
- Real-time applicaties (chat, gaming)
- Data processing pipelines
- Enterprise applicaties met compliance eisen

**Wat je nodig hebt:**
- **Kubernetes** - de industrie standaard voor container orchestratie
- Managed opties: **AKS** (Azure), **EKS** (AWS), **GKE** (Google)
- Enterprise: **OpenShift** (Red Hat)

## Wat is Kubernetes eigenlijk?

Nu je snapt wanneer je orchestratie nodig hebt, wat is Kubernetes dan precies?

Kubernetes is een **container orchestration platform** dat oorspronkelijk binnen Google is ontstaan om hun schaalbaarheid-uitdagingen op te lossen. Het is uitgegroeid tot het de-facto platform voor het beheren van gecontaineriseerde applicaties – en dat niet zonder reden.

**De kernfunctie:** Kubernetes is een "autopilot" voor containers. Jij vertelt Kubernetes wat je wilt (declaratief via YAML), en Kubernetes zorgt dat het gebeurt en blijft gebeuren:
- "Ik wil 5 kopieën van mijn webserver"
- "Verdeel verkeer over deze kopieën"
- "Als een kopie crasht, start een nieuwe"
- "Schaal automatisch op bij hoge load"

Wat maakt Kubernetes zo bijzonder? 
- **Platform-agnostisch**: Draai op Azure, AWS, Google Cloud, of je eigen datacenter
- **Taal-onafhankelijk**: PHP, C#, Python, Java, Go – maakt niet uit
- **Vendor-soevereiniteit**: Je bent niet vast aan één cloudprovider
- **Enorm ecosystem**: Duizenden tools en extensions (Helm, Istio, ArgoCD, etc.)

### Waarom Kubernetes en niet Docker Swarm, Nomad, of Mesos?

Goede vraag! Er zijn alternatieven:
- **Docker Swarm**: Simpeler, maar minder features. Geen actieve development meer.
- **Nomad** (HashiCorp): Goede optie, maar kleiner ecosystem
- **Mesos**: Enterprise-grade, maar complexer en minder developer-friendly

**Kubernetes won** omdat:
1. **Google backing + CNCF governance** - betrouwbare toekomst
2. **Grootste community** - meer tools, meer expertise, meer support
3. **Cloud-provider support** - AKS, EKS, GKE zijn volledig managed
4. **Enterprise adoption** - Red Hat OpenShift, VMware Tanzu, Rancher
5. **De facto standard** - meeste DevOps engineers kennen het

## Conclusie: wat past bij jou?

Je hebt nu een goed beeld van containers, orchestratie, en wanneer Kubernetes zinvol is. Hier is mijn advies:

### Start met containers, niet met Kubernetes

Begin met **Docker** en **Docker Compose** lokaal. Leer containers bouwen, debuggen en deployen. Als je 1-5 containers hebt, gebruik dan **Azure Container Apps** of **Container Instances**.

### Overweeg Kubernetes als je groeit

Wanneer je 10+ microservices hebt, complexe networking nodig hebt, of multi-cloud wilt, is het tijd voor Kubernetes. Start met **managed oplossingen** zoals AKS – laat de cloud provider het moeilijke werk doen.

### Kies het juiste pad

Zodra je weet wat je nodig hebt, kun je kiezen:
- **Lightweight containers**: {% include smart-link.html slug="getting-started-aca-aci" text="Containers zonder Kubernetes: ACA & ACI" fallback="Azure Container Apps (ACA) of Container Instances (ACI) - *blog volgt binnenkort*" %}
- **Managed Kubernetes**: {% include smart-link.html slug="getting-started-aks" text="Getting Started met AKS" fallback="Getting Started met AKS - *blog volgt binnenkort*" %}
- **Self-hosted Kubernetes**: {% include smart-link.html slug="getting-started-openshift-onprem" text="OpenShift on-premises" fallback="OpenShift on-premises - *blog volgt binnenkort*" %}

### Volgende stappen

Lees verder:
1. {% include smart-link.html slug="wat-kun-je-met-kubernetes" text="Wat kun je met Kubernetes?" fallback="Wat kun je met Kubernetes?" %} - Diepere duik in mogelijkheden
2. {% include smart-link.html slug="kubernetes-keuzehulp" text="Kubernetes Keuzehulp" fallback="Kubernetes Keuzehulp" %} - Platform vergelijking en beslisboom
3. [Kubernetes overzichtspagina](/kubernetes/) - Complete learning path

Kubernetes is krachtig, maar niet altijd nodig. Kies bewust, start klein, en schaal wanneer het echt toegevoegde waarde heeft.

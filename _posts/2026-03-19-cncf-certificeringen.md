---
title: "CKA, CKAD en CKS: de CNCF-certificeringen uitgelegd"
date: 2026-03-19 06:00:00 +0200
categories: [Kubernetes, Certificering]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Overweeg je een Kubernetes-certificering? In dit artikel lees je wat de CKA, CKAD en CKS inhouden, hoe je je voorbereidt, wat het examen doet en of het je carriere echt verder helpt."
image: /assets/img/post-default.svg
image_alt: "CNCF Kubernetes certificeringen CKA CKAD CKS"
tags: [Kubernetes, CKA, CKAD, CKS, CNCF, Certificering, Carriere, DevOps]
series: "Kubernetes Top-Down"
series_order: 7
series_path: "cncf-certificeringen"
lang: nl
---

# CKA, CKAD en CKS: de CNCF-certificeringen uitgelegd

LinkedIn staat er vol mee: mensen die trots hun nieuwe badge delen na het halen van een CKA, CKAD of CKS. Maar wat houdt zo'n certificering nou precies in? Is het de moeite waard? En hoe pak je de voorbereiding aan als je naast je werk studeert?

Dit artikel geeft je een eerlijk beeld. Geen verkooppraatje, maar praktische informatie op basis van eigen ervaring en gesprekken met engineers die de examens hebben afgelegd.

## De drie hoofdcertificeringen

De Cloud Native Computing Foundation (CNCF) beheert de officiële Kubernetes-certificeringen. Er zijn drie kernexamens, elk gericht op een andere rol.

### CKA — Certified Kubernetes Administrator

**Voor wie:** Engineers die Kubernetes-clusters beheren, opzetten en onderhouden.

**Wat wordt getoetst:**
- Cluster-architectuur en installatie
- Workloads en scheduling
- Services en netwerken
- Storage
- Beveiliging (RBAC, certificates)
- Probleemoplossing (dit is een groot deel van het examen)

De CKA is het meest generalistisch van de drie. Als je maar een certificering doet, is dit de meest veelzijdige keuze voor engineers die in platform- of SRE-rollen werken.

### CKAD — Certified Kubernetes Application Developer

**Voor wie:** Developers die applicaties bouwen en deployen op Kubernetes.

**Wat wordt getoetst:**
- Pod-configuratie en multi-container patterns
- Configuratie (ConfigMaps, Secrets, environment variables)
- Deployments, rollouts en rollbacks
- Services en netwerken vanuit developer-perspectief
- Observability (logs, probes)
- Jobs en CronJobs

De CKAD is toegankelijker dan de CKA als je meer developer dan operator bent. De focus ligt op het draaien van applicaties, niet op clusterinfrastructuur.

### CKS — Certified Kubernetes Security Specialist

**Voor wie:** Engineers met security-focus. Vereist een geldig CKA-certificaat als voorwaarde.

**Wat wordt getoetst:**
- Cluster-hardening (RBAC, service accounts, network policies)
- Systeemhardening (AppArmor, Seccomp, kernel parameters)
- Supply chain security (image scanning, Dockerfile best practices, SBOM)
- Runtime security (Falco, auditlogs)
- Microservices security (mutual TLS, OPA/Gatekeeper)

De CKS is de zwaarste van de drie. Je hebt CKA-niveau kennis nodig als basis, plus een specifieke focus op beveiligingsonderwerpen die in de andere examens nauwelijks aan bod komen.

## Hoe ziet het examen eruit?

Alle drie de examens zijn **praktisch** — geen multiple choice. Je werkt in een echte Kubernetes-omgeving via de browser en lost opdrachten op met `kubectl`, configuratiebestanden en command-line tools.

Typische kenmerken:

- **Duur:** 2 uur (CKA en CKAD), 2 uur (CKS)
- **Geslaagd bij:** 66% (CKA en CKAD), 67% (CKS)
- **Toezicht:** online proctoring via webcam
- **Open boek:** je mag de officiele Kubernetes-documentatie raadplegen op kubernetes.io
- **Geldigheid:** 3 jaar, daarna opnieuw examen

Dat open-boek aspect is cruciaal om goed te begrijpen. Je mag de documentatie gebruiken, maar het examen is zo ontworpen dat je geen tijd hebt om alles op te zoeken. Je moet snel en zeker zijn in je basis; de documentatie gebruik je voor details die je niet uit je hoofd weet.

## Voorbereiding: een eerlijk beeld

Hoeveel tijd heb je nodig? Dat hangt sterk af van je startpositie.

**Als je dagelijks met Kubernetes werkt:** Reken op 4-8 weken intensieve voorbereiding, 1-2 uur per dag.

**Als je Kubernetes kent maar niet dagelijks gebruikt:** 8-12 weken, 1-2 uur per dag.

**Als je nieuw bent met Kubernetes:** Begin niet met het examen. Bouw eerst praktische ervaring op. De examens toetsen toegepaste kennis, geen theoretische begrippen.

### Aanbevolen studiematerialen

**Killer.sh** is de officiële oefenomgeving van CNCF. Je krijgt twee sessies van 36 uur toegang als je een examen koopt. De vragen zijn bewust moeilijker dan het echte examen. Als je Killer.sh haalt, haal je het echte examen.

**Udemy — Mumshad Mannambeth** heeft veruit de best beoordeelde CKA- en CKAD-cursussen op Udemy. Praktisch ingesteld, met een ingebouwde oefenomgeving.

**KodeKloud** biedt een eigen platform met hands-on labs. Goed complement naast video-cursussen.

**De officiele documentatie** (kubernetes.io) is het enige wat je tijdens het examen mag raadplegen. Leer de structuur kennen zodat je snel kunt navigeren.

### Tips uit de praktijk

**Maak snelkoppelingen aan voor het examen.** Je mag een `.bashrc` aanpassen tijdens het examen. Voeg aliassen toe die je tijd besparen:

```bash
alias k=kubectl
alias kn='kubectl -n'
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'

# Gebruik: k run nginx --image=nginx $do > pod.yaml
```

**Oefen met imperatieve commando's.** Configuratiebestanden schrijven kost tijd. Veel objecten maak je sneller aan via `kubectl run`, `kubectl create` of `kubectl expose`, en exporteer je daarna naar YAML als aanpassingen nodig zijn:

```bash
# Pod aanmaken en exporteren
kubectl run nginx --image=nginx --dry-run=client -o yaml > nginx.yaml

# Deployment aanmaken
kubectl create deployment nginx --image=nginx --replicas=3

# Service aanmaken voor een bestaand deployment
kubectl expose deployment nginx --port=80 --type=ClusterIP
```

**Leer de context wisselen.** Het examen werkt met meerdere clusters. Elke opdracht begint met een context-switch:

```bash
kubectl config use-context cluster1
```

Mis je dit, dan werk je in het verkeerde cluster en zijn je antwoorden fout. Controleer altijd de context.

**Beheer je tijd.** Je hebt gemiddeld 3-4 minuten per vraag. Sla moeilijke vragen over en kom er op terug. Een vraag waarop je vastzit kost je punten op de vragen daarna die je wel weet.

## Wat kost het?

De examenkosten per medio 2026 (exclusief BTW):

| Certificering | Prijs | Inclusief |
|---------------|-------|-----------|
| CKA | $395 | Een herkansing + Killer.sh |
| CKAD | $395 | Een herkansing + Killer.sh |
| CKS | $395 | Een herkansing + Killer.sh |

CNCF houdt regelmatig kortingsacties, met name rond KubeCon (twee keer per jaar) en Black Friday. Kortingen van 30-40% zijn niet ongewoon. Stel een alert in via de CNCF-nieuwsbrief of volg de aankondigingen op LinkedIn.

De herkansing is inbegrepen als je de eerste keer niet slaagt. Maak er goed gebruik van door de Killer.sh-sessies volledig te doorlopen voordat je het echte examen inplant.

## Is het de moeite waard?

Een eerlijk antwoord: het hangt ervan af wat je wilt bereiken.

**Ja, het is de moeite waard als:**
- Je structuur wilt in je Kubernetes-kennis. Het examentraject dwingt je gaten te dichten die je normaal zou omzeilen.
- Je van rol wilt wisselen of een nieuwe functie wilt die Kubernetes-kennis vereist. Een CKA op je cv is concreet bewijs.
- Je in een omgeving werkt waar certificeringen tellen voor aanbestedingen of klantvertrouwen.

**Het voegt minder toe als:**
- Je al jarenlang dagelijks met productie-Kubernetes werkt en de stof volledig beheerst. De certificering bevestigt wat je al weet, maar voegt weinig kennis toe.
- Je het alleen doet voor de badge zonder het materiaal te doorgronden. Examentraining zonder echte context vergaat snel.

Mijn persoonlijke conclusie: de voorbereiding is minstens zo waardevol als het certificaat zelf. Het dwingt je systematisch alle onderwerpen langs te gaan, inclusief de hoeken die je normaal niet aanraakt.

## De andere CNCF-certificeringen

Naast CKA, CKAD en CKS zijn er nog twee certificeringen die de moeite waard zijn om te kennen:

**KCNA — Kubernetes and Cloud Native Associate**
Een introductiecertificering met multiple choice vragen. Gericht op mensen die beginnen met Kubernetes en cloud native concepten. Geen praktische opdrachten. Geschikt als startpunt of als voorbereiding op de CKA.

**KCSA — Kubernetes and Cloud Native Security Associate**
Vergelijkbaar met de KCNA maar gericht op security. Multiple choice, geen praktische opdrachten.

Deze twee zijn toegankelijker maar ook minder zwaarwegend in de markt. Ze zijn wel nuttig als je als organisatie wilt aantonen dat bredere teams een basisniveau van Kubernetes-kennis hebben.

## Conclusie

De CKA, CKAD en CKS zijn praktijkgerichte examens die echt iets meten. Ze zijn niet makkelijk te halen zonder kennis, en de voorbereiding levert concrete vaardigheden op.

Als je twijfelt waar te beginnen: kies de CKA als je in platform- of ops-rollen werkt, de CKAD als je developer bent die applicaties op Kubernetes deployt. De CKS is de logische vervolgstap als security jouw focus is.

**Plan het examen voordat je klaar bent.** De deadline dwingt je te studeren. Koop het examen, zet een datum, en gebruik de Killer.sh-sessies als eindtoets.

### Meer lezen

- [Officiele CNCF-certificeringspagina](https://www.cncf.io/certification/)
- [Killer.sh oefenomgeving](https://killer.sh)
- [KodeKloud Kubernetes-labs](https://kodekloud.com)
- [Kubernetes-documentatie (ook toegestaan tijdens examen)](https://kubernetes.io/docs/)

---

*Jean-Paul van Houten-Bos is DevOps Engineer bij CZ en begeleidt ontwikkelteams bij hun cloud-native transitie. Vragen over de examens? Stuur een bericht via LinkedIn.*

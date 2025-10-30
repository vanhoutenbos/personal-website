---
title: "Kubernetes Fundamentals - Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?"
date: 2025-10-29
excerpt: "Vergelijking van AKS, ACA, ACI en OpenShift: welke Kubernetes-oplossing past bij jouw team? Praktische tips, use cases en een heldere keuzehulp."
categories: [Kubernetes, Keuzehulp]
tags: [AKS, ACA, ACI, OpenShift, Azure, Kubernetes, vergelijking, keuzehulp]
description: "Complete keuzehulp voor Kubernetes platformen: AKS, ACA, ACI, OpenShift en on-prem. Praktische vergelijking, tips en FAQ voor developers en teams."
lang: nl
canonical_url: "https://jeanpaulvanhouten.nl/blog/kubernetes-keuzehulp"
tags: [kubernetes, AKS, OpenShift, containers, cloud native, soevereiniteit]
---

# Kubernetes Fundamentals - Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?

## Introductie
Kubernetes is dé standaard voor container orchestration, maar Azure biedt meerdere smaken: AKS, ACA, ACI en OpenShift. In deze blog help ik je kiezen aan de hand van praktijkervaring, een vergelijkingstabel en concrete tips. 

## Mijn Perspectief
Met ruim 4 jaar ervaring in AKS, 2 jaar OpenShift, 2 jaar Docker Swarm en wat ACA/ACI, heb ik diverse scenario's meegemaakt. Mijn voorkeur? AKS voor .NET/DevOps, OpenShift voor enterprise governance, ACA voor snelle microservices, ACI voor CI/CD jobs.

## Praktijkvoorbeelden & Vergelijking
Hieronder een overzicht van de belangrijkste platformen:

| Platform | Best For | Controle | Kosten | Complexiteit | Schaalbaarheid | Integraties | Notities |
|---|---|---|---|---|---|---|---|
| **AKS** | Productie, Azure integratie | Hoog | Medium | Hoog | Uitstekend | Azure, GitHub, DevOps | Volledig Kubernetes, managed door Azure |
| **ACA** | Microservices, APIs | Medium | Laag-Medium | Laag | Uitstekend | Dapr, Functions | Serverless, abstractie boven Kubernetes |
| **ACI** | Korte taken, CI/CD | Laag | Per seconde | Zeer laag | Geen | Basic Azure | Containers as a Service, niet voor 24/7 apps |
| **OpenShift** | Enterprise, governance | Zeer hoog | Hoog | Zeer hoog | Uitstekend | DevSecOps | Extra lagen, on-prem mogelijk |
| **On-prem OpenShift** | Compliance, latency | Maximaal | Zeer hoog | Extreem | Hardware afhankelijk | Geen native | Volledige controle, veel verantwoordelijkheid |

### TL;DR

**AKS:** Maximale controle, geschikt voor complexe workloads, maar vereist Kubernetes-kennis.
**ACA:** Snel starten, geen clusterbeheer, ideaal voor microservices.
**ACI:** Simpele, korte taken, CI/CD jobs, niet voor 24/7 apps.
**OpenShift:** Enterprise, governance, compliance, on-prem mogelijk.

## Beslismatrix: Wanneer kies je welk platform?

**Kies AKS als:**

**Kies ACA als:**

- Je Windows containers wilt draaien (alleen als legacy of migratie vereist is, anders: kies Linux containers!)

> ⚠️ **Let op:** Hoewel AKS Windows containers ondersteunt en production ready is, raad ik persoonlijk Windows containers af voor nieuwe projecten. De community is veel kleiner dan bij Linux containers, er zijn meer bekende issues en minder support. Kies alleen Windows containers als je legacy .NET apps hebt die niet naar Linux kunnen. Voor moderne workloads is Linux de standaard en veel stabieler.
- Je wilt profiteren van autoscaling en serverless pricing.
- Je team weinig Kubernetes-kennis heeft, maar wel moderne cloud native apps bouwt.

**Kies ACI als:**
- Je korte, eenvoudige taken of CI/CD jobs wilt draaien.
- Je containers slechts tijdelijk nodig hebt (event-driven, batch, prototyping).
- Je per seconde wilt betalen en geen orchestration nodig hebt.
- Je geen 24/7 applicaties draait.

**Kies OpenShift als:**
- Je enterprise governance, security en compliance centraal staan.
- Je multi-tenancy, policy en DevSecOps wilt.
- Je on-premises wilt draaien of soevereiniteit belangrijk is.
- Je team ervaring heeft met Red Hat tools en pipelines.

**Kies On-prem OpenShift als:**
- Je volledige controle wilt over hardware, netwerk en security.
- Je niet in de cloud mag werken (compliance, latency, data residency).
- Je eigen datacenter of leverancier wilt kiezen.

## Scenario's en keuzevragen

**Scenario 1:** Je bouwt een API-platform voor meerdere teams, wilt snel kunnen schalen en geen clusterbeheer doen.
- Kies ACA.

**Scenario 2:** Je hebt een enterprise-applicatie met strenge security-eisen, multi-tenancy en CI/CD pipelines.
- Kies OpenShift (cloud of on-prem).

**Scenario 3:** Je wilt een data pipeline draaien die elke nacht containers start voor ETL-taken.
- Kies ACI.

**Scenario 4:** Je wilt een productieplatform voor microservices, met volledige controle en integratie met Azure.
- Kies AKS.

**Scenario 5:** Je mag niet in de cloud werken en hebt eigen hardware.
- Kies On-prem OpenShift.

## Praktische tips voor beginners en gevorderden

- Begin klein: test workloads eerst in ACA of ACI voordat je naar AKS of OpenShift gaat.
- Documenteer je setup en exit-strategie vanaf dag 1.
- Gebruik interne links en monitoring (Azure Monitor, Prometheus, Grafana).
- Let op kosten: ACI kan duur zijn voor long-running processen, AKS/ACA zijn voordeliger voor 24/7 apps.
- Overweeg een hybride aanpak: combineer ACA voor microservices en AKS voor complexe workloads.

## Migratie-advies & exit-strategie

- Zorg dat je deployment scripts (Helm, YAML, pipelines) cloud-agnostisch zijn waar mogelijk.
- Test migratie regelmatig: kun je je workloads eenvoudig verplaatsen tussen AKS, ACA, OpenShift?
- Gebruik container best practices: minimaliseer afhankelijkheden, documenteer configuratie.
- Maak gebruik van managed services voor logging, monitoring en security.

## Fouten & Learning
- Te snel gekozen voor AKS zonder exit-strategie: migratie bleek lastiger dan gedacht.
- ACI geprobeerd voor long-running processen, bleek veel duurder te zijn dan verwacht.
- OpenShift on-prem: veel meer beheer dan verwacht, maar wel maximale controle.
**Tip:** Test je exit-strategie en check of je workloads passen bij het platform.

## Afsluiting
Mijn persoonlijke voorkeur is AKS vanwege Azure-integratie en community support. Maar: kies wat bij jouw team en use case past! 

**Heb je vragen of wil je advies? Laat een reactie achter of neem contact op!**

## FAQ
- **Wat is het goedkoopst?**
  - Meestal ACI, omdat je per seconde betaalt en containers niet 24/7 draaien.
- **Wat is het makkelijkst?**
  - ACA voor developers, AKS voor DevOps, OpenShift voor enterprise.
- **Kan ik makkelijk migreren?**
  - Ja, maar test je exit-strategie en documenteer je setup.
- **Wat als ik geen Kubernetes-kennis heb?**
  - Start met ACA of ACI, of overweeg App Service.

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



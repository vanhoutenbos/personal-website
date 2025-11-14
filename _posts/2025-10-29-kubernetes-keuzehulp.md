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
series: "Kubernetes Top-Down"
series_order: 3
series_path: "fundamentals"
---

# Kubernetes Fundamentals - Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?

## Introductie
Kubernetes is dé standaard voor container orchestration, maar Azure biedt meerdere smaken: AKS, ACA, ACI en OpenShift. In deze blog help ik je kiezen aan de hand van praktijkervaring, een vergelijkingstabel en concrete tips. 

## Kubernetes Modellen & Taxonomie
Voordat we in keuzes duiken is het handig om de landschapslagen te begrijpen. Niet elke containeroplossing betekent dat jij direct een cluster beheert. Een pragmatische indeling:

| Model | Omschrijving | Voorbeelden | Voordelen | Nadelen | Wanneer kiezen |
|-------|--------------|-------------|-----------|---------|---------------|
| Zelf‑beheerde Kubernetes | Je installeert/upgrade zelf cluster op VM's/bare metal. | Upstream K8s on-prem, kubeadm, Rancher self-hosted | Maximale controle | Hoge beheerlast (upgrades, patching) | Strikte compliance/on-prem latency met eigen infra team |
| Managed Kubernetes | Control plane + basisbeheer door cloud/provider. | AKS, Azure Red Hat OpenShift (ARO) | Minder operationele overhead | Nog steeds node sizing/upgrades (AKS) | Productie workloads met behoefte aan volledige API |
| Enterprise Distributie | Opinionated platform met geïntegreerde DevSecOps & policy. | OpenShift (cloud & on-prem) | Governance, multitenancy, security | Complexiteit, licentiekosten | Enterprise organisaties met zware audits |
| Serverless Abstraction | Kubernetes onder water, geen nodes zichtbaar. | Azure Container Apps (ACA) | Autoscale, revisions, events | Geen directe toegang tot K8s API/CRDs | Snelle microservices zonder clusterkennis |
| Container Execution | Losse container groepen, minimale features. | Azure Container Instances (ACI) | Supersnel, per seconde betalen | Geen autoscale/service discovery | Korte taken, CI/CD agents, batch jobs |
| Hybride Burst | Kubernetes + serverless pods voor pieken. | AKS + Virtual Nodes (ACI) | Burst capacity zonder nieuwe nodes | Observability/netwerkcomplexiteit | Tijdelijke schaalspikes boven vaste footprint |
| On-prem Enterprise | Volledig op locatie met enterprise tooling. | OpenShift on-prem, VMware Tanzu | Data residency, latency | Hardware investeringen, lifecycle beheer | Wettelijke eisen / air‑gapped |

> Evolutiepad: Begin eenvoudig (ACA/ACI) → groei naar managed (AKS) → enterprise (OpenShift) alleen als governance echt nodig is.

## Mijn Perspectief
Met ruim 4 jaar ervaring in AKS, 2 jaar OpenShift, 2 jaar Docker Swarm en wat ACA/ACI, heb ik diverse scenario's meegemaakt. Mijn voorkeur? AKS voor .NET/DevOps, OpenShift voor enterprise governance, ACA voor snelle microservices, ACI voor korte schaalbare jobs.

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

**ACA (Serverless abstraction):** Snel starten, autoscale op events/HTTP, geen clusterbeheer.

**ACI (Execution):** Korte taken, CI/CD jobs, GPU/spot bursts, niet voor 24/7 apps.

**OpenShift:** Enterprise, governance, compliance, on-prem mogelijk.

## Beslismatrix: Wanneer kies je welk platform?

**Kies AKS als:** Volledige Kubernetes API (CRDs, Operators), eigen Ingress/Service Mesh, network policies en lifecycle control vereist zijn.

**Kies ACA als:** Meerdere microservices/APIs, events, autoscaling, canary via revisions, minimale beheerlast.

**Kies ACI als:** Korte geïsoleerde taken, CI/CD build/test containers, batch, GPU/spot workloads, per seconde billing.

**Kies OpenShift (ARO) als:** Enterprise governance, ingebouwde DevSecOps, strikte compliance, policy‑gedreven multi‑tenant platform.

**Kies On-prem OpenShift als:** Data residency / latency eisen, air‑gapped, volledige infrastructuurcontrole noodzakelijk.

> ⚠️ Windows containers? Alleen wanneer migratie/legacy blokkades bestaan. Voor nieuwe workloads: Linux (stabieler, grotere community).

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
- ACI gebruikt voor long-running processen (24/7) → duurder dan ACA/AKS.
- OpenShift on-prem onderschat (patching/hardware lifecycle) → resource overbelasting.
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
-- **Wat als ik geen Kubernetes-kennis heb?**
  - Start met ACA (microservices) of ACI (taken). Simpel web? App Service.
-- **Moet ik direct naar AKS als ik groei verwacht?**
  - Begin licht: bewijs behoefte (CRDs, policies). Migreer pas bij concrete eisen.
-- **Wanneer OpenShift boven AKS?**
  - Governance, ingebouwde security pipelines, multi‑tenant policy centraal.

---

## Series Navigation

{% if page.previous %}
[Vorige: {{ page.previous.title }}]({{ page.previous.url }})
{% endif %}
{% if page.next %}
[Volgende: {{ page.next.title }}]({{ page.next.url }})
{% endif %}

---
## Related articles

{% assign related_posts = site.posts | where: "series", "Kubernetes Top-Down" %}
{% if related_posts.size > 0 %}
<ul>
  {% for post in related_posts limit:5 %}
    {% if post.url != page.url %}
    <li><a href="{{ post.url }}">{{ post.title }}</a> <span style="color:#888;font-size:0.9em;">({{ post.date | date: '%Y-%m-%d' }})</span></li>
    {% endif %}
  {% endfor %}
</ul>
{% else %}
<p>Geen gerelateerde artikelen gevonden.</p>
{% endif %}

## Directe gidsen
In-depth stappenplannen en specifieke keuzes:
- {% include smart-link.html slug="getting-started-aca-aci" text="ACA vs ACI: container eenvoud vs serverless microservices" fallback="ACA vs ACI (blog volgt binnenkort)" %}
- {% include smart-link.html slug="getting-started-aks" text="AKS stap-voor-stap: volledige Kubernetes API" fallback="AKS stap-voor-stap (blog volgt binnenkort)" %}
- {% include smart-link.html slug="getting-started-aro" text="Azure Red Hat OpenShift (ARO): enterprise managed Kubernetes" fallback="ARO (blog volgt binnenkort)" %}
- {% include smart-link.html slug="getting-started-openshift-onprem" text="OpenShift on-premises: self-hosted enterprise" fallback="OpenShift on-prem (blog volgt binnenkort)" %}




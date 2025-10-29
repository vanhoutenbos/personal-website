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

## 1. Introductie
Kubernetes is dé standaard voor container orchestration, maar Azure biedt meerdere smaken: AKS, ACA, ACI en OpenShift. In deze blog help ik je kiezen aan de hand van praktijkervaring, een vergelijkingstabel en concrete tips. 

## 2. Mijn Perspectief
Met ruim 4 jaar ervaring in AKS, 2 jaar OpenShift, 2 jaar Docker Swarm en wat ACA/ACI, heb ik diverse scenario's meegemaakt. Mijn voorkeur? AKS voor .NET/DevOps, OpenShift voor enterprise governance, ACA voor snelle microservices, ACI voor CI/CD jobs.

## 3. Praktijkvoorbeelden & Vergelijking
Hieronder een overzicht van de belangrijkste platformen:

| Platform | Best For | Controle | Kosten | Complexiteit | Schaalbaarheid | Integraties | Notities |
|---|---|---|---|---|---|---|---|
| **AKS** | Productie, Azure integratie | Hoog | Medium | Hoog | Uitstekend | Azure, GitHub, DevOps | Volledig Kubernetes, managed door Azure |
| **ACA** | Microservices, APIs | Medium | Laag-Medium | Laag | Uitstekend | Dapr, Functions | Serverless, abstractie boven Kubernetes |
| **ACI** | Korte taken, CI/CD | Laag | Per seconde | Zeer laag | Geen | Basic Azure | Containers as a Service, niet voor 24/7 apps |
| **OpenShift** | Enterprise, governance | Zeer hoog | Hoog | Zeer hoog | Uitstekend | DevSecOps | Extra lagen, on-prem mogelijk |
| **On-prem OpenShift** | Compliance, latency | Maximaal | Zeer hoog | Extreem | Hardware afhankelijk | Geen native | Volledige controle, veel verantwoordelijkheid |

### TL;DR
- **AKS**: Maximale controle, geschikt voor complexe workloads, maar vereist Kubernetes-kennis.
- **ACA**: Snel starten, geen clusterbeheer, ideaal voor microservices.
- **ACI**: Simpele, korte taken, CI/CD jobs, niet voor 24/7 apps.
- **OpenShift**: Enterprise, governance, compliance, on-prem mogelijk.

## 4. Fouten & Learning
- Te snel gekozen voor AKS zonder exit-strategie: migratie bleek lastiger dan gedacht.
- ACA geprobeerd voor Windows workloads: bleek niet ondersteund.
- OpenShift on-prem: veel meer beheer dan verwacht, maar wel maximale controle.
**Tip:** Test je exit-strategie en check of je workloads passen bij het platform.

## 5. Afsluiting & Call-to-action
Mijn persoonlijke voorkeur is AKS vanwege Azure-integratie en community support. Maar: kies wat bij jouw team en use case past! 

**Heb je vragen of wil je advies? Laat een reactie achter of neem contact op!**

## 6. FAQ
- **Wat is het goedkoopst?**
  - Meestal ACI, omdat je per seconde betaalt en containers niet 24/7 draaien.
- **Wat is het makkelijkst?**
  - ACA voor developers, AKS voor DevOps, OpenShift voor enterprise.
- **Kan ik makkelijk migreren?**
  - Ja, maar test je exit-strategie en documenteer je setup.
- **Wat als ik geen Kubernetes-kennis heb?**
  - Start met ACA of ACI, of overweeg App Service.

## 7. Bronnen & Verder Lezen
- [Waarom Kubernetes?](/blog/waarom-kubernetes)

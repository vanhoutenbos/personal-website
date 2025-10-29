---
title: "Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?"
date: 2025-10-03
draft: true
categories: [Kubernetes, Keuzehulp]
---

# Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?

## Introductie
Overzicht van de opties en wanneer je welke kiest.
- Welke platformen heb je zelf gebruikt?
Ik heb zelf zo'n 4 jaar ervaring in AKS, 2 jaar in OpenShift, 2 jaar in Docker Swarm en een klein beetje in ACA en ACI
- Wat was je afweging?
Zelf zou ik voor AKS of ACA gaan omdat ik vaak ontzorgd wil worden en het als .NET developer gebruik, maar als enterprise klant zou ik gaan voor AKS of OpenShift afhankelijk van hoe technisch onderlegd mijn teams zijn.

## AKS (Azure Kubernetes Service)
- Wat zijn de voordelen/nadelen?
Managed Cluster wat inhoud dat het meeste wat te maken heeft met hardware & patches voor je gedaan word, je hoeft alleen een schedule aan te geven en een (of meerdere) type machines te kiezen en je platform is good-to-go
- Voor welke use cases is het geschikt?
Voor iemand die graag full-control heeft over zijn cluster maar niet alle hardware onderhoud erbij wilt hebben.

## ACA (Azure Container Apps)
- Wat zijn de voordelen/nadelen?
Een SaaS achtige oplossing waarbij je alleen maar hoeft te denken aan wat je wilt ontwikkelen en de architectuur daarvan en je geen zorgen hoeft te maken over de onderliggende machines.

- Voor welke use cases is het geschikt?
Voor teams die geen technische of server beheer wens hebben maar gewoon willen ontwikkelen en meerdere applicaties die onderling met elkaar babbelen willen maken.

## ACI (Azure Container Instances)
- Wat zijn de voordelen/nadelen?
Ook een SaaS (eigen CaaS = Containers as a Service) achtige oplossing maar vooral gericht op teams die kleinere isolated jobs of taken hebben die moeten draaien, denk aan het invullen van 2 waardes en als output 1 waarde.
Niet bedoelt om 24/7 aan te staan.

- Voor welke use cases is het geschikt?
Voor teams die 'willen ontwikkelen' en geen complexe landschappen hebben met veel applicaties die onderlingen afhankelijkheden hebben.

## Red Hat OpenShift (cloud & on-prem)
- Wat zijn de voordelen/nadelen?
Je hebt hierin een on-prem versie en een cloud versie. De cloud versie lijkt enorm op AKS maar is minder verwikkeld met Azure. Als je alleen een kubernetes cluster wilt dan is dit een hele goede keuze! Als je ook nog andere services van Azure gebruikt kom je al snel in de richting van AKS.
Dan heb je nog de on-premise versie, het grootste voordeel daarvan is dat je je eigen datacenter / leverancier kan kiezen of zelfs je eigen datacenter kan zijn, zodra Red Hat OpenShift draaiend is op de datacenter heb je de zelfde mogelijkheden als in de cloud.

- Voor welke use cases is het geschikt?
Voor klanten die zelf, soevereign, willen kunnen draaien op hun zelf gekozen on-premise oplossing of die buiten het azure eco-systeem willen blijven maar wel bijvoorbeeld de hosting door azure willen laten doen.

## Vergelijkingstabel
- Kun je een simpele vergelijking maken?
Absolutely — let’s slice through the noise and compare them cleanly. You’re basically choosing between **five different ways to run containers** that vary in control, cost, and complexity. Here’s a practical side-by-side view:

---

### 🧩 TL;DR Summary

| Platform                                      | Best For                                                      | Control   | Cost                       | Complexity | Scaling                  | Integrations                                                  | Notes                                                                     |
| --------------------------------------------- | ------------------------------------------------------------- | --------- | -------------------------- | ---------- | ------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **AKS (Azure Kubernetes Service)**            | Large-scale, production Kubernetes with Azure integration     | High      | Medium                     | High       | Excellent                | Deep Azure integration, GitHub Actions, DevOps, Azure Monitor | Great if you want full Kubernetes but managed by Azure                    |
| **ACA (Azure Container Apps)**                | Microservices, APIs, event-driven apps without managing infra | Medium    | Low-Medium                 | Low        | Excellent                | Dapr, Azure Functions, Event Grid                             | Serverless abstraction on top of Kubernetes; easy mode for containers     |
| **ACI (Azure Container Instances)**           | Short-lived or burst workloads, testing, jobs                 | Low       | Pay-per-second             | Very Low   | None                     | Basic Azure integrations                                      | Containers as a service; not meant for always-on apps                     |
| **OpenShift (managed on Azure or elsewhere)** | Enterprises needing security, CI/CD, governance               | Very High | High                       | Very High  | Excellent                | Full DevSecOps ecosystem                                      | OpenShift adds opinionated layers (Source-to-Image, Operators, Pipelines) |
| **On-prem OpenShift**                         | Regulated or isolated environments, full control              | Maximum   | Very High (hardware + ops) | Extreme    | Limited to your hardware | None native                                                   | Use if compliance forbids cloud or latency is critical                    |

---

### ⚙️ Conceptual Differences

* **AKS** = “Azure-managed Kubernetes.” You still manage YAML, deployments, Helm, etc., but Azure handles the control plane. Ideal when you want *real Kubernetes* with less babysitting.
* **ACA** = “Serverless Kubernetes without caring it’s Kubernetes.” Think of it as the lazy but powerful cousin of AKS — great for APIs, background tasks, or small-scale apps.
* **ACI** = “Run this container and forget it.” Ideal for CI jobs, testing, data processing — *not* for complex orchestration.
* **OpenShift (managed)** = “Enterprise Kubernetes with batteries included.” Security context constraints, built-in CI/CD (Tekton), policy, multi-tenancy, and compliance baked in.
* **OpenShift (on-prem)** = “Bring your own cloud.” You’re responsible for updates, nodes, clusters, networking, and everything. Use it if you must keep data local or cloud is not allowed.

---

### 🧠 Practical Recommendation (for a software engineer / DevOps workflow)

* If you want **maximum Azure integration** and scalability → **AKS**.
* If you want **simplicity and auto-scaling without ops** → **ACA**.
* If you want **quick jobs or CI workloads** → **ACI**.
* If you’re in a **large regulated enterprise** or need **multi-tenant governance** → **Managed OpenShift**.
* If you’re forced by compliance or latency to stay local → **On-prem OpenShift**, but know you’re trading flexibility for full responsibility.

---

### 🧩 Example scenario

If you’re currently using **Azure DevOps pipelines** and **GitHub Advanced Security**, and you want nightly dependency updates for 200 repos:

* **AKS** or **ACA** make the most sense.

  * AKS if you already have Kubernetes workloads and need more control (e.g. sidecars, complex scheduling).
  * ACA if it’s primarily scheduled jobs or APIs with lightweight dependencies — cheaper, easier, and scales automatically.

---

If you want, I can make a **decision flowchart** — something like “if this, go that way” — to visualize the choice for your specific use case. Would you like that?


## Praktische tips voor kiezen
- Welke tip zou je een beginner geven?
Begin bij wat jij het meeste herkend! Heb je al veel met Azure gewerkt? start met ACA of AKS.
Ben je een echte DIY'er? start met OpenShift op je eigen cluster, of wil je echt alleen even proeven dan is k3s of minikube of een alternatief ook een goede optie

## Conclusie & call-to-action
- Wat is jouw persoonlijke voorkeur?
AKS heeft wel echt mijn voorkeur maar dat komt voornamelijk door mijn achtergrond als Azure developer en mijn Microsoft Ecosysteem, maar de vrijheid die ik heb bij OpenShift On-Prem geeft ook een hoop motivatie wanneer iets lukt!

## FAQ
- Wat is het goedkoopst?
Dit is erg afhankelijk van je situatie maar vermoedelijk is dit ACI aangezien de containers daar niet 24/7 draaien.

- Wat is het makkelijkst?
Ik vond zelf conceptueel AKS het makkelijkst te begrijpen en er is veel informatie over te vinden

- Kan ik makkelijk migreren?
Ja, maar je zal wel vanaf dag 1 een exit-strategy moeten hebben en moeten testen
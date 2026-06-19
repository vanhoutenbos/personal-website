---
layout: single
title: "IaaS, CaaS, KaaS en PaaS: service delivery modellen voor Kubernetes uitgelegd"
date: 2026-06-09 06:00:00 +0200
categories: [Kubernetes, Cloud, Platform Engineering]
permalink: /blog/:year/:month/:day/:title.html
image: /assets/img/post-default.svg
image_alt: "Kubernetes service models uitgelegd"
tags: [IaaS, CaaS, KaaS, PaaS, AKS, ACI, ACA, OpenShift, Managed Kubernetes, Platform]
author: Jean-Paul van Houten - Bos
description: >
  Kubernetes draaien kan op vier manieren — van alles zelf beheren tot volledig uitbesteed.
  Dit artikel legt het verschil uit tussen IaaS, CaaS, KaaS en PaaS, en helpt je kiezen
  welk model bij jouw situatie past.
lang: nl
---
# IaaS, CaaS, KaaS en PaaS: service delivery modellen voor Kubernetes uitgelegd

Als je begint met Kubernetes, stuit je al snel op een wirwar van afkortingen: AKS, ACI, ACA, OpenShift, on-prem, managed, serverless. Wat de meeste vergelijkingen overslaan is het onderliggende model: **hoeveel beheert de provider of het platformteam, en hoeveel doe jij zelf?**

Deze vraag wordt beschreven met **service delivery modellen** — een term die breder is dan alleen cloud. De oorsprong ligt bij de drie NIST-modellen (IaaS, PaaS, SaaS), maar de container-wereld heeft daar CaaS en KaaS aan toegevoegd. En het model is net zo van toepassing op een intern platformteam dat Kubernetes levert als op een cloudprovider die dat doet.

Dat onderscheid valt uiteen in vier modellen. Ze volgen een spectrum van maximale controle naar maximale abstractie.

---

## Het spectrum: van alles zelf tot alles uitbesteed

```
← meer controle                              meer uitbesteed →

IaaS          CaaS           KaaS            PaaS
Zelf alles    Losse          Managed         Volledig
op VMs        containers     Kubernetes      beheerd platform
```

Elk model heeft een andere verdeling van verantwoordelijkheden tussen jou en de provider of het platformteam.

---

## IaaS — Infrastructure as a Service

**Jij installeert Kubernetes zelf op virtuele machines.**

De cloudprovider levert rekenkracht, netwerk en opslag. Wat je daarboven bouwt, is volledig jouw verantwoordelijkheid: het besturingssysteem, de Kubernetes-installatie, upgrades, etcd-beheer, node patching en alles daartussen.

**Voorbeelden:**
- Kubernetes installeren via `kubeadm` op Azure VMs of AWS EC2
- K3s op edge hardware of bare metal
- Rancher op zelfbeheerde nodes
- OpenShift on-premises — als jouw team het cluster zelf installeert en beheert op eigen hardware

**Wat jij beheert:**

| Laag | Jij |
|---|---|
| Hardware / VM | ✅ (of IaaS provider) |
| OS patching | ✅ |
| Kubernetes installatie | ✅ |
| Control plane (etcd, API server) | ✅ |
| Worker nodes | ✅ |
| Workloads | ✅ |

**Wanneer kiezen:**
- Strikte data residency of air-gapped omgeving
- Volledige controle over netwerk en hardware vereist
- Je hebt een dedicated operations team

**Wanneer niet:**
- Je hebt geen team voor cluster lifecycle management
- Snelheid van levering is belangrijker dan controle

> Verdieping: *Komend artikel — Vanilla Kubernetes: kubeadm, K3s en Rancher*
>
> Verdieping: [Waarom kiezen voor Kubernetes on-premises met OpenShift?](https://www.jeanpaulvanhouten.nl/blog/2026/01/15/getting-started-openshift-onprem.html)

---

## CaaS — Containers as a Service

**Jij start losse containers. Geen clusters, geen orchestratie.**

CaaS is de meest minimale containeroplossing. Je zegt "draai deze container" en de provider regelt de rest. Er is geen Kubernetes, geen scheduling, geen concept van nodes of namespaces. Het is ideaal voor korte taken, batch jobs of burst workloads waarbij je niet wilt nadenken over infrastructuur.

**Voorbeelden:**
- Azure Container Instances (ACI) — losse containers per seconde
- Azure Container Apps (ACA) — serverless microservices met auto-scaling
- AWS Fargate (standalone)

**Wat jij beheert:**

| Laag | Provider | Jij |
|---|---|---|
| Infrastructuur | ✅ | |
| Container runtime | ✅ | |
| Scheduling | ✅ | |
| Container image + config | | ✅ |
| Applicatielogica | | ✅ |

**ACI vs ACA — het verschil binnen CaaS:**

| | ACI | ACA |
|---|---|---|
| Use case | Batch, CI/CD jobs, eenmalige taken | Web apps, APIs, microservices |
| Schaalbaarheid | Handmatig, 1 container | Auto-scaling, 0 tot veel |
| Networking | Basis | Ingress, load balancing |
| Kubernetes zichtbaar | ❌ | ❌ (draait er wel onder) |

ACA is de bovengrens van CaaS: het biedt meer dan pure container execution (revisions, traffic splitting, event-driven scaling via KEDA), maar je hebt als gebruiker geen toegang tot de Kubernetes API of het platform eronder. Dat houdt het in het CaaS-model, zij het aan de rijkere kant.

**Wanneer kiezen:**
- Korte geïsoleerde taken of CI/CD runners
- Snel starten zonder Kubernetes-kennis
- Betalen per gebruik in plaats van een vast cluster

**Wanneer niet:**
- Je hebt Kubernetes API, Helm of operators nodig
- Je wilt stateful workloads met persistent volumes
- Je hebt complexe multi-tenant isolatie nodig

> Verdieping: [Containers zonder Kubernetes: ACA & ACI](https://www.jeanpaulvanhouten.nl/blog/2025/11/27/getting-started-aca-aci.html)

---

## KaaS — Kubernetes as a Service

**De cloudprovider beheert de control plane. Jij beheert de workloads.**

Dit is het meest gebruikte model voor productie-Kubernetes. De provider zorgt voor de API server, etcd, scheduler en control plane upgrades. Jij deployt en beheert workloads via de standaard Kubernetes API — inclusief Helm, operators, custom resources en alles wat daarbij hoort.

Maar let op: **managed Kubernetes is geen managed platform.** De provider beheert de motor, niet de auto. RBAC, NetworkPolicies, ResourceQuotas, image scanning, audit logging en backup — dat bouw je zelf.

**Voorbeelden:**
- Azure Kubernetes Service (AKS)
- AWS Elastic Kubernetes Service (EKS)
- Google Kubernetes Engine (GKE)
- Azure Red Hat OpenShift (ARO)

**Wat jij beheert:**

| Laag | Provider | Jij |
|---|---|---|
| Control plane | ✅ | |
| Node OS patching (managed pools) | ✅ | |
| Kubernetes upgrades | ✅ (gedeeltelijk) | ✅ (planning) |
| RBAC model | | ✅ |
| NetworkPolicies | | ✅ |
| ResourceQuotas | | ✅ |
| Observability pipeline | | ✅ |
| Backup & restore | | ✅ |
| Cost governance | | ✅ |

**Wanneer kiezen:**
- Volledige Kubernetes API nodig (CRDs, operators, Helm)
- Microservices platform voor meerdere teams
- Je wilt beheerde control plane, maar eigen vrijheid in tooling

**Wanneer niet:**
- Je hebt geen team om governance zelf op te bouwen
- Je hebt alleen eenvoudige stateless containers
- Strikte on-premises vereisten

> Verdieping: [Snel aan de slag met AKS](https://www.jeanpaulvanhouten.nl/blog/2025/12/11/getting-started-aks.html)
>
> Verdieping: [Managed Kubernetes — wat lost het wél en niet voor je op?](https://www.jeanpaulvanhouten.nl/blog/2026/06/16/managed-kubernetes.html)

---

## PaaS — Platform as a Service

**Een platformteam of vendor beheert alles onder de applicatielaag.**

PaaS gaat verder dan KaaS. Niet alleen de control plane, maar ook de worker nodes, netwerkconfiguratie, security baselines, upgrades en governance worden beheerd — door de cloudprovider of door een intern platformteam. Jij deployt alleen workloads en houdt je aan de kaders die het platform oplegt.

In de Kubernetes-wereld zie je dit model op twee manieren:

**1. Volledig managed enterprise platform (cloud)**
De provider levert een compleet, opinionated Kubernetes-platform inclusief ingebouwde security, CI/CD-tooling en compliance-features.

**Voorbeelden:**
- Azure Red Hat OpenShift (ARO) — managed OpenShift in Azure
- Google Cloud Run on GKE
- Intern Shared Platform (SP) model — zoals bij overheidsorganisaties waarbij één platformteam het cluster beheert en dev-teams als tenant opereren

**2. Shared Platform model (intern PaaS)**
Een intern platformteam levert Kubernetes als dienst aan applicatieteams. Teams krijgen een namespace, quota en routing — en deployen zelf hun workloads via GitOps. Het platformteam beheert nodes, netwerk, upgrades en governance.

Dit is het model dat veel overheids- en enterprise-organisaties hanteren.

**Wat jij beheert als tenant:**

| Laag | Platformteam / Provider | Jij (tenant) |
|---|---|---|
| Control plane | ✅ | |
| Worker nodes | ✅ | |
| Netwerk / ingress | ✅ | |
| Upgrades en patching | ✅ | |
| Namespace en quota | ✅ (instellen) | |
| Security policies | ✅ (opgelegd) | |
| Workloads deployen | | ✅ |
| Helm charts / ArgoCD apps | | ✅ |
| RBAC binnen namespace | Deels | ✅ |

**Wanneer kiezen:**
- Enterprise governance en compliance vereist
- Geen eigen ops-team voor cluster lifecycle
- Multi-tenant isolatie out-of-the-box nodig
- Je wilt een gecurateerd platform consumeren in plaats van zelf bouwen

**Wanneer niet:**
- Je hebt volledige flexibiliteit nodig in clusterinrichting
- Je wilt eigen keuzes maken in netwerking, ingress of node-configuratie

> Verdieping: [Snel aan de slag met Azure Red Hat OpenShift (ARO)](https://www.jeanpaulvanhouten.nl/blog/2026/01/01/getting-started-aro.html)

---

## De vier modellen naast elkaar

| | IaaS | CaaS | KaaS | PaaS |
|---|---|---|---|---|
| **Kubernetes aanwezig** | Zelf installeren | ❌ | ✅ | ✅ |
| **Control plane beheerd** | ❌ | n.v.t. | ✅ | ✅ |
| **Worker nodes beheerd** | ❌ | ✅ | ⚠️ Deels | ✅ |
| **Governance / policies** | Zelf | Minimaal | Zelf | Opgelegd |
| **Vrijheid in tooling** | Maximaal | Beperkt | Hoog | Laag |
| **Operationele overhead** | Zeer hoog | Laag | Medium | Laag |
| **Azure voorbeeld** | VMs + kubeadm / OpenShift on-prem | ACI / ACA | AKS / ARO | ARO managed / SP |

---

## Welk model past bij jou?

**Kies IaaS als:** je volledige controle nodig hebt, air-gapped werkt, of je eigen hardware beheert.

**Kies CaaS als:** je losse containers of eenvoudige microservices wilt draaien zonder Kubernetes-kennis of clusterkosten.

**Kies KaaS als:** je de volledige Kubernetes API nodig hebt, maar geen cluster lifecycle wilt beheren. Je bouwt governance zelf.

**Kies PaaS als:** je als team alleen workloads wilt deployen en de infrastructuur volledig uitbesteedt — aan een cloudprovider of een intern platformteam.

> Twijfel je nog? De [Kubernetes Keuzehulp](https://www.jeanpaulvanhouten.nl/kubernetes/keuzehulp/2025/10/29/kubernetes-keuzehulp.html) helpt je kiezen op basis van je specifieke situatie.

---

## Evolutiepad

De meeste teams beginnen simpel en groeien naar meer complexiteit naarmate de behoeften toenemen:

```
ACI/ACA (CaaS)  →  AKS (KaaS)  →  OpenShift / SP (PaaS)
Snel starten       Volledige API    Enterprise governance
```

Ga niet direct naar het zwaarste model. Bewijs eerst de behoefte, dan de complexiteit.

---

## Series Navigation

[Terug naar Kubernetes overzicht](https://www.jeanpaulvanhouten.nl/kubernetes/)

[Volgende: Kubernetes Keuzehulp — AKS, ACA, ACI, OpenShift of zelf hosten?](https://www.jeanpaulvanhouten.nl/kubernetes/keuzehulp/2025/10/29/kubernetes-keuzehulp.html)

---

## Gerelateerde artikelen

- [Containers zonder Kubernetes: ACA & ACI](https://www.jeanpaulvanhouten.nl/blog/2025/11/27/getting-started-aca-aci.html) — CaaS in de praktijk
- [Snel aan de slag met AKS](https://www.jeanpaulvanhouten.nl/blog/2025/12/11/getting-started-aks.html) — KaaS quickstart
- [Managed Kubernetes: wat lost het wél en niet voor je op?](https://www.jeanpaulvanhouten.nl/blog/2026/06/16/managed-kubernetes.html) — KaaS governance diepgang
- [Waarom kiezen voor Kubernetes on-premises met OpenShift?](https://www.jeanpaulvanhouten.nl/blog/2026/01/15/getting-started-openshift-onprem.html) — IaaS on-prem
- [Snel aan de slag met Azure Red Hat OpenShift (ARO)](https://www.jeanpaulvanhouten.nl/blog/2026/01/01/getting-started-aro.html) — PaaS managed platform
- [Kubernetes Keuzehulp](https://www.jeanpaulvanhouten.nl/kubernetes/keuzehulp/2025/10/29/kubernetes-keuzehulp.html) — platform vergelijking en beslismatrix

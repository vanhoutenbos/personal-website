---
title: "Containers zonder Kubernetes: Azure Container Apps (ACA) & Container Instances (ACI)"
date: 2025-11-27
categories: [Containers, Getting Started]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Wil je containers draaien zonder de complexiteit van Kubernetes? Ontdek ACA en ACI - serverless en simpel. Inclusief quickstart en wanneer je welke kiest."
image: /assets/img/post-default.svg
image_alt: "Azure Container Apps en Container Instances"
tags: [Azure, ACA, ACI, Containers, Serverless]
series: "Kubernetes Top-Down"
series_order: 4
series_path: "pad-a-lightweight"
---

# Containers zonder Kubernetes: Azure Container Apps & Container Instances

**Het belangrijkste eerst: ACA en ACI zijn GEEN Kubernetes.** Dit is bewust. Als je na het lezen van {% include smart-link.html slug="waarom-kubernetes" text="Van Docker tot Kubernetes" fallback="Van Docker tot Kubernetes" %} besloten hebt dat je **geen orchestratie** nodig hebt, dan ben je hier op de juiste plek.

## Waarom dit pad?

Je hebt containers en wilt ze in de cloud draaien, maar:
- Je hebt **geen** 10+ microservices
- Je wilt **geen** cluster beheren  
- Je wilt **snel** kunnen starten
- Je betaalt liever per gebruik dan voor een heel cluster

**Dan zijn ACA en ACI perfect voor jou.**

## ACI vs ACA: Wanneer welke?

| Aspect | ACI | ACA |
|--------|-----|-----|
| **Use case** | Batch jobs, één-malige taken | Web apps, APIs, microservices |
| **Schaalbaarheid** | Handmatig, 1 container | Auto-scaling, 0-veel containers |
| **Networking** | Basis (public IP of VNet) | Ingress, load balancing |
| **Pricing** | Per seconde CPU/RAM | Per seconde vCPU/RAM + requests |

**Vuistregel:**
- **Run-and-done job?** → ACI
- **Always-on service met variabele load?** → ACA

## Conclusie: kies bewust, start simpel

ACA en ACI zijn **krachtige tools voor 80% van container workloads**. Je hoeft niet naar Kubernetes te grijpen "omdat iedereen het gebruikt".

### Volgende stappen

- **Wil je tóch Kubernetes leren?** Start met {% include smart-link.html slug="getting-started-aks" text="Getting Started AKS" fallback="Getting Started AKS (blog volgt binnenkort)" %}
- **Twijfel je nog?** Lees de {% include smart-link.html slug="kubernetes-keuzehulp" text="Kubernetes Keuzehulp" fallback="Kubernetes Keuzehulp" %}


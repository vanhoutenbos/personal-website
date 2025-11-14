---
title: "Snel aan de slag met Azure Kubernetes Service (AKS)"
date: 2025-12-11
categories: [Kubernetes, Getting Started]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Praktische gids voor AKS: cluster aanmaken, kubectl setup, eerste deployment en monitoring. Pure managed Kubernetes zonder enterprise overhead."
image: /assets/img/post-default.svg
image_alt: "Azure Kubernetes Service"
tags: [Azure, AKS, Kubernetes, Containers, Managed Kubernetes]
series: "Kubernetes Top-Down"
series_order: 5
series_path: "pad-b1-aks"
---

# Snel aan de slag met Azure Kubernetes Service (AKS)

**PAD B1: Managed Kubernetes**

Je hebt besloten dat je Kubernetes nodig hebt. Nu wil je snel aan de slag zonder de complexiteit van cluster lifecycle management. **AKS is perfect voor jou.**

## Waarom AKS?

AKS is Microsoft's managed Kubernetes service. Dat betekent:
- **Microsoft beheert de control plane** (API server, etcd, scheduler)
- **Jij beheert alleen je workloads** (deployments, services, pods)
- **Native Azure integratie** (AAD, Monitor, Policy, DevOps)
- **Geen kosten voor control plane** - je betaalt alleen voor worker nodes

Dit is **pure Kubernetes** - geen extra layers of opinionated tooling zoals bij enterprise platforms.

## Voorbereiding

Je hebt nodig:
- Azure subscription ([gratis trial beschikbaar](https://azure.microsoft.com/free/))
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) geïnstalleerd
- Basiskennis van containers (zie {% include smart-link.html slug="waarom-kubernetes" text="Van Docker tot Kubernetes" fallback="Van Docker tot Kubernetes" %})

## Quick Start: AKS Cluster in 5 minuten

### 1. Login en resourcegroep

```bash
az login
az group create --name myAKSResourceGroup --location westeurope
```

### 2. Maak AKS cluster

```bash
az aks create \
  --resource-group myAKSResourceGroup \
  --name myAKSCluster \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys
```

Dit maakt een cluster met:
- 2 worker nodes (Standard_DS2_v2)
- Azure Monitor voor container insights
- Managed identity voor Azure integraties

### 3. Configureer kubectl

```bash
az aks get-credentials --resource-group myAKSResourceGroup --name myAKSCluster
kubectl get nodes
```

Je ziet nu je 2 nodes in `Ready` status. **Je hebt Kubernetes draaien!**

## Eerste Deployment: Nginx

Laten we een simpele webserver deployen:

```bash
kubectl create deployment nginx --image=nginx:latest
kubectl expose deployment nginx --port=80 --type=LoadBalancer
```

Wacht tot het externe IP beschikbaar is:

```bash
kubectl get service nginx --watch
```

Bezoek het `EXTERNAL-IP` in je browser - je ziet de Nginx welcome pagina.

## Monitoring met Azure Monitor

AKS heeft out-of-box monitoring via Container Insights:

1. Ga naar [Azure Portal](https://portal.azure.com)
2. Zoek je AKS cluster
3. Klik op **Insights** in het linkermenu

Je ziet nu:
- **Node/Pod CPU & Memory usage**
- **Container logs** (stdout/stderr)
- **Live metrics**
- **Kusto queries** voor advanced analytics

💡 **Tip:** Gebruik `kubectl logs <pod-name>` voor snelle troubleshooting, Azure Monitor voor trends en alerts.

## Scaling: Horizontal Pod Autoscaler

Kubernetes kan automatisch pods toevoegen bij hoge load:

```bash
kubectl autoscale deployment nginx --cpu-percent=50 --min=1 --max=10
kubectl get hpa
```

Nu schaalt Nginx automatisch tussen 1-10 replicas op basis van CPU gebruik.

Voor **cluster-level scaling** (nodes toevoegen):

```bash
az aks update \
  --resource-group myAKSResourceGroup \
  --name myAKSCluster \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

## Best Practices voor productie

1. **Gebruik Azure AD integratie** voor RBAC
   ```bash
   az aks update --resource-group myAKSResourceGroup --name myAKSCluster --enable-aad
   ```

2. **Enable Azure Policy** voor governance
   ```bash
   az aks enable-addons --resource-group myAKSResourceGroup --name myAKSCluster --addons azure-policy
   ```

3. **Network Policies** voor pod-to-pod security
   ```bash
   az aks create ... --network-plugin azure --network-policy azure
   ```

4. **Managed Identities** (niet service principals)
   - AKS maakt dit standaard al aan sinds 2021

## Wanneer NIET AKS?

AKS is geweldig, maar niet altijd de beste keuze:

| Scenario | Betere optie |
|----------|-------------|
| Strikte enterprise governance vereist | {% include smart-link.html slug="getting-started-openshift" text="Azure Red Hat OpenShift (ARO)" fallback="Azure Red Hat OpenShift (blog volgt)" %} |
| Data moet on-premises blijven | {% include smart-link.html slug="getting-started-openshift-onprem" text="OpenShift on-prem" fallback="OpenShift on-prem (blog volgt)" %} |
| Simpele stateless apps | {% include smart-link.html slug="getting-started-aca-aci" text="Azure Container Apps" fallback="Azure Container Apps" %} |

## Opruimen

Vergeet niet om resources te verwijderen als je klaar bent met testen:

```bash
az group delete --name myAKSResourceGroup --yes --no-wait
```

## Conclusie

AKS geeft je **pure Kubernetes** met **minimale operationele overhead**. Perfect voor teams die:
- Kubernetes API volledig willen gebruiken
- Niet enterprise tooling out-of-box nodig hebben
- Azure-native integraties willen
- Kosten laag willen houden

### Volgende stappen

- **Wil je enterprise features?** Lees over {% include smart-link.html slug="getting-started-openshift" text="Azure Red Hat OpenShift (ARO)" fallback="ARO (blog volgt)" %}
- **Meer Kubernetes leren?** Bekijk de [Kubernetes overzichtspagina](/kubernetes/)
- **Twijfel tussen platforms?** Lees de {% include smart-link.html slug="kubernetes-keuzehulp" text="Kubernetes Keuzehulp" fallback="Kubernetes Keuzehulp" %}


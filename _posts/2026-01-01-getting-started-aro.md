---
title: "Getting Started met Azure Red Hat OpenShift (ARO)"
date: 2026-01-01 06:00:00 +0200
categories: [Kubernetes, Getting Started, Enterprise]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Azure Red Hat OpenShift: wanneer je enterprise Kubernetes nodig hebt. ARO vs AKS, built-in DevSecOps, multi-tenancy en OpenShift tooling."
image: /assets/img/post-default.svg
image_alt: "Azure Red Hat OpenShift"
tags: [OpenShift, ARO, Kubernetes, Azure, Enterprise, Red Hat]
series: "Kubernetes Top-Down"
series_order: 6
series_path: "pad-b2-aro"
---

# Getting Started met Azure Red Hat OpenShift (ARO)

**PAD B2: Enterprise Managed Kubernetes**

Je hebt Kubernetes nodig, maar ook:
- **Strikte governance en compliance** (multi-tenancy, RBAC, policy)
- **Built-in DevSecOps tooling** (CI/CD, GitOps, image scanning)
- **Enterprise support** (Microsoft + Red Hat gezamenlijk)
- **Opinionated best practices** out-of-the-box

**Dan is ARO de juiste keuze.**

## ARO vs AKS: wat is het verschil?

| Aspect | AKS | ARO |
|--------|-----|-----|
| **Basis** | Pure upstream Kubernetes | OpenShift (Kubernetes + tooling) |
| **Control Plane** | Gratis | Inclusief in pricing |
| **Kosten** | €70-150/maand voor nodes | €200-400/maand (nodes + licentie) |
| **Multi-tenancy** | Handmatig (namespaces + RBAC) | Built-in Projects met quota |
| **CI/CD** | Integreer zelf (GitHub Actions, etc) | Built-in Pipelines + Tekton |
| **GitOps** | Installeer ArgoCD/Flux | Built-in GitOps operator |
| **Image Registry** | Azure Container Registry (apart) | Built-in registry per project |
| **Developer UX** | kubectl CLI | `oc` CLI + Web Console |
| **Security** | Azure Policy (apart) | Built-in SCC, NetworkPolicy |
| **Support** | Microsoft | Microsoft + Red Hat joint |

**Vuistregel:**
- **AKS**: Je wilt Kubernetes API, rest zelf inrichten → lager kosten
- **ARO**: Je wilt enterprise platform out-of-box → hogere kosten, minder configuratie

## Waarom ARO kiezen?

### 1. **Enterprise Governance**
- **Multi-tenancy**: Projects met resource quotas en netwerk isolatie
- **RBAC**: Gedetailleerde role-based access control per project
- **Security Context Constraints (SCC)**: Wat containers wel/niet mogen (privileged, hostPath, etc)

### 2. **DevSecOps out-of-box**
- **Built-in CI/CD**: Tekton Pipelines geïntegreerd
- **GitOps**: OpenShift GitOps operator (ArgoCD onder de motorkap)
- **Image scanning**: Integratie met Red Hat Quay voor vulnerability scanning
- **Developer catalog**: Pre-built templates voor Java, .NET, Node.js, Python

### 3. **Managed door Microsoft + Red Hat**
- **Joint support**: Beide vendors zijn verantwoordelijk
- **Upgrades**: Managed control plane én worker nodes
- **SLA**: 99.95% uptime garantie

## Quick Start: ARO Cluster aanmaken

⚠️ **Let op:** ARO vereist een Red Hat pull secret en heeft specifieke netwerk requirements. Volg de [officiële ARO documentatie](https://docs.microsoft.com/azure/openshift/) voor production setups.

### Voorbereiding

```bash
# Registreer ARO resource provider
az provider register --namespace Microsoft.RedHatOpenShift --wait

# Installeer OpenShift CLI (oc)
# Download van https://mirror.openshift.com/pub/openshift-v4/clients/ocp/
```

### 1. Netwerk en Resource Group

```bash
LOCATION=westeurope
RESOURCEGROUP=myARO-rg
CLUSTER=myAROCluster

az group create --name $RESOURCEGROUP --location $LOCATION

# Maak VNet (ARO vereist dedicated subnets)
az network vnet create \
  --resource-group $RESOURCEGROUP \
  --name aro-vnet \
  --address-prefixes 10.0.0.0/22

# Master subnet
az network vnet subnet create \
  --resource-group $RESOURCEGROUP \
  --vnet-name aro-vnet \
  --name master-subnet \
  --address-prefixes 10.0.0.0/23 \
  --service-endpoints Microsoft.ContainerRegistry

# Worker subnet
az network vnet subnet create \
  --resource-group $RESOURCEGROUP \
  --vnet-name aro-vnet \
  --name worker-subnet \
  --address-prefixes 10.0.2.0/23 \
  --service-endpoints Microsoft.ContainerRegistry
```

### 2. ARO Cluster aanmaken (duurt ~35 minuten)

```bash
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet \
  --pull-secret @pull-secret.txt  # Red Hat pull secret
```

### 3. Login via oc CLI

```bash
# Haal cluster credentials op
apiServer=$(az aro show -g $RESOURCEGROUP -n $CLUSTER --query apiserverProfile.url -o tsv)
kubeadminPassword=$(az aro list-credentials -g $RESOURCEGROUP -n $CLUSTER --query kubeadminPassword -o tsv)

# Login
oc login $apiServer -u kubeadmin -p $kubeadminPassword
```

Je hebt nu toegang tot OpenShift!

## OpenShift Web Console

Anders dan AKS heeft ARO een **krachtige web UI**:

```bash
# Open web console URL
az aro show -g $RESOURCEGROUP -n $CLUSTER --query "consoleProfile.url" -o tsv
```

Login met `kubeadmin` en het wachtwoord. In de console zie je:
- **Developer perspective**: Applicatie-gerichte view (topologie, builds, pipelines)
- **Administrator perspective**: Cluster-gerichte view (nodes, operators, projects)

💡 **Dit is het grote verschil met AKS** - OpenShift is gebouwd voor zowel developers als operators.

## Eerste Project en Deployment

### Maak een Project (= Namespace met extra's)

```bash
oc new-project myapp
```

Dit maakt niet alleen een namespace, maar ook:
- **Resource quotas** (CPU/memory limits)
- **Network policies** (isolatie)
- **RBAC** (wie heeft toegang)

### Deploy een app via Source-to-Image (S2I)

OpenShift kan **direct vanuit Git deployen** zonder Dockerfile:

```bash
oc new-app https://github.com/sclorg/nodejs-ex
oc expose service/nodejs-ex
```

Dit triggert:
1. **BuildConfig**: Detecteert Node.js, maakt container image
2. **ImageStream**: Versioned container registry
3. **DeploymentConfig**: Deployt de app
4. **Service + Route**: Maakt app toegankelijk

Bekijk de URL:

```bash
oc get route nodejs-ex
```

**Dit is veel sneller dan in AKS** waar je zelf een Dockerfile, CI/CD pipeline en ingress moet configureren.

## ARO Features die AKS niet heeft

### 1. **Projects met quotas**

```bash
oc create quota dev-quota \
  --hard=cpu=4,memory=8Gi,pods=10 \
  -n myapp
```

Elk team krijgt een Project met harde limieten - automatisch enforced.

### 2. **Built-in Image Registry**

```bash
oc get imagestream
```

Elke build opgeslagen in cluster-eigen registry - geen ACR nodig.

### 3. **Security Context Constraints (SCC)**

```bash
oc get scc
```

Controleert wat containers mogen:
- `restricted`: Geen root, geen host access (default)
- `anyuid`: Run as any user
- `privileged`: Volledige host access

In AKS moet je dit met PodSecurityPolicy of Azure Policy regelen.

### 4. **GitOps Operator**

```bash
oc create -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: ArgoCD
metadata:
  name: argocd
  namespace: argocd
spec: {}
EOF
```

ArgoCD is OpenShift-native - geen Helm charts nodig.

## Wanneer NIET ARO?

ARO is krachtig, maar niet altijd de juiste keuze:

| Scenario | Betere optie |
|----------|-------------|
| Budget < €500/maand voor K8s | {% include smart-link.html slug="getting-started-aks" text="AKS" fallback="AKS" %} |
| Simpele microservices zonder governance | {% include smart-link.html slug="getting-started-aks" text="AKS" fallback="AKS" %} of {% include smart-link.html slug="getting-started-aca-aci" text="ACA" fallback="ACA" %} |
| Data mag niet naar cloud | {% include smart-link.html slug="getting-started-openshift-onprem" text="OpenShift on-prem" fallback="OpenShift on-prem (blog volgt)" %} |
| Team heeft geen OpenShift kennis | {% include smart-link.html slug="getting-started-aks" text="AKS" fallback="AKS" %} (makkelijker learning curve) |

## Kosten Indicatie

**Minimale ARO setup:**
- 3 master nodes (managed, inclusief)
- 3 worker nodes (Standard_D4s_v3)
- **~€800-1000/maand** (nodes + OpenShift licentie)

**Vergelijkbare AKS setup:**
- Control plane (gratis)
- 3 worker nodes (Standard_D4s_v3)
- **~€300-400/maand**

**Je betaalt 2-3x meer voor ARO, maar krijgt:**
- Built-in CI/CD, GitOps, registry, developer tools
- Enterprise support (Microsoft + Red Hat)
- Security out-of-box (SCC, network policies)

## Opruimen

```bash
az aro delete --resource-group $RESOURCEGROUP --name $CLUSTER --yes
az group delete --name $RESOURCEGROUP --yes --no-wait
```

## Conclusie

ARO is **Kubernetes met enterprise training wheels**:
- **Perfect voor teams** die governance/compliance nodig hebben
- **Perfect voor organisaties** met Red Hat ecosysteem
- **Perfect voor developers** die niet diep in Kubernetes willen duiken

Maar je betaalt premium pricing. **Kies bewust:**
- Heb je echt multi-tenancy, SCC, built-in CI/CD nodig? → ARO
- Wil je gewoon Kubernetes + zelf tools kiezen? → AKS

### Volgende stappen

- **Wil je on-premises draaien?** Lees over {% include smart-link.html slug="getting-started-openshift-onprem" text="OpenShift on-prem" fallback="OpenShift on-prem (blog volgt)" %}
- **Twijfel tussen AKS en ARO?** Bekijk de {% include smart-link.html slug="kubernetes-keuzehulp" text="Kubernetes Keuzehulp" fallback="Kubernetes Keuzehulp" %}
- **Meer over OpenShift?** Bekijk [Red Hat OpenShift docs](https://docs.openshift.com/)

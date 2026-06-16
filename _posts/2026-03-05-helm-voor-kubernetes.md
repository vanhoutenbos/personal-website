---
title: "Helm voor Kubernetes: wat het is, waarom je het wilt en hoe je het goed gebruikt"
date: 2026-03-05 06:00:00 +0200
categories: [Kubernetes, Tools]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Helm is de de facto package manager voor Kubernetes. In dit artikel leer je wat Helm doet, hoe je je eerste chart maakt en welke best practices het verschil maken tussen een werkbare en een onderhoudbare setup."
image: /assets/img/post-default.svg
image_alt: "Helm package manager voor Kubernetes"
tags: [Kubernetes, Helm, DevOps, CI/CD, GitOps, Containers]
series: "Kubernetes Top-Down"
series_order: 6
series_path: "helm-best-practices"
lang: nl
---

# Helm voor Kubernetes: wat het is, waarom je het wilt en hoe je het goed gebruikt

Als je een tijdje met Kubernetes werkt, kom je onvermijdelijk Helm tegen. In job-advertenties, in documentatie van open-source tooling, in gesprekken met collega's. "Installeer het via Helm." "Hebben jullie een Helm chart?" "We deployen met Helm en GitOps."

Maar wat is Helm nu precies, wanneer heb je het nodig, en hoe zorg je dat het niet uitgroeit tot een onbeheersbare verzameling YAML die niemand meer durft aan te raken? Dat is waar dit artikel over gaat.

## Wat is Helm?

Helm is de package manager voor Kubernetes. Net zoals `apt` of `brew` software installeert op een besturingssysteem, installeert Helm applicaties op een Kubernetes-cluster.

Een Helm **chart** is een pakket dat alle Kubernetes-bestanden bevat die nodig zijn om een applicatie te draaien: Deployments, Services, ConfigMaps, Ingresses, enzovoort. Een Helm **release** is een geinstalleerde instantie van zo'n chart.

Zonder Helm heb je voor een applicatie mogelijk tien losse YAML-bestanden die je handmatig toepast, bijhoudt en aanpast per omgeving. Met Helm heb je een chart met templates en een `values.yaml` die het gedrag per omgeving bepaalt.

```bash
# Zonder Helm: elk bestand handmatig
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f configmap.yaml
kubectl apply -f hpa.yaml

# Met Helm: alles in een commando
helm upgrade --install mijn-app ./helm/mijn-app \
  --namespace mijn-app-prod \
  --values ./helm/mijn-app/values-prod.yaml
```

Het verschil klinkt klein, maar wordt significant als je tien services hebt, drie omgevingen en wekelijkse releases.

## De anatomie van een Helm chart

Een chart heeft een vaste structuur:

```
mijn-app/
  Chart.yaml          # Metadata: naam, versie, beschrijving
  values.yaml         # Standaardwaarden (overschrijfbaar per omgeving)
  templates/
    deployment.yaml   # Kubernetes Deployment template
    service.yaml      # Kubernetes Service template
    ingress.yaml      # Kubernetes Ingress template
    _helpers.tpl      # Gedeelde template functies
  charts/             # Afhankelijke charts (subcharts)
```

Een eenvoudige `deployment.yaml` in een chart ziet er zo uit:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mijn-app.fullname" . }}
  labels:
    {{- include "mijn-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mijn-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mijn-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
```

De `{{ }}` blokken zijn Go-template syntax. Waarden komen uit `values.yaml` via `.Values.*`, uit de chart metadata via `.Chart.*`, of uit ingebouwde functies.

De bijbehorende `values.yaml`:

```yaml
replicaCount: 2

image:
  repository: mycompany.azurecr.io/mijn-app
  tag: latest

service:
  port: 8080

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

Voor productie maak je een `values-prod.yaml` die alleen de afwijkende waarden bevat:

```yaml
replicaCount: 5

image:
  tag: 1.4.2

resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi
```

## Je eerste chart maken

Helm kan een chart-skelet voor je genereren:

```bash
helm create mijn-app
```

Dit maakt een chart aan met een voorbeeldapplicatie (nginx). Pas de templates en waarden aan naar jouw situatie. Verwijder wat je niet gebruikt — een chart vol ongebruikte templates is verwarrend.

Controleer het resultaat voordat je deployt:

```bash
# Render templates zonder te deployen
helm template mijn-app ./helm/mijn-app --values ./helm/mijn-app/values-prod.yaml

# Controleer op fouten zonder cluster
helm lint ./helm/mijn-app

# Dry-run tegen het cluster
helm upgrade --install mijn-app ./helm/mijn-app \
  --namespace mijn-app-prod \
  --values ./helm/mijn-app/values-prod.yaml \
  --dry-run
```

`helm template` is je beste vriend bij het debuggen. Het toont precies welke YAML Helm naar het cluster stuurt.

## De meest gebruikte Helm-commando's

```bash
# Installeer of update een release
helm upgrade --install <release-naam> <chart-pad> \
  --namespace <namespace> \
  --create-namespace \
  --values <values-bestand>

# Bekijk alle releases in een namespace
helm list --namespace mijn-app-prod

# Bekijk de geschiedenis van een release
helm history mijn-app --namespace mijn-app-prod

# Rollback naar een vorige versie
helm rollback mijn-app 3 --namespace mijn-app-prod

# Verwijder een release
helm uninstall mijn-app --namespace mijn-app-prod

# Zoek publieke charts
helm search hub prometheus

# Voeg een repository toe
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

De `--install` flag bij `upgrade` is handig in CI/CD: het commando werkt zowel voor een eerste installatie als voor een update, zonder dat je hoeft te controleren of de release al bestaat.

## Best practices die het verschil maken

### 1. Gebruik expliciete image-tags, nooit `latest`

```yaml
# Slecht: onvoorspelbaar en niet reproduceerbaar
image:
  tag: latest

# Goed: precies weten wat er draait
image:
  tag: 1.4.2
```

`latest` zorgt voor deployments die er hetzelfde uitzien maar anders gedragen, afhankelijk van wanneer het image is gepulld. Gebruik altijd een versie-tag, een git commit SHA, of een build-nummer.

### 2. Sla secrets nooit op in values-bestanden

```yaml
# Slecht: plaintext secret in Git
database:
  password: mijn-geheim-wachtwoord

# Goed: verwijs naar een Kubernetes Secret of externe vault
database:
  passwordSecretRef:
    name: db-credentials
    key: password
```

Gebruik de External Secrets Operator of vergelijkbaar om secrets buiten Git te houden. Een `values.yaml` met een wachtwoord erin is een datalek in wording.

### 3. Zet altijd resource requests en limits in je chart

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

Charts zonder resourcedefinities zijn niet productiewaardig. Kubernetes-clusters zonder resources op pods zijn een aanslag op stabiliteit en kosten.

### 4. Versie je chart los van je applicatie

```yaml
# Chart.yaml
apiVersion: v2
name: mijn-app
version: 2.1.0        # Chart-versie: verandert bij template-wijzigingen
appVersion: 1.4.2     # Applicatie-versie: de versie van je code
```

Een chart-update (nieuwe template, extra configuratie) rechtvaardigt een chart-versie-bump. Dit staat los van de appversie.

### 5. Gebruik `helm lint` in je CI/CD pipeline

```yaml
# Azure DevOps voorbeeld
- task: CmdLine@2
  displayName: 'Helm lint'
  inputs:
    script: |
      helm lint ./helm/mijn-app \
        --values ./helm/mijn-app/values.yaml \
        --strict
```

`--strict` behandelt waarschuwingen als fouten. Bouw dit in als verplichte stap voor iedere pull request.

## Helm en GitOps: hoe verhoudt dat zich?

Helm en GitOps (Flux of Argo CD) vullen elkaar aan. Je hebt twee opties:

**Optie A: Helm in CI/CD pipeline**
De CI/CD pipeline roept `helm upgrade` aan. Snel te implementeren, maar de pipeline heeft cluster-toegang nodig en de clusterstatus is niet automatisch te herleiden uit Git.

**Optie B: Helm via GitOps (aanbevolen)**
Je commit een `HelmRelease`-object naar Git. Flux of Argo CD pikt dit op en beheert de Helm-release in het cluster. De cluster-staat is altijd af te leiden uit Git.

```yaml
# Flux HelmRelease
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mijn-app
  namespace: mijn-app-prod
spec:
  interval: 5m
  chart:
    spec:
      chart: ./helm/mijn-app
      sourceRef:
        kind: GitRepository
        name: mijn-app-repo
  values:
    replicaCount: 5
    image:
      tag: 1.4.2
```

Voor productieomgevingen is optie B de standaard. Het geeft je auditbaarheid, automatische drift-correctie en een duidelijk rollback-mechanisme via Git revert.

## Is Helm veilig?

Een veelgestelde vraag. Helm zelf is neutraal: het is een template-engine en deployment-tool. Of het veilig is hangt af van hoe je het gebruikt.

Aandachtspunten:

- Helm heeft schrijfrechten nodig in het cluster. Beperk de service account die Helm gebruikt tot de minimale benodigde rechten.
- Publieke charts van Helm Hub kunnen verouderde of onveilige defaults bevatten. Controleer altijd de `values.yaml` van een externe chart voordat je hem installeert.
- Schakel `--atomic` in op productie-deployments: bij een mislukte upgrade wordt automatisch teruggedraaid.

```bash
helm upgrade --install mijn-app ./helm/mijn-app \
  --namespace mijn-app-prod \
  --values ./helm/mijn-app/values-prod.yaml \
  --atomic \
  --timeout 5m
```

## Wanneer gebruik je Helm niet?

Helm is niet altijd de beste keuze:

- **Eenvoudige statische configuratie**: als je twee of drie YAML-bestanden hebt die nooit veranderen per omgeving, is Helm overkill. Kustomize of gewone `kubectl apply` volstaat.
- **Sterk gedifferentieerde omgevingen**: als productie en staging zoveel van elkaar afwijken dat je bijna twee losse charts hebt, overweeg dan of de abstractie nog waarde toevoegt.
- **Prototype of experiment**: voor een kortlevende test is de overhead van een chart niet waard.

Gebruik Helm als je meer dan twee omgevingen hebt, meerdere teams dezelfde applicatie deployen, of als je releasebeheer en rollback nodig hebt.

## Conclusie

Helm lost een concreet probleem op: het beheren van Kubernetes-configuratie over meerdere omgevingen en releases heen. De leercurve is laag, de opbrengst is hoog.

Begin met een gegenereerde chart via `helm create`, gebruik `helm template` en `helm lint` intensief, en combineer Helm met GitOps zodra je in productie gaat. Houd je values-bestanden schoon van secrets en zorg altijd voor expliciete resource-definities.

**Helm is geen zilverkogel, maar het is wel de standaard manier waarop Kubernetes-applicaties worden verpakt en gedeeld — en daar is een goede reden voor.**

### Volgende stappen

- **Nog niet bezig met Kubernetes?** Start bij {% include smart-link.html slug="waarom-kubernetes" text="Van Docker tot Kubernetes" fallback="Van Docker tot Kubernetes" %}
- **Werken met AKS?** Lees {% include smart-link.html slug="getting-started-aks" text="Snel aan de slag met AKS" fallback="Snel aan de slag met AKS" %}
- **Wil je GitOps begrijpen?** Bekijk de [Flux documentatie](https://fluxcd.io/docs/) of de [Argo CD getting started guide](https://argo-cd.readthedocs.io/en/stable/getting_started/)

---

*Jean-Paul van Houten-Bos is DevOps Engineer en werkt dagelijks met Helm, Flux en AKS bij enterprise-organisaties in Nederland.*

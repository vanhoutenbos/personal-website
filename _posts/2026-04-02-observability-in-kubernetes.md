---
title: "Observability in Kubernetes: Prometheus, Grafana en de drie pijlers"
date: 2026-04-02 06:00:00 +0200
categories: [Kubernetes, Monitoring]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "Hoe weet je wat er in je Kubernetes-cluster gebeurt? Dit artikel legt de drie pijlers van observability uit en laat zien hoe je Prometheus, Grafana en gestructureerde logging praktisch inzet."
image: /assets/img/post-default.svg
image_alt: "Observability en monitoring in Kubernetes met Prometheus en Grafana"
tags: [Kubernetes, Observability, Prometheus, Grafana, Monitoring, OpenTelemetry, Loki, DevOps]
series: "Kubernetes Top-Down"
series_order: 8
series_path: "observability-monitoring"
lang: nl
---

# Observability in Kubernetes: Prometheus, Grafana en de drie pijlers

Je cluster draait. Je applicatie is gedeployd. En dan gaat er iets mis. Pods herstarten zonder duidelijke reden. Gebruikers melden dat het traag is. Iemand in de Slack-channel vraagt: "Is het bij jullie ook zo?"

Op dat moment heb je observability nodig. Niet als nice-to-have, maar als het enige wat het verschil maakt tussen een uur debuggen en een dag raden.

Dit artikel legt uit wat observability is, hoe je het opbouwt in Kubernetes en welke tools de standaard zijn geworden.

## Monitoring versus observability: het verschil

De termen worden door elkaar gebruikt, maar ze betekenen iets anders.

**Monitoring** is het controleren van bekende grootheden. Je meet CPU-gebruik, geheugen, reactietijden. Je stelt drempelwaarden in en krijgt een alert als die worden overschreden. Monitoring beantwoordt de vraag: "Is er een probleem?"

**Observability** is de eigenschap van een systeem waarmee je de interne toestand kunt afleiden uit externe signalen. Het beantwoordt de vraag: "Waarom is er een probleem?" — ook als je dat probleem van tevoren niet had kunnen voorspellen.

In de praktijk heb je beide nodig. Monitoring voor bekende faalscenarios, observability voor de onverwachte.

## De drie pijlers

Observability rust op drie typen data, elk met een andere rol.

### Pijler 1: Metrics

Metrics zijn numerieke tijdreeksen. Ze meten iets meetbaars over tijd: het aantal requests per seconde, het CPU-gebruik van een pod, de latentie van een database-query.

Metrics zijn compact en efficient. Je kunt ze lang bewaren en er trends op bouwen. Ze zijn ideaal voor dashboards en alerts.

**Prometheus** is de standaard voor metrics in Kubernetes. Het werkt via een "scrape"-model: Prometheus haalt op vaste intervallen metrics op bij applicaties via een HTTP-endpoint (`/metrics`). Applicaties exporteren hun metrics in een tekstformaat dat Prometheus begrijpt.

Een voorbeeld van een Prometheus-metrics-endpoint:

```
# HELP http_requests_total Totaal aantal HTTP-requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 4521
http_requests_total{method="POST",status="201"} 183
http_requests_total{method="GET",status="500"} 12
```

Kubernetes zelf exporteert ook metrics via de kube-state-metrics component en de metrics-server. Daarmee krijg je pod-status, deployment-status, node-gebruik en meer.

### Pijler 2: Logs

Logs zijn tekstuele records van gebeurtenissen. Ze vertellen wat er is gebeurd en wanneer. Logs zijn het meest vertrouwde debugmiddel — `kubectl logs <pod>` is waarschijnlijk een van de eerste commando's die je leerde.

Maar losse pod-logs zijn niet genoeg voor productie. Als een pod crasht en opnieuw start, zijn de logs van de vorige instantie weg. Als je tien pods van dezelfde applicatie hebt, wil je niet tien keer apart kijken.

**Loki** (van Grafana Labs) is de standaard geworden voor log-aggregatie in Kubernetes-omgevingen die al Prometheus en Grafana gebruiken. Loki werkt als "Prometheus voor logs": het indexeert alleen labels (namespace, pod, container), niet de logtekst zelf, wat het compact en betaalbaar houdt.

Structureer je logs als JSON. Dat maakt ze doorzoekbaar en parsebaar:

```json
{
  "timestamp": "2026-04-02T08:23:41Z",
  "level": "error",
  "service": "payments-api",
  "trace_id": "4bf92f3577b34da6",
  "message": "Database connection timeout na 5 pogingen",
  "duration_ms": 5032,
  "host": "payments-api-7d9f8b-xk2p1"
}
```

Platte tekst zoals `ERROR: connection failed` is moeilijk te filteren en te correleren. JSON-logs laten je filteren op `level=error`, groeperen op `service`, en koppelen aan een specifieke request via `trace_id`.

### Pijler 3: Traces

Traces volgen een request door je systeem, van de eerste inkomende HTTP-call tot de laatste database-query. Ze laten zien welke services er betrokken waren, hoe lang elke stap duurde en waar de vertraging of fout zat.

In een microservices-architectuur is dit onmisbaar. Als een request langzaam is, weet je dankzij tracing of het aan de API gateway ligt, aan de autenticatieservice, aan de database of aan een externe API-call.

**OpenTelemetry** is de standaard voor het instrumenteren van applicaties voor tracing (en ook voor metrics en logs). Het is vendor-neutraal: je instrumenteert eenmalig en stuurt de data naar Jaeger, Grafana Tempo, Azure Monitor of een andere backend.

Een eenvoudige OpenTelemetry-setup in een Node.js-applicatie:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector:4318/v1/traces',
  }),
  serviceName: 'payments-api',
});

sdk.start();
```

Na deze setup verschijnt elke inkomende request automatisch als een trace, inclusief HTTP-details en eventuele fouten.

## De Prometheus + Grafana + Loki stack

De meest gebruikte open-source observability-stack in Kubernetes-land bestaat uit:

- **Prometheus** — metrics-opslag en scraping
- **Grafana** — visualisatie voor metrics, logs en traces
- **Loki** — log-aggregatie
- **Grafana Tempo** (optioneel) — trace-opslag
- **OpenTelemetry Collector** — centrale inzameling en doorsturen van telemetrie

Je installeert de hele stack via de `kube-prometheus-stack` Helm chart. Dit is veruit de makkelijkste manier om snel up and running te zijn:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring-values.yaml
```

De chart installeert Prometheus, Grafana, Alertmanager en een reeks kant-en-klare dashboards en alertregels voor Kubernetes.

Na installatie bereik je Grafana via port-forwarding:

```bash
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 -n monitoring
```

Surf naar `http://localhost:3000` en log in met de standaardgebruiker `admin`. Je ziet direct dashboards voor node-gebruik, pod-status, deployments en meer.

## Alerts instellen

Prometheus ondersteunt alertregels via `PrometheusRule`-objecten:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: payments-api-alerts
  namespace: payments-prod
  labels:
    release: kube-prometheus-stack
spec:
  groups:
  - name: payments-api
    rules:
    - alert: HighErrorRate
      expr: |
        rate(http_requests_total{status=~"5..",service="payments-api"}[5m])
        /
        rate(http_requests_total{service="payments-api"}[5m])
        > 0.05
      for: 2m
      labels:
        severity: warning
        team: payments
      annotations:
        summary: "Hoog foutpercentage op payments-api"
        description: "Meer dan 5% van de requests geeft een 5xx-fout gedurende 2 minuten."
    - alert: PodCrashLooping
      expr: |
        rate(kube_pod_container_status_restarts_total{namespace="payments-prod"}[15m]) > 0
      for: 5m
      labels:
        severity: critical
        team: payments
      annotations:
        summary: "Pod is aan het crashloopen"
        description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} herstart continu."
```

Alertmanager stuurt deze alerts door naar Slack, PagerDuty, e-mail of een ander kanaal:

```yaml
# Alertmanager config (vereenvoudigd)
route:
  receiver: slack-payments
  routes:
  - matchers:
    - team = payments
    receiver: slack-payments

receivers:
- name: slack-payments
  slack_configs:
  - channel: '#alerts-payments'
    api_url: 'https://hooks.slack.com/services/...'
    title: '[{{ .Status | toUpper }}] {{ .CommonAnnotations.summary }}'
    text: '{{ .CommonAnnotations.description }}'
```

## SLO's: van alerts naar gebruikersgericht denken

Een veel gemaakte fout is het instellen van te veel alerts op technische grootheden: CPU boven 80%, memory boven 70%, pods herstarten. Dit leidt tot alert-moeheid — iedereen negeert de alerts omdat ze te vaak afgaan zonder dat er iets echt kapot is.

De betere aanpak is **Service Level Objectives (SLO's)**: meetbare beloftes over de ervaring van gebruikers.

Voorbeelden:

- "99.5% van de requests naar de payments-API slaagt binnen 500ms" (availability + latency)
- "99% van de checkout-flows wordt voltooid zonder fout" (success rate)

Alerts gaan dan af als je op weg bent een SLO te missen, niet als een technische drempelwaarde wordt overschreden. Dit dwingt je nadenken over wat er echt toe doet vanuit gebruikersperspectief.

## Praktische stappen om te beginnen

Als je nu nog weinig observability hebt, is dit de volgorde die het meeste oplevert:

**Stap 1: Installeer de kube-prometheus-stack**
Je hebt binnen een uur basis-dashboards voor je hele cluster. Gratis, open source, goed gedocumenteerd.

**Stap 2: Voeg applicatie-metrics toe**
Exporteer vanuit je applicaties een `/metrics`-endpoint. De meeste frameworks hebben een Prometheus-bibliotheek:
- Node.js: `prom-client`
- .NET: `prometheus-net`
- Python: `prometheus_client`
- Go: `prometheus/client_golang`

**Stap 3: Structureer je logs als JSON**
Verander de logformatter in je applicaties. Dit kost weinig moeite en maakt logs doorzoekbaar.

**Stap 4: Stel SLO-gebaseerde alerts in**
Begin met twee of drie SLO's voor je belangrijkste services. Stel alerts in op foutbudget-burn, niet op ruwe drempelwaarden.

**Stap 5: Voeg tracing toe met OpenTelemetry**
Dit is de grootste investering, maar geeft het meeste inzicht in complexe microservices-problemen.

## Azure Monitor als alternatief voor AKS

Als je AKS gebruikt en niet de volledige open-source stack wilt beheren, is **Azure Monitor Container Insights** een goed alternatief. Het is ingebouwd in AKS, ondersteunt log-queries via Kusto (KQL) en integreert met Azure Alerts.

```bash
az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons monitoring \
  --workspace-resource-id /subscriptions/.../workspaces/myLogAnalytics
```

Het nadeel: vendor-lock-in en beperktere flexibiliteit dan de open-source stack. Het voordeel: weinig beheer en native integratie met de rest van Azure.

Mijn aanbeveling: gebruik Azure Monitor Container Insights als basislijn, en voeg Prometheus en Grafana toe voor applicatie-specifieke metrics en dashboards. De twee stacks zijn complementair.

## Conclusie

Observability is geen luxe. Het is de enige manier om te begrijpen wat er in een Kubernetes-omgeving gebeurt als het misgaat — en nog liever daarvoor.

Begin met metrics via Prometheus en Grafana, structureer je logs als JSON, en voeg tracing toe zodra je microservices-complexiteit groeit. Stel alerts in op basis van SLO's, niet op ruwe technische drempelwaarden.

**Een cluster zonder observability is een cluster dat je bestuurt met gesloten ogen. Je rijdt misschien prima, totdat je dat niet meer doet.**

### Volgende stappen

- **Cluster-governance op orde brengen?** Lees de post over {% include smart-link.html slug="managed-kubernetes-shared-responsibility" text="Managed Kubernetes en Shared Responsibility" fallback="Managed Kubernetes en Shared Responsibility" %}
- **Prometheus + Grafana installeren:** [kube-prometheus-stack Helm chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
- **Applicaties instrumenteren:** [OpenTelemetry Getting Started](https://opentelemetry.io/docs/getting-started/)
- **SLO's begrijpen:** [Google SRE Workbook — SLO hoofdstuk](https://sre.google/workbook/implementing-slos/)

---

*Jean-Paul van Houten-Bos werkt als DevOps Engineer bij CZ, waar observability met OpenTelemetry, Prometheus en Grafana een kernonderdeel is van de cloud-native migratieaanpak.*

---
title: "Managed Kubernetes (KaaS): Wat lost het wél en niet voor je op?"
date: 2026-06-16 06:00:00 +0200
categories: [Kubernetes, Governance]
layout: single
permalink: /blog/:year/:month/:day/:title.html
description: "AKS, EKS of GKE draaien geeft je een beheerde control plane — maar niet een beheerd platform. Ontdek wat shared responsibility echt betekent, de 8 governance bouwblokken die je zelf moet bouwen, en een checklist voor productierijpheid."
image: /assets/img/post-default.svg
image_alt: "Managed Kubernetes Shared Responsibility"
tags: [Kubernetes, AKS, Managed, Governance, Compliance, Platform Engineering]
series: "Kubernetes Top-Down"
series_order: 9
series_path: "managed-kubernetes-shared-responsibility"
lang: nl
---

# Managed Kubernetes (KaaS): Wat lost het wél en niet voor je op?

**De meest gevaarlijke zin in Kubernetes-land:** *"Wij draaien managed Kubernetes, dus dat regelt zich vanzelf."*

Je hebt een AKS-, EKS- of GKE-cluster live staan. De control plane werkt. Pods starten. Maar drie maanden later heb je een beveiligingsincident, onverklaarbare kosten of een compliance-audit die vastloopt. Hoe?

Omdat **managed Kubernetes een beheerde control plane geeft — geen beheerd platform.** Dit onderscheid klinkt subtiel, maar heeft grote gevolgen voor je team, je architectuur en je risicoprofiel.

## Wat is "shared responsibility" precies?

Bij on-premises Kubernetes ben jij verantwoordelijk voor alles: hardware, OS, etcd, API server, netwerk en workloads. Bij managed Kubernetes (AKS/EKS/GKE) neemt de cloudprovider een deel over — maar lang niet alles.

Vergelijk het met een beheerd kantoorpand: de verhuurder zorgt voor het gebouw, de lift en de verwarming. Maar jij regelt wie er naar binnen mag, hoe de kantoorinrichting eruitziet, wat er in de kluizen ligt en wie welke kamer in mag. Als iemand je server steelt omdat je de deur niet op slot deed, wijst de verhuurder je naar de kleine lettertjes.

| Domein | Provider (AKS/EKS/GKE) | Jij / Je team |
|--------|------------------------|---------------|
| Control plane uptime | ✅ Ja | Monitor consumer workloads |
| API upgrades & versie lifecycle | ✅ Ja (gedeeltelijk keuze timing) | Test compatibiliteit & plan updates |
| Node OS patching | ✅ Ja (managed node pools) | Custom images / DaemonSet hardening |
| Netwerk plugin basis | ✅ Ja | Network policies, segmentatie |
| Security baselines | ⚠️ Beperkte defaults | RBAC model, PSS, image scanning, secrets rotatie |
| Autoscaling infra | ⚠️ Optioneel | Resource requests/limits, HPA/KEDA tuning |
| Observability pipeline | ❌ Niet volledig | Metrics, tracing, log retention, SLO's |
| Backup & restore workloads | ❌ Nee | Strategie, tooling (Velero, etc.) |
| Cost governance | ❌ Nee | Budgets, quota, rightsizing |
| Multi-tenancy boundaries | ❌ Nee | Namespace model, isolatiebeleid |

De harde waarheid: de onderkant van deze tabel — alles met ❌ — is precies waar de meeste incidenten en audits op vastlopen.

## Waarom "managed" verwarrend is

De naam "Kubernetes as a Service" wekt de indruk dat je een kant-en-klare service afneemt, zoals Gmail of Slack. Dat klopt voor de control plane, maar niet voor je platform.

## De 8 governance bouwblokken die jij moet bouwen

1. Namespaces + labelconventies

Namespaces zijn je eerste isolatielaag. Maar een chaos van willekeurig benoemde namespaces maakt kostenallocatie, auditlogging en toegangscontrole onmogelijk.

```yaml
# Conventie: <team>-<omgeving>
namespace: payments-prod
namespace: payments-staging
namespace: platform-tooling

apiVersion: v1
kind: Namespace
metadata:
  name: payments-prod
  labels:
    team: payments
    environment: production
    cost-center: "CC-4421"
    owner: "team-payments@bedrijf.nl"
```

Zodra je namespaces en labels strak definieert, kun je policies, quota en rapportage hier direct op laten aansluiten.

2. ResourceQuotas & LimitRanges

Zonder quota kan één team — of één foutieve deployment — je cluster leegtrekken.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: payments-prod-quota
  namespace: payments-prod
spec:
  hard:
    requests.cpu: "8"
    requests.memory: 16Gi
    limits.cpu: "16"
    limits.memory: 32Gi
    pods: "50"
    persistentvolumeclaims: "10"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: payments-prod
spec:
  limits:
  - default:
      cpu: "500m"
      memory: 512Mi
    defaultRequest:
      cpu: "100m"
      memory: 128Mi
    type: Container
```

Deze combinatie voorkomt dat teams zonder expliciete afspraken per ongeluk te veel resources claimen. Het maakt gedrag voorspelbaar en helpt direct bij kostenbeheersing.

3. NetworkPolicies (zero trust intern)

Standaard kan elke pod met elke andere pod communiceren.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: payments-prod
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

Daarna voeg je expliciete allow-regels toe voor wat wel mag. Daarmee dwing je af dat communicatie bewust ontworpen is in plaats van toevallig ontstaan.

4. Pod Security (PSS / OPA / Kyverno)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: payments-prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
```

Voor complexere regels kun je OPA Gatekeeper of Kyverno gebruiken. Daarmee kun je bijvoorbeeld root containers blokkeren, privileged pods weigeren en securitystandaarden afdwingen op schaal.

5. Image scanning

Scannen alleen is niet genoeg; je wilt dat kritieke findings ook echt deployment blokkeren. Zo voorkom je dat kwetsbaarheden stilletjes naar productie doorschuiven.

6. Secrets management

Werk liever met een externe secrets store dan met plaintext in Git of half-versleutelde waarden in manifests. Dat maakt rotatie, audit en toegangsbeheer veel beter beheersbaar. Een andere optie is SealedSecrets.

7. Audit logging

Zorg voor minimaal 90 dagen retentie en alerts op verdachte acties.

Denk daarbij aan kubectl exec in productie, het aanmaken van ClusterRoleBindings en wijzigingen aan Secrets buiten CI/CD. Juist deze signalen zijn vaak de eerste aanwijzing dat er iets misgaat.

8. Backup & restore

Test restores elk kwartaal. Zonder test is je backup waardeloos.

Een backup die je nog nooit hebt teruggezet, is vooral een goed gevoel en geen bewijs van herstelbaarheid. Neem restore-tests daarom op in je vaste operationele ritme.

## Valkuilen

- Managed ≠ geen platform team nodig.
- Geen limits → onvoorspelbare kosten.
- Tool sprawl zonder eigenaarschap.
- Geen exit-strategie.
- Handmatige wijzigingen → configuratiedrift.

Deze valkuilen lijken losstaand, maar versterken elkaar snel. Zonder eigenaarschap en automatisering wordt elk van deze punten uiteindelijk een operationeel probleem.

## Checklist voor productierijpheid

Gebruik dit als go/no-go:

- RBAC-model gedefinieerd.
- ResourceQuotas actief.
- NetworkPolicies enforced.
- Secrets extern opgeslagen.
- Image scanning verplicht.
- Audit logs + retentie.
- Backup + restore getest.

Als hier nog gaten zitten, is het verstandig eerst die basis op orde te brengen. Pas daarna krijgt managed Kubernetes echt zijn waarde als platformfundament.

## Doorgroeipad

Fase 1: Managed Cluster
Fase 2: Governed Cluster
Fase 3: Curated Add-ons
Fase 4: Self-service
Fase 5: Platform as Product

De meeste organisaties zitten in de praktijk ergens tussen fase 1 en 2. Het verschil tussen "we draaien een cluster" en "we hebben een platform" zit precies in de governance-laag.

## Conclusie

Managed Kubernetes is een sterke basis, maar geen compleet platform.

Beheerd cluster + governance = productierijp platform.

Zonder governance heb je een krachtige motor zonder remmen.
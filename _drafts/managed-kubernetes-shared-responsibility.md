---
title: "Managed Kubernetes (KaaS): Shared Responsibility & Governance"
date: 2025-11-07
categories: [Kubernetes, Governance]
tags: [Kubernetes, AKS, Managed, Governance, Compliance, Platform Engineering]
lang: nl
draft: true
excerpt: "Wat lost Managed Kubernetes (KaaS) wel en niet voor je op? Shared responsibility, governance bouwblokken, valkuilen en doorgroeipad naar Platform as a Product."
---

# Managed Kubernetes (KaaS): Shared Responsibility & Governance

## 1. Introductie
Waarom de term "Kubernetes as a Service" verwarrend kan zijn en waarom "Managed Kubernetes" beter past.

## 2. Wat krijg je wél vs niet
| Domein | Provider (AKS/EKS/GKE) | Jij / Team |
|--------|------------------------|-----------|
| Control plane uptime | Ja | Monitor consumer workloads |
| API upgrades / versie lifecycle | Ja (gedeeltelijk keuze timing) | Test compatibiliteit & planning |
| Node OS patching | Ja (managed node pools) | Custom images / DaemonSet hardening |
| Network plugin basis | Ja | Network policies, segmentation |
| Security baselines | Limited defaults | RBAC model, PSP/PSS, image scanning, secrets rotatie |
| Autoscaling infra (cluster autoscaler) | Optioneel | Resource requests/limits, HPA/KEDA tuning |
| Observability pipeline | Niet volledig | Metrics, tracing, log retention, SLO's |
| Backup/restore workloads | Nee | Strategie, tooling (Velero, etc.) |
| Cost governance | Nee | Budgets, quota, rightsizing |
| Multi-tenancy boundaries | Nee | Namespace model, isolation policies |

## 3. Governance bouwblokken (Top 8)
1. Namespaces + labeling conventies
2. ResourceQuotas & LimitRanges
3. NetworkPolicies (zero trust intern)
4. Pod Security (PSS / OPA Gatekeeper / Kyverno)
5. Image provenance & scanning (Trivy, Azure Defender)
6. Secrets & config management (External Secrets / Vault / Key Vault)
7. Audit logging & retention
8. Backup & restore (Velero + test scenario's)

## 4. Compliance integratie
- Mapping naar frameworks: ISO27001, SOC2, NEN7510, GDPR.
- Policy-as-code (OPA/Gatekeeper, Kyverno) voor declaratieve controles.
- Evidence collection (GitOps repos + audit logs + artifact signing).

## 5. Valkuilen & Misverstanden
- "Managed = geen SRE nodig" → Onjuist.
- Geen resource limits → unbounded cost / noisy neighbours.
- Te veel cluster add-ons zonder ownership (tool sprawl).
- Geen exit-strategie (vendor-specifieke features lock-in).

## 6. Praktische vragen (Diagnose)
Beantwoord deze om je volwassenheid te meten:
- Wie is eigenaar van het cluster en wie van de platformlaag?
- Is er een duidelijk namespace en quota model? Gedocumenteerd?
- Worden images gescand vóór productie? Automatisch?
- Hoeveel tijd kost het om een nieuw team/app te onboarden?
- Is er een gedefinieerde backup & restore RPO/RTO test per kwartaal?
- Kun je ongeplande kostenpieken verklaren binnen 24 uur?
- Zijn policies versioned en gereviewd (PRs)?
- Is multi-tenancy bewust ontworpen (netwerk, RBAC, secrets, resource isolation)?

## 7. Checklist voor productierijpheid
- [ ] RBAC model gedocumenteerd (rollen per persona)
- [ ] Namespaces strategy + labels (owner, cost-center)
- [ ] ResourceQuotas per namespace
- [ ] Image scanning pipeline (block bij critical vulns)
- [ ] Secrets in externe store (geen plaintext in Git)
- [ ] Netwerk: default deny + expliciete allow policies
- [ ] Audit log export + minimaal 90 dagen retention
- [ ] Velero backup + kwartaal restore test report
- [ ] HPA/KEDA actief op kritieke workloads
- [ ] SLO's (availability / latency) per top-apps
- [ ] Document exit-strategie (migratie stappen)

## 8. Doorgroeipad naar Platform as a Product
Fasen:
1. Managed Cluster (operationeel)  
2. Governed Cluster (policies, baselines)  
3. Curated Add-ons (GitOps, ingress, cert-manager, logging)  
4. Self-service Interfaces (templates, scaffolding, golden paths)  
5. Productized Platform (metrics, feedback loops, roadmap)  

## 9. Veelgemaakte fouten & hoe herstellen
| Fout | Gevolg | Herstel |
|------|--------|--------|
| Geen duidelijke ownership | Vertraagde beslissingen | Definieer RACI matrix |
| Geen quota/limits | Onvoorspelbare kosten | Implementeer quotas + monitoring |
| Handmatige cluster wijzigingen | Drift, inconsistentie | GitOps enforce (Flux/Argo) |
| Ad-hoc secrets | Lekkage risico | Introduceer central secret store |
| Geen test restore | Schijnveiligheid | Quarterly game day |

## 10. Afsluiting & CTA
Managed Kubernetes versnelt je start maar vervangt geen governance of platformdenken. Leg eerst een solide foundation voor je naar self-service en developer experience investeert.

**Volgende stap:** Lees ook: *Platform as a Product: developer self-service op Kubernetes* (draft) voor de transformatie naar developer enablement.

## 11. Bronnen & Verder Lezen
- CNCF Security Whitepaper
- Azure AKS Best Practices
- OPA Gatekeeper / Kyverno docs
- Trivy / Grype image scanning
- CNCF Platforms Whitepaper (indien beschikbaar)

---

> Vervolgblogs: cost governance, multi-tenancy patterns, GitOps maturity, platform KPIs.

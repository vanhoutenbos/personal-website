---
title: "Platform as a Product: developer self-service op Kubernetes"
date: 2025-10-03
draft: true
categories: [Kubernetes, Platform Engineering]
---

# Platform as a Product: developer self-service op Kubernetes

## Introductie
Wat betekent platform as a product?
- Gebruik je tools als Backstage of Port?
### Waarom dit onderwerp?
Nadat basis Kubernetes (cluster reliability, security baseline, GitOps) staat verschuift de bottleneck naar developer frictie: trage provisioning, veel herhaling, inconsistente pipelines. Platform as a Product (PaaP) pakt dit aan door het platform te behandelen als een intern product met duidelijke doelgroep, waarde-propositie, metrics en roadmap.

### Kernprincipes
- Product thinking (personas: microservice team, data/ETL, event-driven)
- Golden paths i.p.v. losse wiki snippets
- Self-service + guardrails: je voorkomt snowflakes maar houdt keuzevrijheid gecontroleerd
- Observability van platform use (templates, provisioning events, deploy lead time)
- Iteratief ontwikkelen op basis van usage & DX feedback (surveys, interviews)

### Waarde-propositie voorbeelden
- Sneller van idee naar eerste deploy (< 1 dag)
- Consistente security & compliance zonder extra werk voor teams
- Minder context switching (één portal voor templates, docs, metrics)

## Developer self-service portals
- Hoe maak je het developers makkelijk?
Concretiseer met capabilities:
- Template generatie (Backstage Software Templates / Port blueprints / cookiecutter)
- One-click environment provisioning (Namespace + RBAC + NetworkPolicy + quotas)
- Secrets integratie (External Secrets operator / Vault → Kubernetes Secret)
- Standaard CI/CD pipeline (lint, test, scan, build, SBOM, deploy via GitOps PR)
- Runtime exposure: logs, metrics, traces direct koppelbaar aan service entry

### Praktische diagnose vragen
- Hoe lang duurt het nu van repo create tot eerste production deploy? (lead time)
- Welke 5 handmatige stappen voeren teams elke keer uit? Kunnen die geautomatiseerd?
- Waar ontstaan de meeste support tickets? (secrets, networking, policies?)
- Zijn compliance stappen (logging, retention, DPIA) zichtbaar in onboarding?
- Kunnen teams zelf safe rollback / promotion uitvoeren?

### Metrics (Developer Experience)
- Time-to-first-deploy (median)
- Aantal support tickets per 10 services per maand
- Template adoption percentage (golden path vs custom)
- Doorlooptijd provisioning (portal aanvraag → namespace klaar)

## Platform API’s & golden paths
- Wat zijn jouw ervaringen?
Definieer een beperkt aantal ondersteunde delivery patterns:
- HTTP API service (REST/GraphQL) met health, readiness, metrics endpoints
- Async worker pattern (Queue / Topic consumer) met retry / DLQ policy
- Scheduled job pattern (CronJob + idempotentie + retry backoff)
- Event-driven function pattern (KEDA trigger / CloudEvents)

Elke golden path bevat:
- Repo template (README, ADR map, Dockerfile, helm chart of kustomize base)
- Observability init (metrics SDK, tracing config, structured logging formatter)
- Security baseline (non-root, minimal image, resource limits, image scanning badge)
- Deployment manifest + GitOps folder (charts, kustomize overlays, policies)
- Quality gates (unit test min coverage, container scan pass, SAST pass)

### Evaluatievragen
- Wijkt een team af van het path? Is dat innovation of ontbreekt er een path?
- Hoe vaak wordt een template geüpdatet en gecommuniceerd? (changelog)
- Bestaat er versiebeheer op templates (v1, v2) + migratiegids?

## Documentatie & onboarding
- Hoe zorg je voor goede onboarding?
Onboarding checklist (golden path team):
- [ ] Kick-off: scope & out-of-scope van platform gedeeld
- [ ] Persona match: welk golden path is relevant?
- [ ] Repo template gegenereerd via portal / CLI
- [ ] Secrets workflow uitgelegd (naming conventions, rotation)
- [ ] Logging & metrics viewer demo (queries, dashboards)
- [ ] Pipeline run uitgelegd (stages, quality gates, rollback flows)
- [ ] Security baseline & policies (PodSecurity, NetworkPolicy, image scanning)
- [ ] Feedback kanaal (Slack/Teams, issue label, survey cadence)

Onboarding metrics:
- Time-to-first-deploy
- # vragen / tickets in eerste 30 dagen
- Afwijkingen van baseline (welke en waarom)
- Template completeness score (lint tool)

## Veelgemaakte fouten & valkuilen
- Welke fouten zie je vaak?
| Fout | Gevolg | Herstel |
|------|--------|--------|
| Tool sprawl (te veel overlap) | Complexiteit, onderhoudslast | Rationaliseer, maak supported tool matrix |
| Onduidelijke platform scope | Verwarring & verkeerde verwachtingen | Publiceer "What we do / don’t" matrix |
| Over-abstractie te vroeg | Lock-in / beperkte innovatie | Abstraheer pas na usage data & >2 teams behoefte |
| Geen usage metrics | Geen prioritering | Introduceer dashboard (adoption, lead time) |
| Templates zonder versiebeheer | Drift & inconsistentie | Versie taggen + migratie instructies |
| Alleen ticket-gedreven evolutie | Reactief | Proactieve DX survey + roadmap kwartaalreview |

Anti-pattern: features bouwen gebaseerd op aannames in plaats van data → lage adoptie.

### Succes metrics
- Deployment Lead Time (DORA)
- Failed Deployment Recovery Time
- Template adoption %
- Onboarding tijd (median)
- Platform NPS / DX satisfaction score
- MTTR bij incidenten door standaard observability

## Conclusie & verder lezen
- Welke bronnen raad je aan?
Platform as a Product werkt alleen als je het behandelt als een echt product: duidelijke doelgroep, meetbare waarde, continue verbetering. Begin klein: automatiseer het meest repetitieve pad, meet effect, schaal daarna.

Aanbevolen bronnen:
- CNCF platform engineering publicaties
- Backstage docs (Software Templates, TechDocs)
- Humanitec blog (Internal Developer Platforms)
- GitOps maturity modellen (ArgoCD / Flux)
- DORA metrics research (Accelerate)
- Platform Engineering community (Slack / podcasts)

## FAQ
- Wat is het verschil tussen platform en product?
- Hoe meet je platform succes?
 - Hoe voorkom je over-abstractie?
 - Wanneer voeg je een nieuw golden path toe?
 - Hoe bepaal je de roadmap?
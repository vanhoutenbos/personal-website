# Blog Planning Overzicht - Kubernetes Serie

**Gegenereerd op:** 16 oktober 2025  
**Status:** 28 concepten in `_drafts/`

---

## Gepubliceerde Blogs

1. ✅ **Waarom kiezen zoveel developers voor Kubernetes?** (15 okt 2025)
   - Introductie, wanneer wel/niet kiezen, voordelen, valkuilen
   - URL: `/blog/2025/10/15/waarom-kubernetes/`

---

## Aanbevolen Blog Volgorde (Logische Leerpad)

### **Fase 1: Fundamentals & Getting Started** (Beginners)

Deze blogs helpen mensen die nog niet met Kubernetes werken om te beslissen en te starten.

1. 🔲 **Kubernetes kiezen: AKS, ACA, ACI, OpenShift of zelf hosten?** 
   - File: `kubernetes-keuzehulp.md`
   - Doel: Beslisboom voor wie twijfelt tussen platformen
   - Waarom eerst: Direct follow-up op "Waarom Kubernetes" blog

2. 🔲 **Containers draaien zonder gedoe: ACA & ACI uitgelegd**
   - File: `getting-started-aca-aci.md`
   - Doel: Voor wie Kubernetes overkill vindt (simplified alternatieven)
   - Waarom nu: Alternatief pad voor wie na keuzehulp kiest voor ACA/ACI

3. 🔲 **Snel aan de slag met AKS: stap-voor-stap gids**
   - File: `getting-started-aks.md`
   - Doel: Praktische hands-on voor AKS beginners
   - Waarom nu: Voor wie na keuzehulp kiest voor AKS

4. 🔲 **OpenShift on-premise: wanneer en hoe te beginnen**
   - File: `getting-started-openshift-onprem.md`
   - Doel: Enterprise alternatief met on-prem focus
   - Waarom nu: Voor wie na keuzehulp kiest voor OpenShift

---

### **Fase 2: Core Concepts & Daily Operations** (Intermediate)

Essentiële kennis voor dagelijks werk met Kubernetes.

5. 🔲 **Networking in Kubernetes: van basics tot advanced**
   - File: `networking-kubernetes.md`
   - Doel: Services, Ingress, DNS, NetworkPolicies
   - Waarom nu: Fundamenteel begrip voor elke Kubernetes user

6. 🔲 **Security best practices voor Kubernetes**
   - File: `security-best-practices.md`
   - Doel: RBAC, secrets, pod security, image scanning
   - Waarom nu: Security moet van dag 1, niet als afterthought

7. 🔲 **Observability & Monitoring: inzicht in je Kubernetes cluster**
   - File: `observability-monitoring.md`
   - Doel: Prometheus, Grafana, logging, tracing
   - Waarom nu: Je moet kunnen zien wat er gebeurt voordat je verder gaat

8. 🔲 **Resource Management & Efficiency: slim omgaan met capaciteit**
   - File: `resource-management-efficiency.md`
   - Doel: Requests/limits, autoscaling, resource quotas
   - Waarom nu: Kosten en performance in balans

9. 🔲 **Service Discovery: hoe services elkaar vinden**
   - File: `service-discovery.md`
   - Doel: DNS, service mesh, ingress patterns
   - Waarom nu: Cruciale kennis voor microservices architectuur

---

### **Fase 3: Advanced Topics & Specializations** (Advanced)

Diepgaande onderwerpen voor wie verder wil optimaliseren.

10. 🔲 **Infrastructure as Code voor Kubernetes: Terraform, Bicep & Pulumi**
    - File: `infrastructure-as-code.md`
    - Doel: Cluster provisioning as code
    - Waarom nu: Automatisering en reproduceerbaarheid

11. 🔲 **CI/CD & GitOps: modern deployen op Kubernetes**
    - File: `cicd-gitops-advanced.md`
    - Doel: ArgoCD, Flux, GitHub Actions, Azure DevOps
    - Waarom nu: Professionele deployment workflows

12. 🔲 **Helm Best Practices: package management done right**
    - File: `helm-best-practices.md`
    - Doel: Chart structuur, values, templating, troubleshooting
    - Waarom nu: Helm is de standaard voor package management

13. 🔲 **Advanced Networking: service mesh, multi-cluster & meer**
    - File: `networking-advanced.md`
    - Doel: Istio, Linkerd, multi-cluster networking
    - Waarom nu: Voor complexere architecturen

14. 🔲 **Advanced Security: zero-trust, policy enforcement & compliance**
    - File: `security-advanced.md`
    - Doel: OPA/Gatekeeper, Falco, compliance automation
    - Waarom nu: Enterprise-grade security

15. 🔲 **Stateful Workloads: databases en storage op Kubernetes**
    - File: `stateful-workloads.md`
    - Doel: StatefulSets, PersistentVolumes, operators
    - Waarom nu: Voor wie verder gaat dan stateless apps

---

### **Fase 4: Operations & Management** (DevOps/SRE)

Voor wie Kubernetes in productie beheert.

16. 🔲 **Cluster Lifecycle Management: upgrades, patches & migraties**
    - File: `cluster-lifecycle-management.md`
    - Doel: Veilig upgraden, node pool management
    - Waarom nu: Productie-clusters moeten onderhouden worden

17. 🔲 **Kubernetes upgrades & migraties zonder downtime**
    - File: `kubernetes-upgrades-migraties.md`
    - Doel: Blue-green, canary deployments voor clusters
    - Waarom nu: Praktische uitwerking van lifecycle management

18. 🔲 **Kostenbeheer & FinOps voor Kubernetes**
    - File: `kostenbeheer-finops.md`
    - Doel: Cost allocation, chargeback, forecasting
    - Waarom nu: Kosten transparent maken en beheersen

19. 🔲 **Kostenoptimalisatie: spot instances, autoscaling & rightsizing**
    - File: `kostenoptimalisatie.md`
    - Doel: Praktische tips om kosten te verlagen
    - Waarom nu: Concrete acties na kostenbeheer insights

20. 🔲 **K9s, CI/CD, GitOps & Monitoring: je complete toolkit**
    - File: `k9s-cicd-gitops-monitoring.md`
    - Doel: Tool overview en integraties
    - Waarom nu: Efficiency tips voor daily operations

21. 🔲 **Compliance & Governance: auditing, policies & standards**
    - File: `compliance-governance.md`
    - Doel: ISO27001, SOC2, GDPR op Kubernetes
    - Waarom nu: Enterprise requirements

22. 🔲 **Identity & Access Management: beveilig je cluster**
    - File: `identity-access-management.md`
    - Doel: Azure AD integratie, OIDC, RBAC advanced
    - Waarom nu: Fine-grained access control

---

### **Fase 5: Specialized Use Cases** (Niche/Advanced)

Specifieke toepassingen en edge cases.

23. 🔲 **Serverless op Kubernetes: KEDA, Knative & Virtual Kubelet**
    - File: `serverless-op-kubernetes.md`
    - Doel: Event-driven autoscaling, scale-to-zero
    - Waarom nu: Hybride serverless/containers

24. 🔲 **MLOps & AI op Kubernetes: Kubeflow, MLflow & GPU workloads**
    - File: `mlops-ai-kubernetes.md`
    - Doel: Training pipelines, model serving
    - Waarom nu: AI/ML gebruik cases

25. 🔲 **Edge & Hybrid Kubernetes: on-prem, multi-cloud & edge computing**
    - File: `edge-hybrid-kubernetes.md`
    - Doel: Azure Arc, K3s, edge deployments
    - Waarom nu: Distributed computing scenarios

26. 🔲 **Kubernetes API Extensibility: operators, CRDs & webhooks**
    - File: `kubernetes-api-extensibility.md`
    - Doel: Custom resources, operators bouwen
    - Waarom nu: Voor wie Kubernetes wil uitbreiden

27. 🔲 **Platform as a Product: internal developer platforms met Kubernetes**
    - File: `platform-as-a-product.md`
    - Doel: Backstage, self-service portals, golden paths
    - Waarom nu: Platform engineering mindset

---

### **Fase 6: Career & Certification** (Professional Development)

Voor wie certificering of carrière-advies zoekt.

28. 🔲 **CNCF Certificeringen: CKA, CKAD, CKS - welke past bij jou?**
    - File: `cncf-certificeringen.md`
    - Doel: Certificering overview en studietips
    - Waarom nu: Career development

---

## Aanbevolen Publicatie Planning

### **Maandelijkse cadans (2 blogs per maand):**

**Maand 1 (Nov 2025):**
- Week 2: Kubernetes keuzehulp
- Week 4: Containers zonder gedoe (ACA/ACI)

**Maand 2 (Dec 2025):**
- Week 2: Snel aan de slag met AKS
- Week 4: Networking basics

**Maand 3 (Jan 2026):**
- Week 2: Security best practices
- Week 4: Observability & Monitoring

**Maand 4 (Feb 2026):**
- Week 2: Resource Management
- Week 4: Service Discovery

**Enzovoort...**

---

## Content Clusters voor SEO

### **Cluster 1: Getting Started**
- Waarom Kubernetes (gepubliceerd)
- Keuzehulp
- ACA/ACI
- AKS Getting Started
- OpenShift Getting Started

### **Cluster 2: Networking & Connectivity**
- Networking basics/advanced
- Service Discovery
- Advanced networking (service mesh)

### **Cluster 3: Security & Compliance**
- Security best practices
- Security advanced
- Identity & Access Management
- Compliance & Governance

### **Cluster 4: Operations & Cost**
- Observability
- Resource Management
- Kostenbeheer
- Kostenoptimalisatie
- Cluster Lifecycle

### **Cluster 5: Automation & CI/CD**
- Infrastructure as Code
- CI/CD & GitOps
- Helm Best Practices
- K9s & Tooling

### **Cluster 6: Specialized**
- Stateful Workloads
- Serverless
- MLOps/AI
- Edge/Hybrid
- API Extensibility
- Platform as a Product

---

## Quick Wins (Makkelijk te schrijven eerst)

Deze blogs hebben overlap met je eerdere ervaring en zijn relatief snel te schrijven:

1. **Kubernetes keuzehulp** → Uitbreiding van "Waarom Kubernetes" met beslisboom
2. **Security best practices** → Veel standaard kennis, makkelijk te structureren
3. **Kostenbeheer** → Je hebt al concreet voorbeeld (voetbal event)
4. **K9s & Tooling** → Praktische tool tips, makkelijk te demonstreren

---

## Internal Linking Strategie

Wanneer je nieuwe blogs publiceert, voeg links toe aan:

- **"Waarom Kubernetes" blog** → Link naar keuzehulp, AKS getting started, ACA/ACI
- **Keuzehulp blog** → Link naar alle getting started guides
- **Security blog** → Link naar advanced security, compliance, IAM
- **Networking blog** → Link naar service discovery, advanced networking

Dit verbetert SEO en houdt lezers langer op je site.

---

## Notities

- Alle drafts hebben nog maar placeholders/outlines
- Focus eerst op **Fase 1** (getting started) voor brede doelgroep
- **Fase 2** (core concepts) is het meest waardevol voor dagelijks werk
- **Fase 3-6** zijn voor niche audiences en kunnen lager geprioriteerd

**Tip:** Overweeg polls op LinkedIn om te vragen welk onderwerp je community het meest interessant vindt!

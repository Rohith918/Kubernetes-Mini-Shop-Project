# 🛒 MiniShop — Cloud-Native Kubernetes Architecture

[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28+-326CE5?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)

MiniShop is a microservices-based e-commerce platform built to demonstrate enterprise-grade Kubernetes orchestration, declarative configuration management, zero-trust network security, and automated horizontal scaling.

---

## 🏛 Architecture Overview

```
                            [ Public Internet ]
                                     │
                                     ▼
                        [ NGINX Ingress Controller ]
                            (minishop.local)
                                     │
                 ┌───────────────────┴───────────────────┐
                 │ /api/*                                │ /
                 ▼                                        ▼
      [ backend-service:3000 ]               [ frontend-service:80 ]
                 │                                        │
        ┌────────┴────────┐                               ▼
        │                 │                    [ React + Nginx Pods ]
        ▼                 ▼
[ Node.js API Pods ]   [ Redis Cache ]
   (Managed by HPA)
        │
        ├────────────┐
        │            │
        ▼            ▼
[ PostgreSQL DB ]  [ Python Worker CronJob ]
 (StatefulSet)       (Scheduled Jobs)
```

### Key Technical Features

* **Stateful Persistence:** PostgreSQL deployed via `StatefulSet` with `volumeClaimTemplates` to guarantee persistent volume binding and stable pod identities.
* **Declarative Schema Migrations:** One-off `Job` primitives executing non-destructive database migrations prior to backend initialization.
* **Auto-Scaling & Health Probes:** Express.js backend configured with `Liveness` and `Readiness` probes alongside a `HorizontalPodAutoscaler` (HPA) targeting 50% CPU utilization.
* **Reverse Proxy Integration:** Single Page React application served via Nginx with embedded `/api` location rules for seamless cross-origin request proxying.
* **Zero-Trust Network Hardening:** Layer 3/4 `NetworkPolicy` restricting ingress to PostgreSQL exclusively to authorized API pods.
* **Async Background Processing:** Python-based `CronJob` executing scheduled analytical aggregation queries against PostgreSQL.
* **Multi-Environment Orchestration:** Native Kustomize base and overlay manifests separating `dev` and `prod` configurations.

---

## 📁 Repository Structure

```text
minishop/
├── backend/                   # Express.js REST API
├── frontend/                  # React + Vite UI with Nginx Dockerfile
├── worker/                    # Python analytics background worker
├── db/                        # Database initialization and migration scripts
└── k8s/                       # Kubernetes Manifests
    ├── dev/                   # Kustomize Development Overlay
    │   ├── kustomization.yaml
    │   ├── namespace.yaml
    │   ├── postgres/          # ConfigMap, Secret, PVC, StatefulSet, Service
    │   ├── redis/             # Deployment, Service
    │   ├── backend/           # ConfigMap, Secret, Deployment, Service, HPA, ServiceAccount
    │   ├── frontend/          # ConfigMap, Deployment, Service
    │   ├── worker/            # CronJob
    │   ├── jobs/              # Schema Migration Job
    │   ├── ingress/           # Ingress routing rules
    │   ├── rbac/              # Role, RoleBinding
    │   └── network-policy/    # Zero-Trust Postgres access policy
    └── prod/                  # Kustomize Production Overlay
        └── kustomization.yaml
```

---

## 🛠 Tech Stack

* **Orchestration:** Kubernetes, Kustomize
* **Frontend:** React, Vite, Tailwind CSS, Nginx
* **Backend:** Node.js, Express.js
* **Database & Caching:** PostgreSQL 15, Redis
* **Scheduled Tasks:** Python 3.11, psycopg2
* **Ingress & Security:** NGINX Ingress Controller, Kubernetes NetworkPolicy

---

## 🚀 Quick Start Guide

### Prerequisites

* Docker Desktop / Minikube / Kind
* `kubectl` CLI installed
* NGINX Ingress Controller enabled on your cluster

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/minishop.git
cd minishop
```

### Step 2: Build Container Images

If using Minikube, point your terminal to the cluster's Docker daemon first:

```bash
eval $(minikube docker-env)
```

Build application container images locally:

```bash
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend
docker build -t worker:latest ./worker
```

*(If using Kind, load images manually: `kind load docker-image backend:latest frontend:latest worker:latest`)*

### Step 3: Deploy the Stack

Deploy all components into the `minishop-dev` namespace using Kustomize:

```bash
kubectl apply -k k8s/dev
```

### Step 4: Verify Deployment

Watch the pods initialize until all are `Running` or `Completed`:

```bash
kubectl get pods -n minishop-dev -w
```

Verify service endpoints and autoscalers:

```bash
kubectl get svc,hpa,ingress -n minishop-dev
```

### Step 5: Configure Local Ingress Host

Map `minishop.local` to your cluster IP in `/etc/hosts`:

```bash
sudo nano /etc/hosts
```

Add the following entry:

```
127.0.0.1 minishop.local
```

*(Replace `127.0.0.1` with the Minikube IP if using Minikube.)*

Flush local DNS cache (macOS):

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Step 6: Access the Application

* **Frontend UI:** Open `http://minishop.local/` in your browser.
* **API Healthcheck:** `http://minishop.local/api/health`
* **API Products Endpoint:** `http://minishop.local/api/products`

---

## 🧪 Testing Autoscaling & Network Policies

### Testing HPA (CPU Load Stress)

Simulate a CPU-heavy workload on the backend API:

```bash
curl http://minishop.local/api/stress
```

Observe the Horizontal Pod Autoscaler scaling up backend replicas:

```bash
kubectl get hpa backend-hpa -n minishop-dev -w
```

### Verifying Zero-Trust Network Policy

Test Allowed Connection (Backend → Database):

```bash
kubectl exec -it deployment/backend -n minishop-dev -- nc -zv postgres-service 5432
# Result: Connection open
```

Test Denied Connection (Frontend → Database):

```bash
kubectl exec -it deployment/frontend -n minishop-dev -- nc -zv -w 3 postgres-service 5432
# Result: Connection timed out (Dropped by NetworkPolicy)
```

---

## 📄 License

This project is open-source and available under the MIT License.
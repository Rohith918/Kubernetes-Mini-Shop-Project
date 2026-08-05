# MiniShop Architecture

## Components

- **frontend** — React (Vite) SPA. Talks to backend via `VITE_API_URL`.
- **backend** — Node.js/Express API. Reads/writes Postgres, caches product
  list in Redis for 30s.
- **worker** — Python script that queries Postgres and prints a summary
  report. Intended to run as a recurring job.
- **db** — PostgreSQL. Seeded via `db/init.sql`.
- **redis** — off-the-shelf `redis:7-alpine`, no custom image needed.

## Request flow

```

```

## Notes for K8s mapping (fill in as you build)

- frontend: Deployment + Service (ClusterIP) + Ingress
- backend: Deployment + Service + ConfigMap (non-secret env) + Secret (DB
  password) + liveness/readiness probes hitting `/health`
- db: StatefulSet + headless Service + PVC + init container running
  `init.sql`
- redis: Deployment + Service
- worker: CronJob
- migrations: one-off Job

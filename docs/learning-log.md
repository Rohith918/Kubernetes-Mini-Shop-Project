# Learning Log

Track which K8s concept each step/commit covers. Example format:

- [ ] Deployment + Service for backend — `___`
- [ ] Deployment + Service for frontend — `___`
- [ ] Ingress routing `/` to frontend and `/api` to backend — `___`
- [ ] ConfigMap for non-secret backend env vars — `___`
- [ ] Secret for DB password — `___`
- [ ] StatefulSet + PVC for Postgres — `___`
- [ ] Init container to run `db/init.sql` — `___`
- [ ] Liveness/readiness probes on backend `/health` — `___`
- [ ] HPA scaling backend on `/stress` load — `___`
- [ ] CronJob for `worker/worker.py` — `___`
- [ ] One-off Job for `db/migrations/001_create_products.sql` — `___`
- [ ] Namespaces: `dev` vs `prod` — `___`
- [ ] ServiceAccount + RBAC for backend — `___`
- [ ] NetworkPolicy restricting frontend from reaching Postgres directly — `___`

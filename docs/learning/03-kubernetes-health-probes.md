# 03 — Kubernetes Health Probes

## Objective

Configure liveness and readiness probes for the Nimbus API and test how Kubernetes responds to a readiness failure.

## 1. Liveness Probe

Endpoint: `/health/live`

- Checks whether the application responds to an HTTP request.
- Configured with an initial delay of 5 seconds and a 10-second period.
- Repeated probe failures can cause Kubernetes to restart the container.

## 2. Readiness Probe

Endpoint: `/health/ready`

- Determines whether a Pod is ready to receive normal Service traffic.
- Configured with an initial delay of 3 seconds and a 5-second period.
- A failed readiness probe removes the Pod from eligible Service endpoints.
- Readiness failure alone does not restart the container.

## 3. Controlled Readiness Failure

Added the `SIMULATE_NOT_READY` environment variable to the application.

When set to `true`, `/health/ready` returns HTTP 503 Service Unavailable.

Applied the variable to the Deployment:

```bash
kubectl --context kind-nimbus set env deployment/nimbus-api SIMULATE_NOT_READY=true
```

Observed:

- Three old Pods remained available.
- One new Pod was created but remained unready.
- The Deployment had 3 desired replicas, 4 total Pods, 3 available replicas, and 1 unavailable replica.
- The rollout eventually reported `ProgressDeadlineExceeded`.
- The Service continued to have three endpoints corresponding to the old ready Pods.

This demonstrated how readiness checks can protect traffic during an unsuccessful rollout.

## 4. Recovery

Removed the failure variable:

```bash
kubectl --context kind-nimbus set env deployment/nimbus-api SIMULATE_NOT_READY-
kubectl --context kind-nimbus rollout status deployment/nimbus-api --timeout=180s
```

Verified:

- Deployment: 3/3 available
- Pods: 3/3 Running and Ready
- Service: three endpoints
- Healthy Pods: zero restarts

## 5. Key Learnings

- Readiness and liveness serve different purposes.
- A running container is not necessarily a ready Pod.
- A Deployment rollout can stall when new Pods fail readiness checks.
- `ProgressDeadlineExceeded` reports stalled progress; it does not automatically roll back the Deployment.
- Removing the simulated failure allowed the rollout to recover.

## Outcome

Successfully configured both probes, simulated a readiness failure, observed rollout behavior, and restored the Deployment.

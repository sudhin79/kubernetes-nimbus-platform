# 02 — Kubernetes Deployment, Service, and Self-Healing

## Objective

Deploy the Nimbus API on Kubernetes, expose it through a Service, scale it to three replicas, and verify Kubernetes self-healing by deliberately deleting a Pod.

## 1. Deployment and Replicas

Created a Kubernetes Deployment named `nimbus-api` with three replicas.

The Deployment defines the desired state of the application. Kubernetes continuously works to maintain that state, ensuring that three application Pods are available.

Verified the Deployment using:

```bash
kubectl --context kind-nimbus get deployment nimbus-api
```

Expected result: `3/3` replicas ready.

## 2. Kubernetes Service

Created a `ClusterIP` Service named `nimbus-api` to provide a stable network endpoint for the application.

The Service uses the label selector `app: nimbus-api` to identify the application Pods.

Traffic is routed from Service port `80` to container port `3000`, where the Node.js application listens.

Verified the Service and its endpoints using:

```bash
kubectl --context kind-nimbus get service nimbus-api
kubectl --context kind-nimbus get endpoints nimbus-api
```

The Service initially registered one Pod endpoint. After scaling the Deployment, it registered three Pod endpoints.

## 3. Scaling the Application

Updated the Deployment's desired replica count from one to three.

After applying the updated manifest, Kubernetes created two additional Pods. All three Pods reached the `Running` state and became ready.

This demonstrated declarative scaling: instead of manually creating individual Pods, I updated the desired state and allowed Kubernetes to reconcile the workload.

## 4. Self-Healing Experiment

To test self-healing, I deliberately deleted one of the three application Pods.

The deleted Pod was not recreated with the same identity. Instead, the ReplicaSet controller detected that the number of existing Pods was below the desired count and created a replacement.

The replacement Pod received a new name and IP address. Once it became ready, the Service's endpoint list reflected the current application Pods.

Verified the recovery using:

```bash
kubectl --context kind-nimbus get deployment nimbus-api
kubectl --context kind-nimbus get pods -l app=nimbus-api
kubectl --context kind-nimbus get endpoints nimbus-api
```

The Deployment returned to three ready replicas.

## 5. Key Learnings

- A Deployment manages application rollouts and the desired state of its ReplicaSets.
- A ReplicaSet controller maintains the required number of matching Pods.
- Pods are replaceable resources; their names and IP addresses can change.
- A Service provides a stable endpoint and routes traffic to Pods matching its selector.
- Service endpoints are updated as eligible Pods change.
- Kubernetes self-healing is based on controllers reconciling the actual state with the declared desired state.

## Outcome

Successfully deployed the Nimbus API on a local Kind cluster, scaled it to three replicas, exposed it through a ClusterIP Service, and demonstrated automatic replacement of a deleted Pod.

This experiment established the foundation for the next stage: adding health probes and improving application reliability.

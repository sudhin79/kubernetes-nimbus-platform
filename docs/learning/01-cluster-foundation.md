# 01 — Kubernetes Cluster Foundation

## Objective

Create an isolated local Kubernetes environment for Project Nimbus
using Kind on Ubuntu.

## Environment

- Operating system: Ubuntu
- Docker Engine: 29.1.3
- kubectl: v1.36.0
- Kind: v0.24.0
- Kubernetes node image: kindest/node:v1.31.0
- Cluster name: nimbus
- Kubernetes context: kind-nimbus

## Architecture

Kind runs Kubernetes nodes as Docker containers.

The nimbus-control-plane Docker container hosts a Kubernetes node.
The Kubernetes control plane includes:

- API server: exposes the Kubernetes API.
- etcd: stores Kubernetes cluster state.
- Scheduler: selects suitable nodes for Pods.
- Controller manager: runs controllers that reconcile desired state.

Other components include CoreDNS for cluster DNS, kube-proxy for
Service networking, Kind networking, and local-path storage.

## Verification

Commands executed:

    kind get clusters
    kubectl config current-context
    kubectl --context kind-nimbus get nodes -o wide
    kubectl --context kind-nimbus get pods -A
    docker ps --filter "name=nimbus-control-plane"

## Observed Results

- The nimbus cluster was created successfully.
- The nimbus-control-plane node reported Ready.
- All nine listed system Pods reported Running and Ready.
- The existing sudhin-k8s cluster was preserved.
- The Docker container hosting the Nimbus node was running.

## Lessons Learned

A Kind node is a Docker container that provides the environment
for a Kubernetes node. Application Pods are managed inside the
Kubernetes cluster and are not equivalent to the Kind node container.

A kubectl context determines which cluster and credentials kubectl
uses. Explicitly specifying --context helps avoid operating on the
wrong cluster.

The output format flag must be written as -o wide, not -o -wide.

## Next Steps

- Inspect the control-plane components.
- Deploy the first application.
- Understand Deployments, ReplicaSets, Pods, and Services.

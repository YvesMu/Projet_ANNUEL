#!/bin/bash

echo "🔁 Re-deploying PostgreSQL (no image rebuild needed)..."
kubectl delete -f k8s/deployments/postgres-deployment.yaml
kubectl apply -f k8s/deployments/postgres-deployment.yaml

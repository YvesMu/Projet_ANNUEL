#!/bin/bash

echo "🔁 Rebuild frontend Docker image..."
docker build -t frontend:latest ./frontend || exit 1

echo "🚀 Re-deploying frontend..."
kubectl delete -f k8s/deployments/frontend-deployment.yaml
kubectl apply -f k8s/deployments/frontend-deployment.yaml

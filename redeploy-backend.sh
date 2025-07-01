#!/bin/bash

echo "🔁 Rebuild backend Docker image..."
docker build -t backend:latest ./backend || exit 1

echo "🚀 Re-deploying backend..."
kubectl delete -f k8s/deployments/backend-deployment.yaml
kubectl apply -f k8s/deployments/backend-deployment.yaml

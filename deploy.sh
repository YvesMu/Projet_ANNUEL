#!/bin/bash

echo "Applying secrets..."
kubectl apply -f k8s/secrets/secrets.yaml

echo "Creating volumes..."
kubectl apply -f k8s/volumes/postgres-pvc.yaml

echo "Deploying services..."
kubectl apply -f k8s/services/

echo "Deploying applications..."
kubectl apply -f k8s/deployments/

echo "Setting up ingress..."
kubectl apply -f k8s/ingress/ingress.yaml

echo "✅ All resources applied!"

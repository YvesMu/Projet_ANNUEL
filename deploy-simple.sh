#!/bin/bash

echo "🚀 Déploiement simple..."

# 1. npm install backend
echo "📦 Installation Backend..."
cd backend && npm install && cd ..

# 2. npm install frontend  
echo "📦 Installation Frontend..."
cd frontend && npm install && cd ..

# 3. Docker build
echo "🐳 Build Docker images..."
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend

# 4. Apply Kubernetes
echo "☸️ Déploiement Kubernetes..."
kubectl apply -f k8s/volumes/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/configmap/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/

echo "✅ Terminé !"
echo "Frontend: http://localhost:31000"
echo "Backend: http://localhost:32000"

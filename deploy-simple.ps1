# Déploiement simple
Write-Host "🚀 Déploiement simple..." -ForegroundColor Green

# 1. npm install backend
Write-Host "📦 Installation Backend..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# 2. npm install frontend  
Write-Host "📦 Installation Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# 3. Docker build
Write-Host "🐳 Build Docker images..." -ForegroundColor Cyan
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend

# 4. Apply Kubernetes
Write-Host "☸️ Déploiement Kubernetes..." -ForegroundColor Blue
kubectl apply -f k8s/volumes/
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/configmap/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/

Write-Host "✅ Terminé !" -ForegroundColor Green
Write-Host "Frontend: http://localhost:31000" -ForegroundColor White
Write-Host "Backend: http://localhost:32000" -ForegroundColor White

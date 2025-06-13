Write-Host "🔄 Rebuild frontend image and restart deployment..."
docker build -t frontend:latest ./frontend
kubectl rollout restart deployment frontend

Write-Host "✅ Frontend redeployed."

Write-Host "🔄 Rebuild backend image and restart deployment..."
docker build -t backend:latest ./backend
kubectl rollout restart deployment backend

Write-Host "✅ Backend redeployed."

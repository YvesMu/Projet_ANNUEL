Write-Host "Applying secrets..."
kubectl apply -f k8s/secrets/secrets.yaml

Write-Host "Creating volumes..."
kubectl apply -f k8s/volumes/postgres-pvc.yaml

Write-Host "Deploying services..."
kubectl apply -f k8s/services/

Write-Host "Deploying applications..."
kubectl apply -f k8s/deployments/

Write-Host "Setting up ingress..."
kubectl apply -f k8s/ingress/ingress.yaml

Write-Host "All resources applied!"

Write-Host "Applying secrets..."
kubectl apply -f k8s/secrets/secrets.yaml --validate=false

Write-Host "Creating volumes..."
kubectl apply -f k8s/volumes/postgres-pvc.yaml --validate=false

Write-Host "Deploying services..."
kubectl apply -f k8s/services/ --validate=false

Write-Host "Deploying applications..."
kubectl apply -f k8s/deployments/ --validate=false

Write-Host "Setting up ingress..."
kubectl apply -f k8s/ingress/ingress.yaml --validate=false

Write-Host "All resources applied!"

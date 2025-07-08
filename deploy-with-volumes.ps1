# Déployer le volume persistant pour les uploads
kubectl apply -f k8s/volumes/uploads-pvc.yaml

# Attendre que le PVC soit créé
Write-Host "Attente de la création du PVC..."
kubectl wait --for=condition=Bound pvc/uploads-pvc --timeout=60s

# Déployer les autres ressources
kubectl apply -f k8s/volumes/postgres-pvc.yaml
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/configmap/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress/

Write-Host "Déploiement terminé !"
Write-Host "Backend accessible sur: http://localhost:32000"
Write-Host "Frontend accessible sur: http://localhost:31000"

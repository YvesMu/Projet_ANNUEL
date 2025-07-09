# 🎯 Projet Annuel - Plateforme de Recrutement (Professionnel / Particulier)

## 📋 Table des Matières

1. [Partie I - Projet Annuel](#partie-i---projet-annuel)
2. [Partie II - Clusterisation de Container](#partie-ii---clusterisation-de-container)

---

## 👨‍💻 Auteurs

* **OUAHABI Ibrahim** — [GitHub: Narutino10](https://github.com/Narutino10)
* **MU Yves** — [GitHub: YvesMu](https://github.com/YvesMu)

---

# Partie I - Projet Annuel

## ⚙️ Technologies utilisées

* **Backend** : NestJS (TypeScript, JWT, TypeORM, PostgreSQL, Mailer)
* **Frontend** : Next.js (React, TypeScript)
* **Base de données** : PostgreSQL (via Docker / Kubernetes)
* **Authentification** : JWT (Inscription avec confirmation par email)
* **Gestion des rôles** : Professionnel et Particulier
* **Mailer** : SMTP (Gmail) pour les mails de confirmation et de notification
* **Vidéo & Chat** : API Daily.co
* **Calendrier** : React Big Calendar
* **Déploiement local** : Docker & Kubernetes (clusterisation, secrets, volumes)

---

## Ὠ0 Fonctionnalités en place

### 🔐 Authentification & Sécurité

* ✅ Inscription utilisateur (Particulier & Professionnel)
* ✅ Confirmation d'email à l'inscription (via Gmail SMTP)
* ✅ Connexion sécurisée via JWT
* ✅ Middleware & Guards d’autorisation basés sur les rôles

### 💼 Gestion des Offres (Professionnel)

* ✅ Création, modification et suppression d’offres
* ✅ Liste des offres créées avec visualisation des candidatures

### 📄 Candidature (Particulier)

* ✅ Visualisation et candidature à toutes les offres
* ✅ Suivi de ses candidatures depuis le dashboard
* ✅ Statut dynamique : En attente, Entretien, Retenue, Accepté, Refusé

### 👥 Gestion des Candidatures (Professionnel)

* ✅ Liste des candidatures reçues
* ✅ Modification des statuts avec mise à jour visuelle
* ✅ Visualisation complète des infos candidat
* ✅ Upload de CV et photo (support intégré)

### ✉️ Mails Automatisés

* ✅ Confirmation d’inscription
* ✅ Notification de changement de statut de candidature
* ✅ Notification et rappel automatique des appels visio
* ✅ URL dynamique personnalisée (ex : `http://localhost:31000/confirm-account?...`)

### 📹 Visio

* ✅ Appel visio intégré avec Daily.co
* ✅ Chat intégré pendant la visio
* ✅ Emails de rappel 5 min avant la visio
* ✅ Planification depuis un calendrier interactif
* ✅ Filtrage et accès aux visios planifiées

---

## 📦 Prérequis

* Node.js >= 18
* NPM >= 9
* Docker (pour PostgreSQL)
* Kubernetes local (minikube / docker-desktop)
* Gmail avec mot de passe d’application

---

## 🛠 Installation

### 1️⃣ Cloner le projet

```bash
git clone <lien-du-repo>
cd Projet_ANNUEL
```

### 2️⃣ Lancer PostgreSQL avec Docker (développement simple)

```bash
cd backend
docker-compose up -d
```

### 3️⃣ Configurer le fichier `.env` dans le backend

```env
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=jobplatform

JWT_SECRET=monSuperSecretUltraLong
JWT_EXPIRES_IN=86400s

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tonemail@gmail.com
MAIL_PASSWORD=mot_de_passe_app
MAIL_FROM=Projet Annuel <tonemail@gmail.com>

DAILY_API_KEY=xxxxxxxxxxx
```

### 4️⃣ Installer les dépendances Backend

```bash
npm install
```

### 5️⃣ Lancer le serveur Backend

```bash
npm run start:dev
```

---

## 💻 Frontend (Next.js)

### 6️⃣ Aller dans le dossier frontend

```bash
cd ../frontend
```

### 7️⃣ Installer les dépendances

```bash
npm install
```

### 8️⃣ Lancer le serveur Frontend

```bash
npm run dev
```

---

## 🔗 Interfaces accessibles

* **Frontend** : [http://localhost:3000](http://localhost:3000) ou [http://localhost:31000](http://localhost:31000) (Kubernetes)
* **Backend API** : [http://localhost:5000](http://localhost:5000)

---

## ☸️ Déploiement Kubernetes local (Minikube / Docker Desktop)

### 🔐 Secrets (env sécurisé)

Créer un fichier `secrets.yaml` (non versionné) dans `k8s/secrets/` puis l’appliquer :

```bash
kubectl apply -f k8s/secrets/secrets.yaml
```

Ajoutez `k8s/secrets/secrets.yaml` dans votre `.gitignore` ! ✅

### 🧱 Build des images locales

```bash
docker build -t backend:latest ./backend
docker build -t frontend:latest ./frontend
```

### 🚀 Scripts de redéploiement rapide (PowerShell)

Exemples de scripts PowerShell à la racine :

```powershell
# redeploy-backend.ps1
kubectl rollout restart deployment/backend
```

```powershell
# redeploy-frontend.ps1
kubectl rollout restart deployment/frontend
```

```powershell
# redeploy-postgres.ps1
kubectl rollout restart deployment/postgres
```

Puis à lancer depuis PowerShell :

```powershell
./redeploy-backend.ps1
```

---

## 🔮 Fonctionnalités prévues

* ⏳ Sauvegarde d’offres en favoris
* ⏳ Messagerie privée entre utilisateur et recruteur
* ⏳ Pagination + recherche avancée
* ⏳ Tableau de bord Admin

---

## 📝 Notes

* Pour entrer dans PostgreSQL :

```bash
docker exec -it <container_postgres> psql -U postgres -d jobplatform
```

* Sécurité gérée par **Guards NestJS** selon les rôles.

---

## 📬 Contact

Pour toute question, contactez directement [Ibrahim](https://github.com/Narutino10) ou [Yves](https://github.com/YvesMu).

---

## 📂 Structure du Projet

```
Projet_ANNUEL/
├── backend/                    # API NestJS
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Interface Next.js
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── k8s/                       # Manifests Kubernetes
│   ├── deployments/
│   ├── services/
│   ├── ingress/
│   ├── secrets/
│   └── volumes/
├── docker-compose.yml         # Développement local
└── deploy-*.ps1              # Scripts de déploiement
```

## 🔄 Étapes de Déploiement Kubernetes

### 1. Prérequis

```powershell
# Vérifier que le cluster est actif
kubectl get nodes

# Créer le namespace
kubectl create namespace jobplatform
```

### 2. Déploiement des Secrets

```powershell
kubectl apply -f k8s/secrets/secrets.yaml
```

### 3. Déploiement des Volumes

```powershell
kubectl apply -f k8s/volumes/
```

### 4. Déploiement des Services

```powershell
kubectl apply -f k8s/services/
kubectl apply -f k8s/deployments/
```

### 5. Configuration Ingress

```powershell
kubectl apply -f k8s/ingress/
```

### 6. Vérification

```powershell
# Vérifier les pods
kubectl get pods -n jobplatform

# Vérifier les services
kubectl get svc -n jobplatform

# Suivre les logs
kubectl logs -f deployment/backend -n jobplatform
```

## 🧪 Tests de Haute Disponibilité

### Test de Résilience

```powershell
# Simuler la panne d'un pod
kubectl delete pod -l app=backend -n jobplatform

# Vérifier la récupération automatique
kubectl get pods -n jobplatform -w
```

### Test de Montée en Charge

```powershell
# Augmenter le nombre de réplicas
kubectl scale deployment backend --replicas=5 -n jobplatform

# Vérifier la scalabilité
kubectl get pods -n jobplatform
```

## 📊 Monitoring

### Commandes Utiles

```powershell
# Statut général
kubectl get all -n jobplatform

# Utilisation des ressources
kubectl top pods -n jobplatform

# Événements
kubectl get events -n jobplatform --sort-by=.metadata.creationTimestamp
```

## 🔧 Dépannage

### Problèmes Courants

1. **Pods en état Pending** : Vérifier les ressources disponibles
2. **Erreurs de connexion DB** : Contrôler les secrets et la configuration
3. **Ingress non accessible** : Vérifier la configuration DNS/hosts

### Logs Utiles

```powershell
# Logs d'un deployment
kubectl logs deployment/backend -n jobplatform

# Logs d'un pod spécifique
kubectl logs <pod-name> -n jobplatform

# Décrire un pod en erreur
kubectl describe pod <pod-name> -n jobplatform
```

# Partie II - Clusterisation de Container

## 🎯 Contexte & Objectif

Cette partie du projet consiste à transposer l'application développée dans la Partie I vers une architecture conteneurisée et orchestrée, en utilisant Kubernetes pour assurer :

- **Haute disponibilité** (réplicas, load balancing, scaling horizontal)
- **Sécurité** (secrets, HTTPS)
- **Persistance** (volumes pour la DB, etc.)
- **Documentation** et manifests (scripts, YAML, etc.)

## 📋 Exigences Minimales (Obligatoires)

### 🔧 Cluster

- **Kubernetes** (k3s, k8s, ou Cloud type GKE/AKS/EKS)
- **Configuration** : 1 master + 2 workers minimum
- **Local** (Workstation, VirtualBox, Proxmox) ou VPS

### 🚀 Déploiement de l'application

1. **Services conteneurisés** : Frontend et Backend (chacun un Deployment/Service)
2. **Base de données** conteneurisée liée via Service ou DNS interne
3. **Manifests** YAML organisés dans des namespaces
4. **Réplicas** : Backend (2 minimum), Frontend (3 minimum), Base de données (1)

### 💾 Persistance des données

- **Volumes** : BDD et fichiers uploadés survivent aux redéploiements
- **Kubernetes** : Usage de PersistentVolume/PersistentVolumeClaim
- **Résistance** : Redémarrage automatique sans perte de données

### 🔐 Sécurité

- **Secrets** : Kubernetes Secret pour mots de passe et clés sensibles
- **ConfigMaps** : Variables de configuration moins sensibles
- **HTTPS** : Certificat auto-signé ou Let's Encrypt via Ingress/Load Balancer

### 🌐 Exposition et Mise en Réseau

- **Load Balancer/Ingress** : Traefik ou NGINX pour accès externe
- **DNS** : Configuration pour `app.local` ou nom de domaine

### 📚 Documentation & Scripts

- **Tutoriel** : Installation complète (cluster, déploiement)
- **Captures d'écran** : Tests de scalabilité, kill pod, etc.
- **Scripts** : Automatisation des déploiements

## 🌟 Bonus (jusqu'à +5 points)

1. **Resource Requests & Limits** + QoS : Régulation CPU/RAM
2. **Node Affinity / Taints & Tolerations** : Contraintes de déploiement
3. **NetworkPolicy** : Restriction communication réseau
4. **Rolling Update / Canary** : Déploiement progressif
5. **Autoscaling horizontal** (HPA)
6. **CI/CD** : Pipeline GitHub Actions/GitLab CI
7. **Rollback automatique** : En cas d'échec
8. **Helm Charts** : Paramétrage de la stack
9. **Backup/Restoration** : Velero ou scripts
10. **Scalabilité automatique** : Scripts avancés

## 📊 Barème (15 + 5 bonus)

| Critères | Points |
|----------|---------|
| Cluster (1 master + 2 workers) | 2 |
| Déploiement (front, back, BDD conteneurisés) | 5 |
| Persistance (volumes, DB survive) | 2 |
| Sécurité (secrets, HTTPS) | 2 |
| Exposition (LB/Ingress, DNS/hosts) | 2 |
| Documentation & scripts | 2 |
| **Total** | **15** |
| **Bonus** | **+5 max** |

## 🎯 Livrables

- **Dépôt Git** : Code, Dockerfiles, YAML, scripts
- **Documentation** : Schéma d'architecture, étapes d'installation
- **Captures** : Démonstration réplication, tolérance aux pannes
- **Rapport** : Bonus implémentés et justification

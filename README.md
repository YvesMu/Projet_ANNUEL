# Projet Annuel - Plateforme de Recrutement (Professionnel / Particulier)

---

## ⚙️ Technologies utilisées

* **Backend** : NestJS (TypeScript, JWT, TypeORM, PostgreSQL, Mailer)
* **Frontend** : Next.js (React, TypeScript)
* **Base de données** : PostgreSQL (via Docker)
* **Authentification** : JWT (Inscription avec confirmation par email)
* **Gestion des rôles** : Professionnel et Particulier
* **Mailer** : SMTP (Gmail) pour les mails de confirmation et de changement de statut

---

## 🚀 Fonctionnalités actuellement en place

### Authentification & Sécurité

* ✅ Inscription utilisateur (Particulier & Professionnel)
* ✅ Confirmation d'email à l'inscription (avec lien envoyé par mail)
* ✅ Connexion sécurisée via JWT
* ✅ Middleware & Guards d’autorisation basés sur les rôles

### Gestion des Offres (Professionnel)

* ✅ Création d’offres (exclusif aux professionnels)
* ✅ Modification & Suppression des offres créées
* ✅ Liste des offres créées avec accès rapide aux candidatures
* ✅ Gestion des candidatures liées à chaque offre

### Candidature (Particulier)

* ✅ Visualisation de toutes les offres disponibles
* ✅ Postuler à une offre
* ✅ Visualisation de ses propres candidatures depuis le dashboard candidat
* ✅ Statut de candidature affiché (En attente, Entretien, Retenue, Accepté, Refusé)
* ✅ Badge dynamique de statut dans le dashboard candidat

### Gestion des Candidatures (Professionnel)

* ✅ Visualisation de l'ensemble des candidatures reçues
* ✅ Modification du statut des candidatures (avec sélecteur dynamique)
* ✅ Affichage des informations complètes sur chaque candidat
* ✅ Upload de CV et photo (déjà intégrable)

### Mails Automatisés

* ✅ Envoi d'email de confirmation d'inscription
* ✅ Envoi d'email automatique lorsqu’un professionnel change le statut d'une candidature


### Visio 
* ✅ Appelle Visio 
* 🟧 Chat dans Visio

---

## 📦 Prérequis

* Node.js >= 18
* NPM >= 9
* Docker (pour PostgreSQL)

---

## 🛠 Installation

### 1️⃣ Cloner le projet

```bash
git clone <lien-du-repo>
cd Projet_ANNUEL
```

### 2️⃣ Démarrer la base PostgreSQL via Docker

```bash
cd backend
docker-compose up -d
```

### 3️⃣ Configurer le fichier `.env` dans le dossier backend

```bash
PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=jobplatform

JWT_SECRET=monSuperSecretUltraLong
JWT_EXPIRES_IN=3600s

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tonemail@gmail.com
MAIL_PASSWORD=ton_mot_de_passe_application
MAIL_FROM=Projet Annuel <tonemail@gmail.com>
```

⚠ Pour Gmail : utiliser un mot de passe application (sécurité renforcée).

### 4️⃣ Installer les dépendances Backend

```bash
npm install
```

### 5️⃣ Démarrer le Backend en mode développement

```bash
npm run start:dev
```

---

## 💻 Frontend

### 6️⃣ Aller dans le dossier frontend

```bash
cd ../frontend
```

### 7️⃣ Installer les dépendances Frontend

```bash
npm install
```

### 8️⃣ Démarrer le Frontend

```bash
npm run dev
```

---

## 🔗 Accès aux interfaces

* Frontend (Next.js) : [http://localhost:3000](http://localhost:3000)
* Backend API (NestJS) : [http://localhost:5000](http://localhost:5000)

---

## 🔮 Fonctionnalités prévues à venir

* ⏳ Système de favoris (sauvegarde d’offres)
* ⏳ Messagerie entre candidat et recruteur
* ⏳ Pagination sur les offres et candidatures
* ⏳ Tableau de bord admin global (pour la gestion de la plateforme)

---

## 📝 Notes utiles

* En cas de modification lourde de la base :

  ```bash
  docker exec -it <container_postgres> psql -U postgres -d jobplatform
  ```
* Toute la logique de rôle et de sécurité est centralisée dans les **Guards NestJS**.

---

## 👩‍💻 Auteur

Projet développé dans le cadre du Projet Annuel.

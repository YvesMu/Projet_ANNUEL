# Projet Annuel - Plateforme de recrutement (Professionnel / Particulier)

---

## Technologies

* **Backend** : NestJS (TypeScript, JWT, TypeORM, PostgreSQL, Mailer)
* **Frontend** : Next.js (React, TypeScript)
* **Database** : PostgreSQL (via Docker)
* **Authentification** : JWT (Inscription avec confirmation par email)
* **Gestion des rôles** : Professionnel et Particulier

---

## Fonctionnalités principales

* Inscription et connexion des utilisateurs avec rôles
* Confirmation d'email lors de l'inscription
* Création d'offres (réservée aux professionnels)
* Consultation des offres avec filtre et recherche
* Dashboard professionnel pour gérer ses offres
* Middleware d'autorisation (IsProfessionalMiddleware)
* Envoi de mails de confirmation via SMTP (Gmail)

---

## Prérequis

* Node.js >= 18
* NPM >= 9
* Docker (pour la base de données PostgreSQL)

---

## Installation

### 1. Cloner le projet

```bash
git clone <lien-du-repo>
cd Projet_ANNUEL
```

---

## Backend

### 2. Lancer la base PostgreSQL via Docker

```bash
cd backend

docker-compose up -d
```

### 3. Créer ton fichier `.env` dans le dossier `backend`

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

**⚠ Attention** : pour Gmail, utiliser un mot de passe application.

### 4. Installer les dépendances Backend

```bash
npm install
```

### 5. Lancer le backend en mode développement

```bash
npm run start:dev
```

---

## Frontend

### 6. Aller dans le dossier frontend

```bash
cd ../frontend
```

### 7. Installer les dépendances Frontend

```bash
npm install
```

### 8. Lancer le Frontend en mode développement

```bash
npm run dev
```

---

## Accès aux applications

* Frontend : [http://localhost:3000](http://localhost:3000)
* Backend API : [http://localhost:5000](http://localhost:5000)

---

## Fonctionnalités supplémentaires prévues

* ✅ Dashboard admin (Particulier / Professionnel)
* ✅ Gestion des candidatures
* ✅ Notifications email après candidature
* ✅ Filtrage dynamique sur les offres
* ✅ CRUD complet sur les offres (modifier, supprimer, publier, archiver)

---

## Notes

* Pense à bien vider la base via `docker exec -it <container_postgres> psql -U postgres -d jobplatform` en cas de migration importante.
* Le middleware "IsProfessionalMiddleware" sécurise la création d'offres.

---

## Auteur

Projet développé dans le cadre du Projet Annuel.

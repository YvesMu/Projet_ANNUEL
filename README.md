# 🎯 Projet Annuel - Plateforme de Recrutement (Professionnel / Particulier)

---

## 👨‍💻 Auteurs

- **OUAHABI Ibrahim** — [GitHub: Narutino10](https://github.com/Narutino10)
- **MU Yves** — [GitHub: YvesMu](https://github.com/YvesMu)

---

## ⚙️ Technologies utilisées

- **Backend** : NestJS (TypeScript, JWT, TypeORM, PostgreSQL, Mailer)
- **Frontend** : Next.js (React, TypeScript)
- **Base de données** : PostgreSQL (via Docker)
- **Authentification** : JWT (Inscription avec confirmation par email)
- **Gestion des rôles** : Professionnel et Particulier
- **Mailer** : SMTP (Gmail) pour les mails de confirmation et de notification
- **Vidéo & Chat** : API Daily.co
- **Calendrier** : React Big Calendar

---

## 🚀 Fonctionnalités en place

### 🔐 Authentification & Sécurité

- ✅ Inscription utilisateur (Particulier & Professionnel)
- ✅ Confirmation d'email à l'inscription
- ✅ Connexion sécurisée via JWT
- ✅ Middleware & Guards d’autorisation basés sur les rôles

### 💼 Gestion des Offres (Professionnel)

- ✅ Création, modification et suppression d’offres
- ✅ Liste des offres créées avec visualisation des candidatures

### 📄 Candidature (Particulier)

- ✅ Visualisation et candidature à toutes les offres
- ✅ Suivi de ses candidatures depuis le dashboard
- ✅ Statut dynamique : En attente, Entretien, Retenue, Accepté, Refusé

### 👥 Gestion des Candidatures (Professionnel)

- ✅ Liste des candidatures reçues
- ✅ Modification des statuts avec mise à jour visuelle
- ✅ Visualisation complète des infos candidat
- ✅ Upload de CV et photo (support intégré)

### ✉️ Mails Automatisés

- ✅ Confirmation d’inscription
- ✅ Notification de changement de statut de candidature
- ✅ Notification et rappel automatique des appels visio

### 📹 Visio

- ✅ Appel visio intégré avec Daily.co
- ✅ Chat intégré pendant la visio
- ✅ Emails de rappel 5 min avant la visio
- ✅ Planification depuis un calendrier interactif
- ✅ Filtrage et accès aux visios planifiées

---

## 📦 Prérequis

- Node.js >= 18
- NPM >= 9
- Docker (pour PostgreSQL)
- Gmail avec mot de passe d’application

---

## 🛠 Installation

### 1️⃣ Cloner le projet

```bash
git clone <lien-du-repo>
cd Projet_ANNUEL
````

### 2️⃣ Lancer PostgreSQL avec Docker

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
JWT_EXPIRES_IN=3600s

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tonemail@gmail.com
MAIL_PASSWORD=mot_de_passe_app
MAIL_FROM=Projet Annuel <tonemail@gmail.com>
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

* **Frontend** : [http://localhost:3000](http://localhost:3000)
* **Backend API** : [http://localhost:5000](http://localhost:5000)

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


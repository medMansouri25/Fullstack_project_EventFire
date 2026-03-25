# EventFire

Application web full-stack de gestion et réservation d'événements culturels, construite avec la stack **MERN** (MongoDB, Express, React, Node.js).

---

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
- [Configuration Google OAuth](#configuration-google-oauth)
- [Lancer le projet](#lancer-le-projet)
- [Comptes de test](#comptes-de-test)
- [Structure du projet](#structure-du-projet)
- [API Backend](#api-backend)
- [Scripts disponibles](#scripts-disponibles)
- [Auteur](#auteur)

---

## Aperçu du projet

**EventFire** est une plateforme complète permettant de gérer et réserver des événements culturels (concerts, festivals, théâtre, expositions…).

Architecture découplée : backend REST API (Node.js/Express) + frontend React communiquant via Axios, avec MongoDB comme base de données.

---

## Fonctionnalités

### Espace Admin
- Connexion sécurisée (réservée aux emails `@eventfire.fr`)
- Tableau de bord : billets vendus, revenus totaux, taux d'occupation, top 5 événements
- CRUD complet des événements (titre, date, lieu, prix, capacité, image)
- Upload d'images pour les événements

### Espace Client
- Inscription par email/mot de passe ou connexion via **Google OAuth**
- Parcourir et filtrer les événements
- Réserver des places avec sélecteur de quantité et calcul du total
- Consulter et annuler ses réservations depuis "Mes réservations"
- Email de confirmation à chaque réservation (via Nodemailer/Mailtrap)

### Sécurité
- Authentification JWT (2h d'expiration)
- Helmet (headers HTTP sécurisés)
- Rate limiting : 10 tentatives auth / 15 min, 200 req API / 15 min
- Sanitisation NoSQL (protection injection MongoDB)
- CORS restreint au domaine frontend

---

## Stack technique

| Couche          | Technologie                     | Version   |
|-----------------|---------------------------------|-----------|
| Runtime         | Node.js                         | >= 18     |
| Backend         | Express.js                      | ^5.2.1    |
| Base de données | MongoDB (via Mongoose)          | ^9.3.0    |
| Auth            | JWT + Google OAuth 2.0          | —         |
| Chiffrement     | bcryptjs                        | ^3.0.3    |
| Email           | Nodemailer (Mailtrap)           | ^8.0.3    |
| Upload images   | Multer                          | ^2.1.1    |
| Sécurité        | Helmet, express-rate-limit      | —         |
| Frontend        | React + Vite                    | ^19 / ^7  |
| Routing         | React Router DOM                | ^7.13.1   |
| HTTP client     | Axios                           | ^1.13.6   |
| Container DB    | Docker                          | —         |

---

## Prérequis

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour MongoDB)
- Un compte [Google Cloud Console](https://console.cloud.google.com/) (pour Google OAuth)
- Un compte [Mailtrap](https://mailtrap.io/) (pour les emails de confirmation — facultatif en dev)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/medMansouri25/2026_Fullstack_Mansouri_Mohammed.git
cd 2026_Fullstack_Mansouri_Mohammed
```

### 2. Installer les dépendances

```bash
# Backend
cd EventFire/backend
npm install

# Frontend (nouveau terminal)
cd EventFire/frontend
npm install
```

---

## Configuration des variables d'environnement

### Backend — `EventFire/backend/.env`

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
MONGO_URI=mongodb://localhost:27017/eventFire

# JWT
JWT_SECRET=votre_secret_jwt_long_et_aleatoire
JWT_EXPIRES_IN=2h

# Google OAuth (https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend (CORS)
FRONTEND_URL=http://localhost:5173

# Email — Mailtrap (https://mailtrap.io/) — facultatif
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=votre_user_mailtrap
SMTP_PASS=votre_pass_mailtrap

# Compte admin (optionnel pour tester — par défaut : admin@eventfire.fr / admin123)
ADMIN_EMAIL=admin@eventfire.fr
ADMIN_PASSWORD=admin123
```

### Frontend — `EventFire/frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=votre_google_client_id
```

> **Important :** Ne commitez jamais les fichiers `.env`. Ils sont listés dans `.gitignore`.

---

## Configuration Google OAuth

Pour que la connexion Google fonctionne, il faut créer des identifiants sur Google Cloud Console :

1. Aller sur [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Créer un nouveau projet (ou en sélectionner un existant)
3. Menu **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Type d'application : **Web application**
5. Ajouter dans **Authorized JavaScript origins** :
   ```
   http://localhost:5173
   ```
6. Ajouter dans **Authorized redirect URIs** :
   ```
   http://localhost:3000/api/auth/google/callback
   ```
7. Copier le **Client ID** et le **Client Secret** dans vos fichiers `.env`

---

## Lancer le projet

### Option A — Lancement automatique (Windows)

Double-cliquer sur **`start.bat`** à la racine du projet. Il démarre MongoDB (Docker), le backend et le frontend automatiquement.

### Option B — Lancement manuel

**1. Démarrer MongoDB via Docker**

```bash
docker start mongodb
# Si le conteneur n'existe pas encore :
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**2. Lancer le backend**

```bash
cd EventFire/backend
npm run dev
```

Le backend démarre sur **http://localhost:3000**. Au premier démarrage, le seed s'exécute automatiquement :
- Création du compte admin (`admin@eventfire.fr` / `admin123`)
- Insertion de 10 événements de démonstration (si la collection est vide)

**3. Lancer le frontend** (nouveau terminal)

```bash
cd EventFire/frontend
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

---

## Comptes de test

| Rôle   | Email                | Mot de passe | Accès                          |
|--------|----------------------|--------------|--------------------------------|
| Admin  | `admin@eventfire.fr` | `admin123`   | Dashboard, gestion événements  |
| Client | S'inscrire via `/register` ou Google OAuth | — | Réservations |

> **Règle admin :** seuls les emails `@eventfire.fr` peuvent se connecter en tant qu'administrateur. Google OAuth est réservé aux clients.

---

## Structure du projet

```
2026_Fullstack_Mansouri_Mohammed/
├── docker-compose.yml              # MongoDB via Docker Compose
├── start.bat                       # Lancement automatique (Windows)
├── README.md
└── EventFire/
    ├── backend/
    │   ├── uploads/                # Images uploadées
    │   └── src/
    │       ├── server.js           # Point d'entrée — connectDB + seedAdmin + listen
    │       ├── app.js              # Express : middlewares, routes, error handler
    │       ├── config/
    │       │   ├── db.js           # Connexion MongoDB (Mongoose)
    │       │   └── passport.js     # Stratégie Google OAuth (Passport.js)
    │       ├── controllers/
    │       │   ├── authController.js        # login, register, googleLogin
    │       │   ├── eventController.js       # CRUD événements
    │       │   ├── reservationController.js # Réservation, annulation
    │       │   └── statsController.js       # Statistiques dashboard
    │       ├── middleware/
    │       │   ├── authMiddleware.js        # Vérifie le JWT
    │       │   ├── adminMiddleware.js       # Vérifie le rôle admin
    │       │   └── security.js             # Helmet, rate-limit, sanitize
    │       ├── models/
    │       │   ├── User.js                 # Schéma utilisateur
    │       │   ├── Event.js                # Schéma événement
    │       │   └── Reservation.js          # Schéma réservation
    │       ├── routes/
    │       │   ├── authRoutes.js
    │       │   ├── eventRoutes.js
    │       │   ├── reservationRoutes.js
    │       │   ├── statsRoutes.js
    │       │   └── uploadRoutes.js
    │       └── utils/
    │           ├── seedAdmin.js    # Seed admin + événements de démo au démarrage
    │           └── mailer.js       # Email de confirmation (Nodemailer)
    └── frontend/
        └── src/
            ├── main.jsx
            ├── App.jsx             # Routes React Router
            ├── context/
            │   └── AuthContext.jsx # Contexte global auth (token, user, isAdmin)
            ├── components/
            │   ├── Navbar.jsx
            │   ├── EventCard.jsx
            │   ├── ProtectedRoute.jsx
            │   └── ui/             # Icônes SVG, ImageUploader, CalendarPicker
            ├── pages/
            │   ├── Home.jsx            # Liste des événements (public)
            │   ├── EventDetails.jsx    # Détail + réservation (public)
            │   ├── Login.jsx           # Connexion admin / client
            │   ├── Register.jsx        # Inscription client
            │   ├── MesReservations.jsx # Espace client — historique réservations
            │   ├── Dashboard.jsx       # Tableau de bord admin
            │   ├── AdminEvents.jsx     # Gestion événements (admin)
            │   └── EventForm.jsx       # Formulaire création/édition événement
            └── services/           # Appels API Axios (authService, eventService…)
```

---

## API Backend

### Authentification — `/api/auth`

| Méthode | Endpoint           | Auth | Description                     |
|---------|--------------------|------|---------------------------------|
| POST    | `/login`           | —    | Connexion email/mot de passe    |
| POST    | `/register`        | —    | Inscription visiteur            |
| POST    | `/google`          | —    | Connexion via Google (ID token) |
| GET     | `/google/redirect` | —    | Redirect OAuth Google           |
| GET     | `/google/callback` | —    | Callback OAuth Google           |

### Événements — `/api/events`

| Méthode | Endpoint  | Auth  | Description               |
|---------|-----------|-------|---------------------------|
| GET     | `/`       | —     | Liste tous les événements |
| GET     | `/:id`    | —     | Détail d'un événement     |
| POST    | `/`       | Admin | Créer un événement        |
| PUT     | `/:id`    | Admin | Modifier un événement     |
| DELETE  | `/:id`    | Admin | Supprimer un événement    |

### Réservations — `/api/reservations`

| Méthode | Endpoint  | Auth     | Description                          |
|---------|-----------|----------|--------------------------------------|
| POST    | `/`       | Visiteur | Créer / incrémenter une réservation  |
| GET     | `/me`     | Visiteur | Mes réservations                     |
| DELETE  | `/:id`    | Visiteur | Annuler une réservation              |

### Statistiques — `/api/stats`

| Méthode | Endpoint | Auth  | Description                        |
|---------|----------|-------|------------------------------------|
| GET     | `/`      | Admin | Statistiques globales du dashboard |

### Upload — `/api/upload`

| Méthode | Endpoint | Auth  | Description            |
|---------|----------|-------|------------------------|
| POST    | `/`      | Admin | Upload image événement |

---

## Scripts disponibles

### Backend

| Commande             | Description                                        |
|----------------------|----------------------------------------------------|
| `npm run dev`        | Serveur avec nodemon (hot-reload)                  |
| `npm start`          | Serveur en mode production                         |
| `npm run seed`       | Insère les événements de démo (si collection vide) |
| `npm run seed:reset` | Force la réinsertion des événements de démo        |

### Frontend

| Commande          | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Serveur de développement Vite     |
| `npm run build`   | Build de production               |
| `npm run preview` | Prévisualise le build en local    |

---

## Auteur

**Mohammed Mansouri** — Projet Full Stack 4A 2025/2026

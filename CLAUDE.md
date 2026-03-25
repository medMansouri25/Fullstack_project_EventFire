# EventFire — CLAUDE.md

> Document de référence du projet pour les sessions de développement assisté par IA.
> Illustre une démarche de **Spec-Driven Development** : chaque fonctionnalité a été
> spécifiée avant d'être implémentée, en s'appuyant sur le contrat de projet, les
> maquettes Figma et les releases progressives définies en amont.

---

## 1. Contexte du projet

**EventFire** est une plateforme web fullstack de gestion et de réservation d'événements culturels (concerts, festivals, opéras, théâtre, expositions, cinéma).

- **Cadre :** Projet fullstack encadré, évalué en plusieurs releases progressives
- **Dépôt GitHub :** versioning sur `main`, commits sémantiques (`feat:`, `docs:`, `fix:`)

### Catégories d'utilisateurs

| Rôle | Accès |
|------|-------|
| **Visiteur non authentifié** | Consultation, recherche et filtrage d'événements |
| **Utilisateur enregistré** | + Réservation de places, gestion de ses réservations |
| **Administrateur** | + Dashboard, CRUD événements, statistiques plateforme |

---

## 2. Démarche Spec-Driven Development

### 2.1 Documents de spécification produits en amont

Avant toute ligne de code, les documents suivants ont structuré le développement :

1. **Contrat de projet dans documentation** (`Contrat_projet_Mansouri_Mohammed.pdf`) — formalise les attendus minimaux, les technologies choisies, et les 3 releases avancées planifiées.
2. **Maquettes Figma AI dans documentation** (`Projet dev full stack Mansouri Mohammed.pdf`) — wireframes complets de toutes les pages : accueil, détail événement, tableau de bord admin, formulaires création/modification.
3. **Architecture technique définie avant implémentation** — stack MERN, structure de fichiers backend/frontend, modèles de données, routes API.

### 2.2 Releases définies dans le contrat, implémentées dans l'ordre

#### Release de base (R1)
- [x] Consultation publique de la liste des événements
- [x] Détail d'un événement (titre, description, date, lieu, image)
- [x] Authentification admin (JWT + routes protégées backend)
- [x] CRUD événements côté admin (création, modification, suppression)

#### Release Avancée 1 (R2)
- [x] Recherche par mot-clé (titre, description, ville, salle, organisateur)
- [x] Filtrage par catégorie (Musical / Culturel) et par type (Concert, Opéra, etc.)
- [x] Dashboard statistiques admin avec Recharts : revenus, billets vendus, taux d'occupation, top 5 événements, répartition par catégorie

#### Release Avancée 2 (R3)
- [x] Système de réservation visiteur : création de compte utilisateur
- [x] Réservation de places (sélection de quantité, calcul du prix)
- [x] Confirmation par e-mail (Nodemailer / Mailtrap)
- [x] Annulation de réservation avec restitution des places

#### Release Avancée 3 — Sécurité applicative avancée *(non prévue au contrat)*
- [x] Helmet : headers HTTP sécurisés (HSTS, X-Frame-Options, nosniff, hidePoweredBy)
- [x] Rate-limiting : 10 tentatives auth / 15 min, 200 requêtes API / 15 min
- [x] Protection injection NoSQL avec `express-mongo-sanitize`
- [x] Protection mass-assignment via whitelist `pickAllowed()` dans eventController
- [x] Protection ReDoS : échappement regex sur les champs de recherche
- [x] CORS restreint par whitelist d'origines autorisées
- [x] Limitation taille body (10 Ko) et fichiers images (5 Mo)
- [x] Validation domaine email admin (`@eventfire.fr` obligatoire)
- [x] Blocage Google OAuth pour les comptes admin (sécurité d'élévation de privilèges)
- [x] Unicité email vérifiée avant création de compte

#### Release Avancée 4 — Google OAuth 2.0 + Upload d'images *(non prévue au contrat)*
- [x] Authentification Google OAuth 2.0 côté backend (Passport.js + `passport-google-oauth20`)
- [x] Bouton "Se connecter avec Google" côté frontend (`@react-oauth/google`)
- [x] Création automatique de compte visiteur lors du premier login Google (upsert)
- [x] Synchronisation avatar Google dans le profil utilisateur
- [x] Upload d'images événements via Multer (`POST /api/upload`)
- [x] Validation MIME côté serveur (JPEG, PNG, WebP, GIF uniquement)
- [x] Renommage sécurisé des fichiers uploadés (horodatage + nom original)
- [x] Prévisualisation image dans le formulaire événement (URL ou fichier uploadé)
- [x] Drag-and-drop dans le composant `ImageUploader`

#### Release Avancée 5 — Expérience utilisateur avancée *(non prévue au contrat)*
- [x] Masquage automatique des événements passés sur la page d'accueil (comparaison date)
- [x] Filtre toggleable "Afficher les événements passés" avec affichage en niveaux de gris
- [x] Filtrage temps réel des événements avec debounce 300 ms
- [x] Compteur dynamique de résultats ("X événements trouvés")
- [x] Barre de disponibilité colorée : vert (>50%), orange (20–50%), rouge (<20%)
- [x] Calendrier date picker personnalisé (`CalendarPicker`) sans dépendance externe
- [x] Bibliothèque d'icônes SVG inline (15+ icônes : CalendarIcon, MapPinIcon, TicketIcon, TrendingUpIcon…)
- [x] Modal de choix de connexion dans la Navbar (visiteur vs admin)
- [x] Page "Mes Réservations" avec historique et confirmation d'annulation
- [x] Scripts de seeding NPM : `npm run seed` et `npm run seed:reset`
- [x] Seed automatique au démarrage (10 événements démo + compte admin)

#### Release Avancée 6 — Déploiement cloud *(prévue, non réalisée)*
- [ ] Hébergement frontend (Vercel / Netlify)
- [ ] Hébergement backend (Railway / Render)
- [ ] Base de données MongoDB Atlas (cloud)
- [ ] Gestion des environnements dev / production

---

## 3. Stack technique

### Vue d'ensemble

```
Utilisateur
    ↓
Frontend React (Vite, port 5173)
    ↓ requêtes HTTP / API REST (Axios)
Backend Node.js + Express (port 3000)
    ↓
Mongoose (ODM)
    ↓
MongoDB (conteneur Docker, port 27017)
```

### Technologies

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| Frontend | React | ^19.2 | UI composants |
| Frontend | Vite | ^7.3 | Build tool |
| Frontend | React Router | ^7.13 | Routing SPA |
| Frontend | Axios | ^1.13 | Appels API |
| Frontend | Recharts | ^2.15 | Graphiques dashboard |
| Frontend | @react-oauth/google | ^0.13 | Google OAuth |
| Backend | Node.js | >= 18 | Runtime |
| Backend | Express | ^5.2 | Framework HTTP |
| Backend | Mongoose | ^9.3 | ODM MongoDB |
| Backend | JWT | ^9.0 | Authentification stateless |
| Backend | bcryptjs | ^3.0 | Hachage mots de passe |
| Backend | Helmet | ^8.1 | Headers de sécurité |
| Backend | express-rate-limit | ^8.3 | Protection brute-force |
| Backend | express-mongo-sanitize | ^2.2 | Protection injection NoSQL |
| Backend | Multer | ^2.1 | Upload d'images |
| Backend | Nodemailer | ^8.0 | Envoi d'e-mails |
| Backend | Passport + Google OAuth20 | ^0.7 | OAuth 2.0 |
| BDD | MongoDB | 7 (Docker) | Base de données NoSQL |

---

## 4. Architecture des fichiers

### Backend

```
backend/
├── src/
│   ├── server.js              # Point d'entrée : connexion DB, seed admin, démarrage serveur
│   ├── app.js                 # Setup Express : middlewares, routes, gestion erreurs
│   ├── config/
│   │   ├── db.js              # Connexion Mongoose à MongoDB
│   │   └── passport.js        # Stratégie Google OAuth 2.0
│   ├── middleware/
│   │   ├── authMiddleware.js  # Vérification token JWT (req.user)
│   │   ├── adminMiddleware.js # Vérification rôle admin
│   │   └── security.js        # Helmet + rate-limiting + sanitisation MongoDB
│   ├── models/
│   │   ├── User.js            # Schéma utilisateur (email, password hashé, role, googleId)
│   │   ├── Event.js           # Schéma événement (categorie, type, date, lieu, prix, capacité)
│   │   └── Reservation.js     # Schéma réservation (user ↔ event, quantité, statut)
│   ├── controllers/
│   │   ├── authController.js       # Login, register, Google OAuth
│   │   ├── eventController.js      # CRUD événements + filtrage/recherche
│   │   ├── reservationController.js # Créer, lister, annuler réservations
│   │   └── statsController.js      # Statistiques dashboard admin
│   ├── routes/
│   │   ├── authRoutes.js        # POST /api/auth/login|register|google
│   │   ├── eventRoutes.js       # GET|POST|PUT|DELETE /api/events
│   │   ├── reservationRoutes.js # GET|POST|DELETE /api/reservations
│   │   ├── statsRoutes.js       # GET /api/stats
│   │   └── uploadRoutes.js      # POST /api/upload
│   └── utils/
│       ├── seedAdmin.js         # Seed compte admin + 10 événements démo au démarrage
│       ├── seedEvents.js        # Script seed événements standalone
│       └── mailer.js            # Envoi e-mail confirmation réservation
├── uploads/                     # Images uploadées via Multer
├── .env                         # Variables d'environnement (non versionné)
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── main.jsx               # Point d'entrée React
│   ├── App.jsx                # Routes + wrapper GoogleOAuthProvider
│   ├── context/
│   │   └── AuthContext.jsx    # État global auth (token, user, isAdmin, login, logout)
│   ├── components/
│   │   ├── Navbar.jsx         # Barre de navigation adaptative (visiteur / admin)
│   │   ├── EventCard.jsx      # Carte événement (image, titre, date, lieu, prix, dispo)
│   │   ├── FilterBar.jsx      # Barre recherche + filtres catégorie/type
│   │   ├── DashboardChart.jsx # Graphiques Recharts (camembert + barres)
│   │   ├── ProtectedRoute.jsx # Redirection non-admin vers /login
│   │   └── ui/
│   │       ├── Icons.jsx         # Icônes SVG inline
│   │       ├── ImageUploader.jsx # Upload image avec prévisualisation
│   │       └── CalendarPicker.jsx # Sélecteur de date
│   ├── pages/
│   │   ├── Home.jsx           # Liste événements publique (masque les événements passés)
│   │   ├── EventDetails.jsx   # Détail événement + formulaire réservation
│   │   ├── Login.jsx          # Connexion email/password + Google OAuth
│   │   ├── Register.jsx       # Inscription visiteur (bloque @eventfire.fr)
│   │   ├── MesReservations.jsx # Historique + annulation réservations utilisateur
│   │   ├── Dashboard.jsx      # Tableau de bord admin (stats + graphiques)
│   │   ├── AdminEvents.jsx    # Gestion événements admin (liste + actions)
│   │   └── EventForm.jsx      # Formulaire création / modification événement
│   ├── services/
│   │   ├── authService.js        # Appels API authentification
│   │   ├── eventService.js       # Appels API événements
│   │   ├── reservationService.js # Appels API réservations
│   │   └── statsService.js       # Appels API statistiques
│   └── index.css              # Styles globaux
└── package.json
```

---

## 5. Modèles de données

### User

```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashé bcrypt, null si OAuth),
  googleId: String,
  avatar: String,
  role: 'admin' | 'visiteur'  // défaut: 'visiteur'
}
```

### Event

```javascript
{
  title: String (required),
  description: String (required),
  category: 'Musical' | 'Culturel',
  type: 'Concert' | 'Festival' | 'Opéra' | 'Symphonie' | 'Théâtre' | 'Ballet' | 'Exposition' | ...,
  date: Date,
  time: String,
  city: String,
  venue: String,
  organizer: String,
  price: Number,
  capacity: Number,
  ticketsSold: Number,
  imageUrl: String
}
```

### Reservation

```javascript
{
  user: ObjectId → User,
  event: ObjectId → Event,
  quantity: Number,
  status: 'confirmée' | 'annulée'
}
```

---

## 6. API REST — Endpoints

### Authentification (`/api/auth`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| POST | `/login` | public | Login email/password |
| POST | `/register` | public | Inscription visiteur |
| POST | `/google` | public | Login/register Google OAuth |

### Événements (`/api/events`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| GET | `/` | public | Liste événements (filtrés par query params) |
| GET | `/:id` | public | Détail d'un événement |
| POST | `/` | admin | Créer un événement |
| PUT | `/:id` | admin | Modifier un événement |
| DELETE | `/:id` | admin | Supprimer un événement |

### Réservations (`/api/reservations`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| POST | `/` | auth | Créer une réservation |
| GET | `/mes-reservations` | auth | Réservations de l'utilisateur connecté |
| DELETE | `/:id` | auth | Annuler une réservation |

### Statistiques (`/api/stats`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| GET | `/` | admin | Stats globales (revenus, billets, taux d'occupation) |
| GET | `/top-events` | admin | Top 5 événements par revenus / taux d'occupation |

### Upload (`/api/upload`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| POST | `/` | admin | Upload image événement (Multer) |

---

## 7. Sécurité

### Mesures implémentées

- **JWT** : tokens avec expiration 2h, transmis en header `Authorization: Bearer <token>`
- **bcryptjs** : hachage des mots de passe avant stockage
- **Helmet** : headers HTTP sécurisés (HSTS, X-Frame-Options, nosniff, etc.)
- **Rate-limiting** : 10 tentatives auth / 15 min, 200 requêtes générales / 15 min
- **express-mongo-sanitize** : protection injection NoSQL (nettoyage des `$` dans les requêtes)
- **Protection mass-assignment** : `eventController` extrait explicitement les champs autorisés
- **Protection regex injection** : échappement des caractères spéciaux dans les recherches
- **Séparation des rôles** : emails `@eventfire.fr` réservés aux admins, bloqués en OAuth Google

### Comptes de test

| Compte | Email | Mot de passe | Rôle |
|--------|-------|-------------|------|
| Admin | `admin@eventfire.fr` | `admin123` | admin |
| Client | S'inscrire via formulaire | — | Client |

---

## 8. Lancer le projet en local

### Prérequis

- Node.js >= 18
- Docker Desktop

### 1. Cloner le dépôt

```bash
git clone <url-repo>
cd Projet_full_stack_EventFire
```

### 2. Démarrer MongoDB

```bash
docker-compose up -d
```

### 3. Configurer le backend

```bash
cd EventFire/backend
npm install
```

Créer `.env` :

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/eventfire
JWT_SECRET=votre_secret_jwt
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
FRONTEND_URL=http://localhost:5173
EMAIL_USER=votre_email_mailtrap
EMAIL_PASS=votre_password_mailtrap
```

```bash
npm run dev
```

Le serveur seed automatiquement : compte admin + 10 événements démo.

### 4. Configurer le frontend

```bash
cd EventFire/frontend
npm install
```

Créer `.env` :

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

---

## 9. Données de démonstration (seed)

Au démarrage du serveur, `seedAdmin.js` injecte automatiquement :

**Compte admin :** `admin@eventfire.fr` / `admin123`

**10 événements culturels français :**

| Titre | Catégorie | Type | Lieu | Prix |
|-------|-----------|------|------|------|
| Symphonie No. 9 de Beethoven | Musical | Symphonie | Salle Pleyel, Paris | 45€ |
| Rock en Seine Festival | Musical | Festival | Domaine National, Saint-Cloud | 89€ |
| La Traviata | Musical | Opéra | Opéra Bastille, Paris | 75€ |
| Soirée Jazz au Piano Bar | Musical | Concert | Piano Bar, Lyon | 25€ |
| Hamlet de Shakespeare | Culturel | Théâtre | Comédie-Française, Paris | 38€ |
| Ballet Casse-Noisette | Musical | Ballet | Opéra Garnier, Paris | 65€ |
| Exposition Impressionnisme | Culturel | Exposition | Musée d'Orsay, Paris | 18€ |
| Le Lac des Cygnes | Musical | Ballet | Opéra de Lyon | 55€ |
| Festival de musique baroque | Musical | Festival | Versailles | 42€ |
| Concert électronique | Musical | Concert | Zénith, Paris | 35€ |

---

## 10. Maquettes Figma — Correspondance avec l'implémentation

Les maquettes réalisées avant développement ont été fidèlement implémentées :

| Maquette | Page implémentée | Composants |
|----------|-----------------|-----------|
| Accueil avec hero + filtres + cards | `Home.jsx` | `FilterBar.jsx`, `EventCard.jsx` |
| Détail événement + sidebar réservation | `EventDetails.jsx` | Prix, disponibilité, bouton réserver |
| Tableau de bord admin (stats + graphiques) | `Dashboard.jsx` | `DashboardChart.jsx` (Recharts) |
| Gestion des événements (tableau + actions) | `AdminEvents.jsx` | Liste avec Modifier / Supprimer |
| Formulaire modification événement | `EventForm.jsx` | Tous les champs du modèle Event |
| Formulaire création événement | `EventForm.jsx` | Réutilisation du même composant |

---

## 11. Historique des commits (releases)

```
0bf9e83  modification front - masquer les événements passés
0d25270  docs: mise à jour README — guide complet pour cloner et lancer le projet
d593e87  feat: V2 — Corrections auth, réservations et dashboard
d43f414  feat: Release 2 — Système de réservation visiteur + corrections sécurité
c9f24c1  feat: V1_bis — icônes SVG, upload image, seed conditionnel
3adbdee  feat: Version 1.0 — Application EventFire complète (MERN Stack)
a265568  ajout de la partie passeport
81918f8  ajout de la partie admin
977183f  Initial commit — structure projet EventFire (MERN stack)
```

---

## 12. Conventions de développement

- **Commits sémantiques** : `feat:`, `fix:`, `docs:`, `refactor:`
- **Variables d'environnement** : jamais commitées (`.env` dans `.gitignore`)
- **Séparation des responsabilités** : routes → controllers → models (pattern MVC)
- **Services frontend** : toute logique d'appel API isolée dans `services/`, jamais inline dans les composants
- **Context React** : état d'authentification global via `AuthContext`, évite le prop drilling
- **Routes protégées** : `ProtectedRoute` côté frontend + `authMiddleware` + `adminMiddleware` côté backend (double protection)

---

*Ce fichier CLAUDE.md a été généré pour documenter la démarche Spec-Driven Development du projet EventFire et servir de contexte aux sessions de développement assisté par IA.*

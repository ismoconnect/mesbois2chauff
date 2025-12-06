# 🏗️ Architecture du Projet MesBois 2

## Vue d'ensemble

MesBois 2 est une application web de vente de bois de chauffage construite en **architecture monorepo**. Le projet contient deux applications React distinctes qui partagent certaines dépendances mais sont déployées indépendamment.

## Structure du Monorepo

```
mesbois-2/
│
├── apps/                           # Applications principales
│   ├── client/                     # Application client (publique)
│   │   ├── api/                    # APIs serverless
│   │   │   └── order-confirmation.js
│   │   ├── public/                 # Fichiers statiques
│   │   ├── src/                    # Code source
│   │   │   ├── components/         # Composants React
│   │   │   ├── contexts/           # Contextes (Auth, Cart, Language)
│   │   │   ├── firebase/           # Configuration Firebase
│   │   │   ├── hooks/              # Hooks personnalisés
│   │   │   ├── i18n/               # Traductions (FR, EN, DE, ES, IT, PT, RO)
│   │   │   ├── pages/              # Pages de l'application
│   │   │   ├── App.js              # Composant racine
│   │   │   └── index.js            # Point d'entrée
│   │   ├── package.json            # Dépendances client
│   │   └── vercel.json             # Config Vercel client
│   │
│   └── admin/                      # Application admin (backoffice)
│       ├── api/                    # APIs serverless
│       │   ├── order-status.js     # Mise à jour statuts
│       │   ├── settings-payments.js # Paramètres paiement
│       │   ├── cron-awaiting-payment.js # Cron rappels
│       │   └── cron-abandoned-carts.js  # Cron paniers
│       ├── public/                 # Fichiers statiques
│       ├── src/                    # Code source
│       │   ├── components/         # Composants React
│       │   ├── contexts/           # Contextes (Auth)
│       │   ├── firebase/           # Configuration Firebase
│       │   ├── pages/              # Pages admin
│       │   ├── App.js              # Composant racine
│       │   └── index.js            # Point d'entrée
│       ├── package.json            # Dépendances admin
│       └── vercel.json             # Config Vercel admin + crons
│
├── docs/                           # Documentation
│   ├── DEPLOIEMENT_VERCEL.md       # Guide de déploiement complet
│   ├── GUIDE_RAPIDE.md             # Guide rapide de référence
│   └── ARCHITECTURE.md             # Ce fichier
│
├── scripts/                        # Scripts utilitaires
│   └── ...                         # Scripts de maintenance
│
├── .agent/                         # Configuration agent
│   └── workflows/                  # Workflows automatisés
│       └── deploy.md               # Workflow de déploiement
│
├── firestore.rules                 # Règles de sécurité Firestore
├── firestore.indexes.json          # Index Firestore
├── storage.rules                   # Règles de sécurité Storage
│
├── package.json                    # Configuration workspace racine
├── package-lock.json               # Lock file racine
├── vercel.json                     # Config Vercel racine (minimale)
│
├── ENV_TEMPLATE_CLIENT.txt         # Template variables client
├── ENV_TEMPLATE_ADMIN.txt          # Template variables admin
│
├── .gitignore                      # Fichiers à ignorer
└── README.md                       # Documentation principale
```

---

## 🎯 Applications

### 1. Application Client (`apps/client`)

**Objectif** : Site public pour les clients finaux

**Fonctionnalités principales** :
- 🛍️ Catalogue de produits avec filtres
- 🔐 Authentification utilisateur
- 🛒 Panier d'achat
- 💳 Processus de commande (PayPal, Virement)
- 📦 Suivi des commandes
- 🌍 Support multilingue (7 langues)
- 📱 Interface responsive

**Technologies** :
- React 18
- React Router v6
- Styled Components
- Firebase (Auth, Firestore)
- Cloudinary (images)
- react-i18next (internationalisation)
- PayPal SDK

**APIs Serverless** :
- `POST /api/order-confirmation` : Envoi d'emails de confirmation

**Déploiement** :
- Plateforme : Vercel
- Build : Create React App
- Output : Dossier `build/`
- URL : `mesbois2-client.vercel.app` (exemple)

---

### 2. Application Admin (`apps/admin`)

**Objectif** : Interface d'administration pour gérer le site

**Fonctionnalités principales** :
- 📊 Dashboard avec statistiques
- 📦 Gestion des produits (CRUD)
- 🛍️ Gestion des commandes
- 👥 Gestion des utilisateurs
- ⚙️ Paramètres de paiement
- 📧 Notifications automatiques (crons)
- 🖼️ Upload d'images (Cloudinary)

**Technologies** :
- React 18
- React Router v6
- Styled Components
- Firebase (Auth, Firestore, Admin SDK)
- Cloudinary (upload)
- Nodemailer (emails)

**APIs Serverless** :
- `POST /api/order-status` : Mise à jour des statuts de commande
- `GET/POST /api/settings-payments` : Gestion des paramètres de paiement
- `GET /api/cron-awaiting-payment` : Rappels de paiement (cron 8h00)
- `GET /api/cron-abandoned-carts` : Paniers abandonnés (cron 9h00)

**Cron Jobs** :
- **8h00 quotidien** : Rappels pour commandes en attente de paiement
- **9h00 quotidien** : Notifications pour paniers abandonnés

**Déploiement** :
- Plateforme : Vercel
- Build : Create React App
- Output : Dossier `build/`
- URL : `mesbois2-admin.vercel.app` (exemple)
- Nécessite : Plan Vercel Pro (pour les crons)

---

## 🔄 Flux de Données

### Architecture Firebase

```
Firebase
├── Authentication
│   ├── Utilisateurs clients
│   └── Utilisateurs admin (avec custom claims)
│
├── Firestore Database
│   ├── users/              # Profils utilisateurs
│   ├── products/           # Catalogue produits
│   ├── categories/         # Catégories
│   ├── orders/             # Commandes
│   ├── carts/              # Paniers
│   ├── reviews/            # Avis clients
│   └── settings/           # Paramètres globaux
│       └── payments/       # Config paiements
│
└── Storage
    ├── products/           # Images produits
    └── categories/         # Images catégories
```

### Flux de Commande

```
Client                          Firebase                    Admin
  │                               │                           │
  │  1. Ajoute au panier          │                           │
  ├──────────────────────────────>│                           │
  │                               │                           │
  │  2. Passe commande            │                           │
  ├──────────────────────────────>│                           │
  │                               │                           │
  │  3. Email confirmation        │                           │
  │<────────────────────────────API                           │
  │                               │                           │
  │                               │  4. Notification          │
  │                               ├──────────────────────────>│
  │                               │                           │
  │                               │  5. Mise à jour statut    │
  │                               │<──────────────────────────┤
  │                               │                           │
  │  6. Notification statut       │                           │
  │<────────────────────────────API                           │
```

---

## 🔐 Sécurité

### Règles Firestore (`firestore.rules`)

- **Users** : Lecture/écriture uniquement pour l'utilisateur propriétaire
- **Products** : Lecture publique, écriture admin uniquement
- **Orders** : Lecture/écriture pour le propriétaire ou admin
- **Carts** : Lecture/écriture pour le propriétaire uniquement
- **Reviews** : Lecture publique, écriture authentifiée
- **Settings** : Lecture publique, écriture admin uniquement

### Règles Storage (`storage.rules`)

- **Products** : Lecture publique, écriture admin uniquement
- **Categories** : Lecture publique, écriture admin uniquement

### Variables d'Environnement

Toutes les clés sensibles sont stockées dans des variables d'environnement :
- Clés Firebase
- Credentials Cloudinary
- Credentials PayPal
- Credentials Email
- Firebase Admin SDK (pour les APIs serverless)

---

## 🚀 Déploiement

### Stratégie de Déploiement

**Monorepo avec déploiements séparés** :
- Chaque application est déployée indépendamment
- Les déploiements se font depuis les sous-dossiers (`apps/client`, `apps/admin`)
- Chaque app a sa propre configuration Vercel (`vercel.json`)

### Environnements

| Environnement | Description | Commande |
|---------------|-------------|----------|
| **Development** | Local (localhost:3000) | `npm start` |
| **Preview** | Test sur Vercel (URL unique) | `vercel` |
| **Production** | Production sur Vercel | `vercel --prod` |

### CI/CD

Le déploiement est manuel via Vercel CLI :
1. Build et test en local
2. Déploiement preview pour validation
3. Déploiement production après validation

---

## 📦 Gestion des Dépendances

### Workspace npm

Le projet utilise les **workspaces npm** pour gérer les dépendances :

```json
{
  "workspaces": ["apps/*"]
}
```

**Avantages** :
- Dépendances partagées installées une seule fois à la racine
- Commandes npm peuvent cibler des workspaces spécifiques
- Gestion simplifiée des versions

**Commandes** :
```bash
# Installer toutes les dépendances
npm install

# Installer dans un workspace spécifique
npm install --workspace apps/client <package>

# Lancer un script dans un workspace
npm run build --workspace apps/client
```

---

## 🔧 APIs Serverless

### Architecture

Les APIs serverless sont déployées comme **Vercel Functions** :
- Fichiers dans le dossier `/api` de chaque app
- Exécutées à la demande (serverless)
- Utilisation de Node.js
- Accès aux variables d'environnement Vercel

### Configuration

Définie dans `vercel.json` :
```json
{
  "builds": [
    { "src": "api/order-status.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "^/api/order-status$", "dest": "/api/order-status.js" }
  ]
}
```

### Cron Jobs (Admin uniquement)

```json
{
  "crons": [
    { "path": "/api/cron-awaiting-payment", "schedule": "0 8 * * *" },
    { "path": "/api/cron-abandoned-carts", "schedule": "0 9 * * *" }
  ]
}
```

**Format cron** : `minute hour day month dayOfWeek`
- `0 8 * * *` = Tous les jours à 8h00
- `0 9 * * *` = Tous les jours à 9h00

---

## 🌍 Internationalisation (Client uniquement)

### Langues supportées
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais
- 🇩🇪 Allemand
- 🇪🇸 Espagnol
- 🇮🇹 Italien
- 🇵🇹 Portugais
- 🇷🇴 Roumain

### Structure i18n

```
src/i18n/
├── config.js           # Configuration i18next
└── locales/
    ├── fr.json         # Traductions françaises
    ├── en.json         # Traductions anglaises
    ├── de.json         # Traductions allemandes
    ├── es.json         # Traductions espagnoles
    ├── it.json         # Traductions italiennes
    ├── pt.json         # Traductions portugaises
    └── ro.json         # Traductions roumaines
```

---

## 📊 Performance

### Optimisations

**Client** :
- Code splitting (React.lazy)
- Lazy loading des images (react-lazy-load-image-component)
- Mise en cache Cloudinary
- Compression des images
- Minification du code (production)

**Admin** :
- Pagination des listes
- Chargement à la demande
- Optimisation des requêtes Firestore
- Upload optimisé Cloudinary

---

## 🔍 Monitoring

### Logs Vercel

```bash
# Voir les logs d'un déploiement
vercel logs <deployment-url>

# Voir les logs en temps réel
vercel logs --follow
```

### Firebase Console

- Authentification : Utilisateurs actifs
- Firestore : Requêtes et performance
- Storage : Utilisation et bande passante

---

## 📚 Ressources

- **[Guide de déploiement](DEPLOIEMENT_VERCEL.md)** : Instructions détaillées
- **[Guide rapide](GUIDE_RAPIDE.md)** : Référence rapide
- **[README principal](../README.md)** : Vue d'ensemble du projet

---

**Dernière mise à jour** : Décembre 2025
**Version** : 1.0.0

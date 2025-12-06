# MesBois 2 - Application de Vente de Bois de Chauffage

Une application web moderne et complète pour la vente de bois de chauffage, développée avec React et Firebase en architecture **monorepo**.

## 🏗️ Architecture

Ce projet utilise une architecture **monorepo** avec deux applications distinctes :

```
mesbois-2/
├── apps/
│   ├── client/          # Application client (site public)
│   └── admin/           # Application admin (backoffice)
├── docs/                # Documentation
├── scripts/             # Scripts utilitaires
├── .agent/workflows/    # Workflows de déploiement
├── package.json         # Configuration workspace racine
└── vercel.json          # Configuration Vercel racine
```

## 🚀 Fonctionnalités

### ✅ Application Client
- **Catalogue de produits** avec filtres et recherche avancée
- **Système d'authentification** complet (inscription, connexion, profil)
- **Panier d'achat** avec gestion des quantités
- **Processus de commande** avec informations de livraison
- **Suivi des commandes** et historique
- **Interface responsive** et moderne
- **Support multilingue** (i18n)
- **Paiement** (PayPal, Virement bancaire)

### ✅ Application Admin
- **Gestion des produits** (CRUD complet)
- **Gestion des commandes** et statuts
- **Gestion des utilisateurs**
- **Paramètres de paiement**
- **Cron jobs automatiques** :
  - Rappels de paiement (8h00 quotidien)
  - Paniers abandonnés (9h00 quotidien)
- **Upload d'images** via Cloudinary
- **APIs serverless** intégrées

### 🛠 Technologies utilisées
- **Frontend**: React 18, React Router, Styled Components
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Déploiement**: Vercel (avec APIs serverless)
- **Images**: Cloudinary
- **Gestion d'état**: Context API
- **Notifications**: React Hot Toast
- **Icônes**: React Icons
- **Animations**: Framer Motion
- **Internationalisation**: react-i18next

## 📦 Installation

### Prérequis
- Node.js (version 20.x LTS)
- npm ou yarn
- Compte Firebase
- Compte Cloudinary
- Compte Vercel (pour le déploiement)

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd mesbois-2
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement

#### Client
Copiez `ENV_TEMPLATE_CLIENT.txt` en `.env.local` dans `apps/client/` et remplissez les valeurs.

#### Admin
Copiez `ENV_TEMPLATE_ADMIN.txt` en `.env.local` dans `apps/admin/` et remplissez les valeurs.

### 4. Lancer les applications en développement

#### Client
```bash
npm run dev:client
# ou
cd apps/client && npm start
```

#### Admin
```bash
npm run dev:admin
# ou
cd apps/admin && npm start
```

## 🚀 Déploiement sur Vercel

Ce projet utilise une architecture **monorepo** avec deux applications distinctes :
- **Client** : Application publique (`apps/client`)
- **Admin** : Interface d'administration (`apps/admin`)

### 📚 Guide complet de déploiement

Consultez le guide détaillé : **[docs/DEPLOIEMENT_VERCEL.md](docs/DEPLOIEMENT_VERCEL.md)**

### 🚀 Déploiement rapide

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Lier les projets** (une seule fois)
   ```bash
   cd apps/client && vercel link
   cd ../admin && vercel link
   ```

4. **Configurer les variables d'environnement**
   - Voir `ENV_TEMPLATE_CLIENT.txt` pour le client
   - Voir `ENV_TEMPLATE_ADMIN.txt` pour l'admin

5. **Déployer en production**
   ```bash
   # Client
   cd apps/client && vercel --prod
   
   # Admin
   cd apps/admin && vercel --prod
   ```

### 🔄 Workflow automatisé

Utilisez le workflow de déploiement :
```bash
# Depuis la racine du projet
/deploy
```

Ou consultez `.agent/workflows/deploy.md` pour les étapes détaillées.

### ⚠️ Important
- **Ne jamais déployer depuis la racine** du projet
- Toujours déployer depuis `apps/client` ou `apps/admin`
- Configurer toutes les variables d'environnement avant le premier déploiement

## 📁 Structure détaillée

### Client (`apps/client/`)
```
client/
├── api/
│   └── order-confirmation.js    # API serverless pour emails
├── public/
├── src/
│   ├── components/              # Composants réutilisables
│   ├── contexts/                # Contextes React (Auth, Cart, Language)
│   ├── firebase/                # Configuration Firebase
│   ├── hooks/                   # Hooks personnalisés
│   ├── i18n/                    # Traductions multilingues
│   ├── pages/                   # Pages de l'application
│   └── App.js
├── package.json
└── vercel.json                  # Configuration Vercel
```

### Admin (`apps/admin/`)
```
admin/
├── api/
│   ├── order-status.js          # Mise à jour statuts
│   ├── settings-payments.js     # Paramètres paiement
│   ├── cron-awaiting-payment.js # Cron rappels
│   └── cron-abandoned-carts.js  # Cron paniers
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── firebase/
│   ├── pages/
│   └── App.js
├── package.json
└── vercel.json                  # Configuration Vercel + Crons
```

## 🔧 Scripts disponibles

### Racine du projet
```bash
npm start           # Lance le client en dev
npm run dev         # Lance le client en dev
npm run build       # Build client + admin
npm run dev:client  # Lance le client
npm run dev:admin   # Lance l'admin
npm run build:client # Build le client
npm run build:admin  # Build l'admin
```

### Dans chaque app (client/admin)
```bash
npm start           # Lance en développement
npm run build       # Build pour production
npm test            # Lance les tests
```

## 🔐 Sécurité

### Bonnes pratiques implémentées
- ✅ Authentification Firebase sécurisée
- ✅ Règles Firestore restrictives (voir `firestore.rules`)
- ✅ Règles Storage sécurisées (voir `storage.rules`)
- ✅ Variables d'environnement pour toutes les clés sensibles
- ✅ Validation des données côté client
- ✅ Protection CSRF
- ✅ Gestion des erreurs

### Fichiers de sécurité
- `firestore.rules` : Règles de sécurité Firestore
- `firestore.indexes.json` : Index Firestore
- `storage.rules` : Règles de sécurité Storage
- `.gitignore` : Fichiers à ne pas commiter

## 📚 Documentation

- **[Guide de déploiement Vercel](docs/DEPLOIEMENT_VERCEL.md)** : Guide complet pour déployer sur Vercel
- **[Workflow de déploiement](.agent/workflows/deploy.md)** : Workflow automatisé
- **[Template variables client](ENV_TEMPLATE_CLIENT.txt)** : Variables d'environnement client
- **[Template variables admin](ENV_TEMPLATE_ADMIN.txt)** : Variables d'environnement admin

## 🛠️ APIs Serverless

### Client
- `POST /api/order-confirmation` : Envoi d'emails de confirmation de commande

### Admin
- `POST /api/order-status` : Mise à jour des statuts de commande
- `GET/POST /api/settings-payments` : Gestion des paramètres de paiement
- `GET /api/cron-awaiting-payment` : Cron rappels de paiement (8h00)
- `GET /api/cron-abandoned-carts` : Cron paniers abandonnés (9h00)

## 🔄 Cron Jobs (Admin uniquement)

Les tâches planifiées s'exécutent automatiquement sur Vercel :
- **8h00 quotidien** : Rappels de paiement pour commandes en attente
- **9h00 quotidien** : Notifications pour paniers abandonnés

> ⚠️ Les cron jobs nécessitent un plan Vercel Pro ou supérieur

## 📱 Fonctionnalités à venir

### Phase 2
- [ ] Application mobile (React Native)
- [ ] Notifications push (Firebase Cloud Messaging)
- [ ] Chat en direct (Firebase Realtime Database)
- [ ] Blog/Actualités
- [ ] Programme de fidélité
- [ ] Système de parrainage

### Améliorations techniques
- [ ] Tests unitaires (Jest, React Testing Library)
- [ ] Tests d'intégration
- [ ] Tests E2E (Cypress)
- [ ] PWA (Progressive Web App)
- [ ] Optimisation SEO avancée
- [ ] Analytics (Google Analytics 4)
- [ ] Monitoring (Sentry)

## 🐛 Dépannage

### Problèmes courants

#### Build échoue localement
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Variables d'environnement non reconnues
- Vérifiez que le fichier `.env.local` existe
- Redémarrez le serveur de développement
- Les variables doivent commencer par `REACT_APP_`

#### Erreur de déploiement Vercel
- Consultez [docs/DEPLOIEMENT_VERCEL.md](docs/DEPLOIEMENT_VERCEL.md)
- Vérifiez les logs : `vercel logs <deployment-url>`
- Assurez-vous d'être dans le bon dossier (`apps/client` ou `apps/admin`)

## 📞 Support

Pour toute question ou problème :
- 📧 Email : contact@mesbois.fr
- 📖 [Documentation Firebase](https://firebase.google.com/docs)
- 📖 [Documentation Vercel](https://vercel.com/docs)
- 📖 [Documentation React](https://react.dev)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour MesBois d'chauff**

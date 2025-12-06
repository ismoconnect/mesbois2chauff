# 📦 Système de Déploiement Vercel - MesBois 2

## 🏗️ Architecture du Projet

Votre projet est structuré en **monorepo** avec deux applications React distinctes :

```
mesbois-2/
├── apps/
│   ├── client/          # Application client (site public)
│   │   ├── api/
│   │   │   └── order-confirmation.js
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vercel.json
│   └── admin/           # Application admin (backoffice)
│       ├── api/
│       │   ├── order-status.js
│       │   ├── cron-awaiting-payment.js
│       │   ├── cron-abandoned-carts.js
│       │   └── settings-payments.js
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vercel.json
├── package.json         # Configuration workspace racine
├── vercel.json          # Configuration Vercel racine (minimale)
├── firestore.rules
├── firestore.indexes.json
└── storage.rules
```

### Caractéristiques clés :
- ✅ **Monorepo** : Un seul repository Git contenant deux applications
- ✅ **Workspaces npm** : Gestion des dépendances partagées
- ✅ **Déploiements séparés** : Chaque app est déployée indépendamment sur Vercel
- ✅ **APIs Serverless** : Fonctions backend intégrées
- ✅ **Cron Jobs** : Tâches planifiées automatiques (admin uniquement)

---

## 🎯 Configuration Vercel

### 1. Fichiers de configuration

#### Racine (`/vercel.json`)
```json
{
  "version": 2
}
```
- ⚠️ Configuration minimale
- ⚠️ **Ne JAMAIS déployer depuis la racine !**

#### Client (`/apps/client/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Composants :**
- 🔨 **Build statique** : Utilise Create React App pour construire l'app React
- 📧 **API serverless** : `order-confirmation.js` pour l'envoi d'emails de confirmation
- 🔀 **Routing SPA** : Redirige toutes les routes vers `index.html` (React Router)

**API disponible :**
- `POST /api/order-confirmation` - Envoi d'emails de confirmation de commande

#### Admin (`/apps/admin/vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    { "src": "api/order-status.js", "use": "@vercel/node" },
    { "src": "api/cron-awaiting-payment.js", "use": "@vercel/node" },
    { "src": "api/cron-abandoned-carts.js", "use": "@vercel/node" },
    { "src": "api/settings-payments.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "^/api/order-status$", "dest": "/api/order-status.js" },
    { "src": "^/api/cron-awaiting-payment$", "dest": "/api/cron-awaiting-payment.js" },
    { "src": "^/api/cron-abandoned-carts$", "dest": "/api/cron-abandoned-carts.js" },
    { "src": "^/api/settings-payments$", "dest": "/api/settings-payments.js" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "crons": [
    { "path": "/api/cron-awaiting-payment", "schedule": "0 8 * * *" },
    { "path": "/api/cron-abandoned-carts", "schedule": "0 9 * * *" }
  ]
}
```

**Composants :**
- 🔨 **Build statique** : Interface admin React
- 🔌 **4 APIs serverless** :
  - `order-status.js` : Mise à jour des statuts de commande
  - `settings-payments.js` : Gestion des paramètres de paiement
  - `cron-awaiting-payment.js` : Tâche planifiée (8h00 quotidien)
  - `cron-abandoned-carts.js` : Tâche planifiée (9h00 quotidien)
- ⏰ **Cron jobs** : Exécution automatique des tâches planifiées

---

## 🚀 Processus de Déploiement

### Étape 1 : Prérequis

#### 1.1 Installer Vercel CLI (si pas déjà fait)
```bash
npm i -g vercel
```

#### 1.2 Se connecter à Vercel
```bash
vercel login
```
Suivez les instructions pour vous authentifier.

#### 1.3 Lier chaque application (une seule fois par projet)

**Pour le client :**
```bash
cd apps/client
vercel link --yes
```

Lors de la liaison, vous devrez :
1. Sélectionner votre compte/équipe Vercel
2. Choisir si vous voulez lier à un projet existant ou en créer un nouveau
3. Si nouveau projet, donnez-lui un nom (ex: `mesbois2-client`)

**Pour l'admin :**
```bash
cd apps/admin
vercel link --yes
```

Répétez le processus pour l'admin (ex: `mesbois2-admin`)

> 💡 **Note** : Cela crée un dossier `.vercel/` local avec les informations du projet. Ce dossier est déjà dans `.gitignore`.

---

### Étape 2 : Configurer les Variables d'Environnement

#### 2.1 Variables pour le Client

Depuis le dossier `apps/client`, ajoutez les variables d'environnement :

```bash
# Firebase Configuration
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
vercel env add REACT_APP_FIREBASE_APP_ID
vercel env add REACT_APP_FIREBASE_MEASUREMENT_ID

# Cloudinary Configuration
vercel env add REACT_APP_CLOUDINARY_CLOUD_NAME
vercel env add REACT_APP_CLOUDINARY_API_KEY

# PayPal Configuration
vercel env add REACT_APP_PAYPAL_CLIENT_ID

# Email Configuration (pour l'API order-confirmation)
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add EMAIL_TO
```

Pour chaque variable, Vercel vous demandera :
1. La valeur de la variable
2. Dans quel environnement l'utiliser (Production, Preview, Development)

> 💡 **Conseil** : Sélectionnez "Production" et "Preview" pour la plupart des variables.

#### 2.2 Variables pour l'Admin

Depuis le dossier `apps/admin`, ajoutez les variables d'environnement :

```bash
# Firebase Configuration
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
vercel env add REACT_APP_FIREBASE_APP_ID

# Cloudinary Configuration
vercel env add REACT_APP_CLOUDINARY_CLOUD_NAME
vercel env add REACT_APP_CLOUDINARY_API_KEY
vercel env add REACT_APP_CLOUDINARY_API_SECRET
vercel env add REACT_APP_CLOUDINARY_UPLOAD_PRESET

# Firebase Admin SDK (pour les APIs serverless)
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY

# Email Configuration (pour les cron jobs)
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add ADMIN_EMAIL
```

> ⚠️ **Important** : Pour `FIREBASE_PRIVATE_KEY`, copiez la clé complète avec les retours à la ligne (`\n`).

---

### Étape 3 : Déployer en Production

#### 3.1 Déployer le Client

```bash
# Se placer dans le dossier client
cd apps/client

# Déployer en production
vercel --prod
```

#### 3.2 Déployer l'Admin

```bash
# Se placer dans le dossier admin
cd apps/admin

# Déployer en production
vercel --prod
```

> ⚠️ **IMPORTANT** : Toujours exécuter `vercel --prod` depuis le bon sous-dossier (`apps/client` ou `apps/admin`), **JAMAIS depuis la racine** !

---

### Étape 4 : Ce qui se passe pendant le déploiement

1. **📤 Upload du code** : Vercel envoie les fichiers du dossier actuel
2. **📦 Installation des dépendances** : `npm install` (ou équivalent)
3. **🔨 Build** : Exécution de `npm run build` (Create React App)
   - Génère le dossier `build/` avec les fichiers statiques
4. **🔌 Déploiement des APIs** : Les fichiers dans `/api` sont déployés comme fonctions serverless
5. **🔀 Configuration des routes** : Application des règles de routing
6. **⏰ Activation des crons** (admin seulement) : Planification des tâches automatiques
7. **🌐 URL de déploiement** : Vercel génère une URL unique (ex: `mesbois2-client.vercel.app`)

---

## 🔄 Workflow de Développement

### Déploiement Preview (Test)

Pour tester vos changements avant la production :

```bash
# Client
cd apps/client
vercel

# Admin
cd apps/admin
vercel
```

Cela crée un déploiement de **preview** avec une URL unique pour tester.

### Déploiement Production

Une fois les tests validés :

```bash
# Client
cd apps/client
vercel --prod

# Admin
cd apps/admin
vercel --prod
```

---

## 🛠️ Commandes Utiles

### Voir les logs de déploiement
```bash
vercel logs <deployment-url>
```

### Lister les déploiements
```bash
vercel ls
```

### Supprimer un déploiement
```bash
vercel rm <deployment-url>
```

### Voir les variables d'environnement
```bash
vercel env ls
```

### Retirer une variable d'environnement
```bash
vercel env rm <variable-name>
```

---

## 🔍 Vérification Post-Déploiement

### Client
- ✅ Le site public est accessible
- ✅ Les routes React Router fonctionnent (pas de 404)
- ✅ Les images Cloudinary se chargent
- ✅ L'authentification Firebase fonctionne
- ✅ L'API `/api/order-confirmation` répond correctement

### Admin
- ✅ L'interface admin est accessible
- ✅ L'authentification admin fonctionne
- ✅ Les APIs serverless répondent :
  - `/api/order-status`
  - `/api/settings-payments`
- ✅ Les cron jobs sont planifiés (vérifier dans le dashboard Vercel)

---

## 🐛 Dépannage

### Erreur : "No Build Output"
**Problème** : Vercel ne trouve pas le dossier `build/`

**Solution** :
1. Vérifiez que `vercel.json` spécifie `"outputDirectory": "build"`
2. Vérifiez que `package.json` a un script `"build"`
3. Testez le build localement : `npm run build`

### Erreur : "Module not found"
**Problème** : Dépendances manquantes

**Solution** :
1. Vérifiez que toutes les dépendances sont dans `package.json`
2. Supprimez `node_modules/` et `package-lock.json`
3. Réinstallez : `npm install`
4. Redéployez

### Erreur : Variables d'environnement non définies
**Problème** : Les variables d'environnement ne sont pas accessibles

**Solution** :
1. Vérifiez avec `vercel env ls`
2. Ajoutez les variables manquantes avec `vercel env add`
3. Assurez-vous qu'elles sont définies pour "Production"
4. Redéployez

### Cron Jobs ne s'exécutent pas
**Problème** : Les tâches planifiées ne fonctionnent pas

**Solution** :
1. Vérifiez que `vercel.json` contient la section `"crons"`
2. Les cron jobs nécessitent un plan Vercel Pro ou supérieur
3. Vérifiez les logs dans le dashboard Vercel

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Deploying Create React App](https://vercel.com/guides/deploying-react-with-vercel)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

## 📝 Checklist de Déploiement

### Avant le premier déploiement
- [ ] Installer Vercel CLI : `npm i -g vercel`
- [ ] Se connecter : `vercel login`
- [ ] Lier le projet client : `cd apps/client && vercel link`
- [ ] Lier le projet admin : `cd apps/admin && vercel link`
- [ ] Configurer toutes les variables d'environnement (client)
- [ ] Configurer toutes les variables d'environnement (admin)

### Pour chaque déploiement
- [ ] Tester localement : `npm run build` (dans client et admin)
- [ ] Commit et push des changements Git
- [ ] Déployer en preview : `vercel` (pour tester)
- [ ] Vérifier le déploiement preview
- [ ] Déployer en production : `vercel --prod`
- [ ] Vérifier le déploiement production
- [ ] Tester les fonctionnalités critiques

---

## 🎯 Bonnes Pratiques

1. **Toujours tester localement** avant de déployer
2. **Utiliser les déploiements preview** pour valider les changements
3. **Ne jamais commiter** les fichiers `.env` ou `.vercel/`
4. **Documenter** les nouvelles variables d'environnement
5. **Monitorer** les logs Vercel après chaque déploiement
6. **Configurer des domaines personnalisés** pour la production
7. **Activer les notifications** Vercel pour les déploiements

---

## 🔐 Sécurité

- ✅ Toutes les clés API sont dans des variables d'environnement
- ✅ Les fichiers `.env` sont dans `.gitignore`
- ✅ Les APIs serverless utilisent Firebase Admin SDK avec des credentials sécurisés
- ✅ Les règles Firestore et Storage sont configurées
- ✅ L'authentification est requise pour l'admin

---

**Dernière mise à jour** : Décembre 2025
**Version** : 1.0.0

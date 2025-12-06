# 📚 Index de la Documentation - MesBois 2

Bienvenue dans la documentation du projet MesBois 2. Cette page vous guide vers les différentes ressources disponibles.

---

## 🚀 Pour Commencer

### 1. **[README.md](../README.md)**
   - **Description** : Vue d'ensemble du projet
   - **Contenu** :
     - Présentation générale
     - Fonctionnalités
     - Installation locale
     - Scripts disponibles
     - Technologies utilisées
   - **Pour qui** : Tous les développeurs

### 2. **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)**
   - **Description** : Guide de référence rapide
   - **Contenu** :
     - Checklist avant déploiement
     - Commandes essentielles
     - Variables d'environnement
     - Points d'attention
     - Workflow type
   - **Pour qui** : Développeurs qui déploient régulièrement

---

## 🏗️ Architecture

### 3. **[ARCHITECTURE.md](ARCHITECTURE.md)**
   - **Description** : Documentation complète de l'architecture
   - **Contenu** :
     - Structure du monorepo
     - Architecture des applications
     - Flux de données
     - Sécurité
     - APIs serverless
     - Internationalisation
     - Performance
   - **Pour qui** : Développeurs qui veulent comprendre le projet en profondeur

---

## 🚀 Déploiement

### 4. **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)**
   - **Description** : Guide complet de déploiement sur Vercel
   - **Contenu** :
     - Architecture du projet
     - Configuration Vercel
     - Processus de déploiement étape par étape
     - Configuration des variables d'environnement
     - Workflow de développement
     - Commandes utiles
     - Vérification post-déploiement
     - Dépannage
     - Bonnes pratiques
   - **Pour qui** : Développeurs qui déploient pour la première fois ou qui ont besoin de référence détaillée

### 5. **[.agent/workflows/deploy.md](../.agent/workflows/deploy.md)**
   - **Description** : Workflow automatisé de déploiement
   - **Contenu** :
     - Prérequis (une seule fois)
     - Étapes de déploiement
     - Commandes avec annotation `// turbo` pour auto-run
   - **Pour qui** : Développeurs qui utilisent l'agent pour déployer
   - **Utilisation** : Tapez `/deploy` dans l'agent

---

## ⚙️ Configuration

### 6. **[ENV_TEMPLATE_CLIENT.txt](../ENV_TEMPLATE_CLIENT.txt)**
   - **Description** : Template des variables d'environnement pour le client
   - **Contenu** :
     - Liste complète des variables
     - Descriptions
     - Instructions
   - **Pour qui** : Développeurs qui configurent l'application client

### 7. **[ENV_TEMPLATE_ADMIN.txt](../ENV_TEMPLATE_ADMIN.txt)**
   - **Description** : Template des variables d'environnement pour l'admin
   - **Contenu** :
     - Liste complète des variables
     - Descriptions
     - Instructions
   - **Pour qui** : Développeurs qui configurent l'application admin

---

## 🔐 Sécurité

### 8. **[firestore.rules](../firestore.rules)**
   - **Description** : Règles de sécurité Firestore
   - **Contenu** :
     - Règles d'accès aux collections
     - Validation des données
   - **Pour qui** : Développeurs qui modifient la base de données

### 9. **[storage.rules](../storage.rules)**
   - **Description** : Règles de sécurité Firebase Storage
   - **Contenu** :
     - Règles d'accès aux fichiers
     - Validation des uploads
   - **Pour qui** : Développeurs qui gèrent les images

### 10. **[firestore.indexes.json](../firestore.indexes.json)**
   - **Description** : Index Firestore pour optimiser les requêtes
   - **Contenu** :
     - Définition des index composites
   - **Pour qui** : Développeurs qui optimisent les requêtes

---

## 📋 Guides par Cas d'Usage

### Je veux déployer pour la première fois
1. Lisez **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)** en entier
2. Suivez la checklist dans **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)**
3. Configurez les variables avec **ENV_TEMPLATE_CLIENT.txt** et **ENV_TEMPLATE_ADMIN.txt**
4. Utilisez le workflow **[deploy.md](../.agent/workflows/deploy.md)**

### Je veux déployer régulièrement
1. Consultez **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)** pour les commandes
2. Utilisez le workflow **[deploy.md](../.agent/workflows/deploy.md)** avec `/deploy`

### Je veux comprendre l'architecture
1. Lisez **[ARCHITECTURE.md](ARCHITECTURE.md)**
2. Consultez **[README.md](../README.md)** pour la vue d'ensemble

### Je veux configurer l'environnement local
1. Lisez **[README.md](../README.md)** section "Installation"
2. Utilisez **ENV_TEMPLATE_CLIENT.txt** et **ENV_TEMPLATE_ADMIN.txt**

### J'ai un problème de déploiement
1. Consultez **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)** section "Dépannage"
2. Vérifiez **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)** section "En Cas de Problème"

### Je veux modifier la base de données
1. Consultez **[ARCHITECTURE.md](ARCHITECTURE.md)** section "Architecture Firebase"
2. Modifiez **firestore.rules** si nécessaire
3. Mettez à jour **firestore.indexes.json** pour les nouvelles requêtes

---

## 📁 Structure de la Documentation

```
mesbois-2/
├── README.md                       # Vue d'ensemble du projet
├── ENV_TEMPLATE_CLIENT.txt         # Variables client
├── ENV_TEMPLATE_ADMIN.txt          # Variables admin
│
├── docs/                           # Documentation détaillée
│   ├── INDEX.md                    # Ce fichier
│   ├── DEPLOIEMENT_VERCEL.md       # Guide de déploiement complet
│   ├── GUIDE_RAPIDE.md             # Référence rapide
│   └── ARCHITECTURE.md             # Architecture du projet
│
├── .agent/workflows/               # Workflows automatisés
│   └── deploy.md                   # Workflow de déploiement
│
├── firestore.rules                 # Règles Firestore
├── firestore.indexes.json          # Index Firestore
└── storage.rules                   # Règles Storage
```

---

## 🔗 Ressources Externes

### Documentation Officielle
- **[Vercel Docs](https://vercel.com/docs)** : Documentation Vercel
- **[Firebase Docs](https://firebase.google.com/docs)** : Documentation Firebase
- **[React Docs](https://react.dev)** : Documentation React
- **[Cloudinary Docs](https://cloudinary.com/documentation)** : Documentation Cloudinary

### Outils
- **[Vercel Dashboard](https://vercel.com/dashboard)** : Dashboard Vercel
- **[Firebase Console](https://console.firebase.google.com/)** : Console Firebase
- **[Cloudinary Console](https://cloudinary.com/console)** : Console Cloudinary

---

## 📝 Contribution

### Mise à jour de la documentation

Si vous modifiez le projet, pensez à mettre à jour la documentation correspondante :

| Modification | Documentation à mettre à jour |
|--------------|------------------------------|
| Nouvelle variable d'environnement | `ENV_TEMPLATE_*.txt`, `DEPLOIEMENT_VERCEL.md` |
| Nouvelle API serverless | `ARCHITECTURE.md`, `DEPLOIEMENT_VERCEL.md` |
| Nouvelle fonctionnalité | `README.md`, `ARCHITECTURE.md` |
| Nouveau workflow | `.agent/workflows/` |
| Nouvelle règle Firestore | `firestore.rules`, `ARCHITECTURE.md` |
| Nouveau script | `README.md` |

---

## ❓ Questions Fréquentes

### Où trouver les commandes de déploiement ?
→ **[GUIDE_RAPIDE.md](GUIDE_RAPIDE.md)** section "Commandes Essentielles"

### Comment configurer les variables d'environnement ?
→ **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)** section "Étape 2"

### Quelle est la structure du projet ?
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** section "Structure du Monorepo"

### Comment fonctionnent les cron jobs ?
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** section "Cron Jobs"

### Quelles sont les règles de sécurité ?
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** section "Sécurité"

---

## 📞 Support

Pour toute question sur la documentation :
- Consultez d'abord cette page pour trouver le bon document
- Vérifiez la section "Dépannage" dans **[DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)**
- Consultez les ressources externes ci-dessus

---

**Dernière mise à jour** : Décembre 2025
**Version de la documentation** : 1.0.0

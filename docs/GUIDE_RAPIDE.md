# 🚀 Guide Rapide - Déploiement MesBois 2

## 📋 Checklist Avant Premier Déploiement

### ✅ Prérequis
- [ ] Node.js 20.x installé
- [ ] Compte Vercel créé
- [ ] Compte Firebase configuré
- [ ] Compte Cloudinary configuré
- [ ] Toutes les variables d'environnement prêtes

### ✅ Installation
- [ ] Vercel CLI installé : `npm i -g vercel`
- [ ] Connecté à Vercel : `vercel login`

### ✅ Configuration Client
- [ ] Projet lié : `cd apps/client && vercel link`
- [ ] Variables d'environnement configurées (voir ENV_TEMPLATE_CLIENT.txt)
- [ ] Build testé localement : `npm run build`

### ✅ Configuration Admin
- [ ] Projet lié : `cd apps/admin && vercel link`
- [ ] Variables d'environnement configurées (voir ENV_TEMPLATE_ADMIN.txt)
- [ ] Build testé localement : `npm run build`

---

## 🎯 Commandes Essentielles

### Développement Local
```bash
# Client
npm run dev:client
# ou
cd apps/client && npm start

# Admin
npm run dev:admin
# ou
cd apps/admin && npm start
```

### Build Local (Test)
```bash
# Client
cd apps/client && npm run build

# Admin
cd apps/admin && npm run build
```

### Déploiement Preview (Test sur Vercel)
```bash
# Client
cd apps/client && vercel

# Admin
cd apps/admin && vercel
```

### Déploiement Production
```bash
# Client
cd apps/client && vercel --prod

# Admin
cd apps/admin && vercel --prod
```

### Gestion Variables d'Environnement
```bash
# Lister les variables
vercel env ls

# Ajouter une variable
vercel env add NOM_VARIABLE

# Supprimer une variable
vercel env rm NOM_VARIABLE

# Voir les logs
vercel logs <deployment-url>
```

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `docs/DEPLOIEMENT_VERCEL.md` | Guide complet de déploiement |
| `.agent/workflows/deploy.md` | Workflow automatisé |
| `ENV_TEMPLATE_CLIENT.txt` | Template variables client |
| `ENV_TEMPLATE_ADMIN.txt` | Template variables admin |
| `apps/client/vercel.json` | Config Vercel client |
| `apps/admin/vercel.json` | Config Vercel admin + crons |
| `firestore.rules` | Règles de sécurité Firestore |
| `storage.rules` | Règles de sécurité Storage |

---

## 🔑 Variables d'Environnement à Configurer

### Client (apps/client)
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
REACT_APP_CLOUDINARY_CLOUD_NAME
REACT_APP_CLOUDINARY_API_KEY
REACT_APP_PAYPAL_CLIENT_ID
EMAIL_USER
EMAIL_PASS
EMAIL_TO
```

### Admin (apps/admin)
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_CLOUDINARY_CLOUD_NAME
REACT_APP_CLOUDINARY_API_KEY
REACT_APP_CLOUDINARY_API_SECRET
REACT_APP_CLOUDINARY_UPLOAD_PRESET
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
EMAIL_USER
EMAIL_PASS
ADMIN_EMAIL
```

---

## ⚠️ Points d'Attention

### ❌ À NE PAS FAIRE
- ❌ Déployer depuis la racine du projet
- ❌ Commiter les fichiers `.env` ou `.vercel/`
- ❌ Oublier de configurer les variables d'environnement
- ❌ Déployer sans tester le build localement

### ✅ À FAIRE
- ✅ Toujours déployer depuis `apps/client` ou `apps/admin`
- ✅ Tester le build localement avant de déployer
- ✅ Utiliser les déploiements preview pour tester
- ✅ Vérifier les logs après chaque déploiement
- ✅ Documenter les nouvelles variables d'environnement

---

## 🔄 Workflow Type de Déploiement

1. **Développer et tester localement**
   ```bash
   cd apps/client  # ou apps/admin
   npm start
   ```

2. **Tester le build**
   ```bash
   npm run build
   ```

3. **Commit et push**
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```

4. **Déployer en preview** (optionnel)
   ```bash
   vercel
   ```

5. **Vérifier le preview**
   - Tester les fonctionnalités
   - Vérifier les APIs
   - Valider l'interface

6. **Déployer en production**
   ```bash
   vercel --prod
   ```

7. **Vérifier la production**
   - Tester les fonctionnalités critiques
   - Vérifier les logs : `vercel logs <url>`

---

## 🆘 En Cas de Problème

### Build échoue
1. Vérifier les logs de build
2. Tester localement : `npm run build`
3. Vérifier les dépendances : `npm install`
4. Consulter [docs/DEPLOIEMENT_VERCEL.md](docs/DEPLOIEMENT_VERCEL.md)

### Variables d'environnement manquantes
1. Lister les variables : `vercel env ls`
2. Ajouter les manquantes : `vercel env add NOM_VARIABLE`
3. Redéployer : `vercel --prod`

### APIs serverless ne fonctionnent pas
1. Vérifier `vercel.json` (routes et builds)
2. Vérifier les logs : `vercel logs <url>`
3. Tester l'API directement : `curl https://votre-url/api/endpoint`

### Cron jobs ne s'exécutent pas
1. Vérifier que vous avez un plan Vercel Pro
2. Vérifier la section `crons` dans `apps/admin/vercel.json`
3. Consulter les logs dans le dashboard Vercel

---

## 📞 Ressources

- **Documentation complète** : [docs/DEPLOIEMENT_VERCEL.md](docs/DEPLOIEMENT_VERCEL.md)
- **Workflow automatisé** : `.agent/workflows/deploy.md`
- **Vercel Docs** : https://vercel.com/docs
- **Firebase Docs** : https://firebase.google.com/docs

---

**Dernière mise à jour** : Décembre 2025

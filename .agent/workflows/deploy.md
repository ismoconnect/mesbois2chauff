---
description: Déployer l'application MesBois sur Vercel
---

# Workflow de Déploiement Vercel - MesBois 2

Ce workflow vous guide à travers le processus de déploiement des applications client et admin sur Vercel.

## Prérequis (à faire une seule fois)

### 1. Installer Vercel CLI
```bash
npm i -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
```

### 3. Lier les projets

**Client :**
```bash
cd apps/client
vercel link --yes
```

**Admin :**
```bash
cd apps/admin
vercel link --yes
```

### 4. Configurer les variables d'environnement

Référez-vous au fichier `docs/DEPLOIEMENT_VERCEL.md` section "Étape 2 : Configurer les Variables d'Environnement" pour la liste complète des variables à configurer.

## Déploiement en Production

### 1. Vérifier que tout fonctionne localement

**Tester le build du client :**
```bash
cd apps/client
npm run build
```

**Tester le build de l'admin :**
```bash
cd apps/admin
npm run build
```

### 2. Commit et push des changements

```bash
git add .
git commit -m "Description des changements"
git push
```

### 3. Déployer le Client en Production

// turbo
```bash
cd apps/client
vercel --prod
```

### 4. Déployer l'Admin en Production

// turbo
```bash
cd apps/admin
vercel --prod
```

### 5. Vérifier les déploiements

- Visitez l'URL du client fournie par Vercel
- Visitez l'URL de l'admin fournie par Vercel
- Testez les fonctionnalités critiques

## Déploiement en Preview (Test)

Pour tester avant de déployer en production :

**Client :**
```bash
cd apps/client
vercel
```

**Admin :**
```bash
cd apps/admin
vercel
```

Cela crée des URLs de preview uniques pour tester vos changements.

## Commandes Utiles

**Voir les logs :**
```bash
vercel logs <deployment-url>
```

**Lister les déploiements :**
```bash
vercel ls
```

**Voir les variables d'environnement :**
```bash
vercel env ls
```

## En cas de problème

Consultez la section "🐛 Dépannage" dans `docs/DEPLOIEMENT_VERCEL.md`

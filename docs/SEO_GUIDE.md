# Guide de Référencement Google - MesBois Client

## 1. Google Search Console (Essentiel)

### Étapes :
1. **Accéder à Google Search Console**
   - Aller sur https://search.google.com/search-console
   - Se connecter avec un compte Google

2. **Ajouter votre propriété**
   - Cliquer sur "Ajouter une propriété"
   - Choisir "Préfixe d'URL" et entrer votre URL de production
   - Exemple : `https://mesbois-client-pcv8yhput-mummys-projects-67592474.vercel.app`

3. **Vérifier la propriété**
   - **Méthode recommandée : Balise HTML**
     - Google vous donnera une balise `<meta>` à ajouter dans le `<head>` de votre site
     - Ajouter cette balise dans `apps/client/public/index.html`
   
   - **Alternative : Fichier HTML**
     - Télécharger le fichier de vérification
     - Le placer dans `apps/client/public/`

4. **Soumettre le sitemap**
   - Une fois vérifié, soumettre votre sitemap : `https://votre-domaine.com/sitemap.xml`

## 2. Créer un Sitemap.xml

Créer le fichier `apps/client/public/sitemap.xml` avec vos pages principales :

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://votre-domaine.com/</loc>
    <lastmod>2025-11-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://votre-domaine.com/products</loc>
    <lastmod>2025-11-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://votre-domaine.com/about</loc>
    <lastmod>2025-11-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://votre-domaine.com/contact</loc>
    <lastmod>2025-11-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
\`\`\`

## 3. Créer un robots.txt

Créer le fichier `apps/client/public/robots.txt` :

\`\`\`
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /payment/

Sitemap: https://votre-domaine.com/sitemap.xml
\`\`\`

## 4. Optimiser les Métadonnées SEO

### Dans chaque page importante, ajouter :

\`\`\`jsx
import { Helmet } from 'react-helmet';

<Helmet>
  <title>MesBois - Vente de bois de qualité</title>
  <meta name="description" content="Découvrez notre sélection de bois de qualité pour tous vos projets. Livraison rapide et service client expert." />
  <meta name="keywords" content="bois, vente bois, bois de construction, bois de chauffage" />
  
  {/* Open Graph pour réseaux sociaux */}
  <meta property="og:title" content="MesBois - Vente de bois de qualité" />
  <meta property="og:description" content="Découvrez notre sélection de bois de qualité" />
  <meta property="og:image" content="https://votre-domaine.com/og-image.jpg" />
  <meta property="og:url" content="https://votre-domaine.com" />
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="MesBois - Vente de bois de qualité" />
  <meta name="twitter:description" content="Découvrez notre sélection de bois de qualité" />
</Helmet>
\`\`\`

## 5. Google My Business (Si commerce local)

1. Créer un profil Google My Business : https://www.google.com/business/
2. Renseigner :
   - Nom de l'entreprise
   - Adresse physique
   - Horaires d'ouverture
   - Photos
   - Catégorie d'activité

## 6. Optimisations Techniques

### Performance
- ✅ Utiliser des images optimisées (WebP)
- ✅ Lazy loading des images
- ✅ Minification CSS/JS (déjà fait par Create React App)
- ✅ HTTPS (déjà activé sur Vercel)

### Structure
- ✅ Utiliser des balises sémantiques (`<header>`, `<nav>`, `<main>`, `<article>`)
- ✅ Hiérarchie des titres (H1 unique par page, puis H2, H3...)
- ✅ Attributs `alt` sur toutes les images
- ✅ URLs propres et descriptives

### Mobile-First
- ✅ Design responsive (déjà implémenté)
- ✅ Taille de texte lisible
- ✅ Boutons cliquables facilement

## 7. Contenu de Qualité

- Créer des descriptions de produits uniques et détaillées
- Ajouter un blog avec des articles sur le bois, l'entretien, etc.
- Mettre à jour régulièrement le contenu
- Utiliser des mots-clés pertinents naturellement

## 8. Backlinks et Réseaux Sociaux

- Partager le site sur les réseaux sociaux
- S'inscrire dans des annuaires professionnels
- Obtenir des liens depuis d'autres sites de qualité
- Créer des partenariats avec des sites complémentaires

## 9. Suivi et Analyse

### Google Analytics
1. Créer un compte : https://analytics.google.com
2. Obtenir l'ID de suivi (ex: G-XXXXXXXXXX)
3. Ajouter le script dans `apps/client/public/index.html` :

\`\`\`html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
\`\`\`

## 10. Checklist de Démarrage

- [ ] Créer un compte Google Search Console
- [ ] Vérifier la propriété du site
- [ ] Créer et soumettre le sitemap.xml
- [ ] Créer le fichier robots.txt
- [ ] Optimiser les métadonnées de toutes les pages
- [ ] Installer Google Analytics
- [ ] Créer un profil Google My Business (si applicable)
- [ ] Vérifier la vitesse du site (PageSpeed Insights)
- [ ] Tester la compatibilité mobile
- [ ] Soumettre l'URL principale à Google : https://www.google.com/ping?sitemap=https://votre-domaine.com/sitemap.xml

## Délais d'Indexation

- **Première indexation** : 1-4 semaines
- **Optimisation SEO complète** : 3-6 mois
- **Résultats significatifs** : 6-12 mois

## Outils Utiles

- **Google Search Console** : https://search.google.com/search-console
- **Google Analytics** : https://analytics.google.com
- **PageSpeed Insights** : https://pagespeed.web.dev
- **Mobile-Friendly Test** : https://search.google.com/test/mobile-friendly
- **Structured Data Testing** : https://validator.schema.org

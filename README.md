# Application Web de Vente de Bois de Chauffage

Une application web moderne et complète pour la vente de bois de chauffage, développée avec React et Firebase.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités principales
- **Catalogue de produits** avec filtres et recherche avancée
- **Système d'authentification** complet (inscription, connexion, profil)
- **Panier d'achat** avec gestion des quantités
- **Processus de commande** avec informations de livraison
- **Suivi des commandes** et historique
- **Interface responsive** et moderne
- **Système d'avis** et évaluations (à implémenter)

### 🛠 Technologies utilisées
- **Frontend**: React 18, React Router, Styled Components
- **Backend**: Firebase (Firestore, Authentication, Functions)
- **Gestion d'état**: Context API
- **Notifications**: React Hot Toast
- **Icônes**: React Icons
- **Animations**: Framer Motion

## 📦 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Compte Firebase

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd bois-de-chauffage
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Firebase

#### 3.1 Créer un projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Activez les services suivants :
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage** (optionnel pour les images)

#### 3.2 Configurer les règles Firestore
```javascript
// Règles d'authentification
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs peuvent lire/écrire leurs propres données
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Produits lisibles par tous
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Commandes
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.role == 'admin');
    }
    
    // Avis
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.role == 'admin');
    }
  }
}
```

#### 3.3 Mettre à jour la configuration Firebase
Éditez le fichier `src/firebase/config.js` avec vos clés Firebase :

```javascript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};
```

### 4. Données de test

#### 4.1 Créer des catégories
Dans Firestore, créez une collection `categories` avec les documents suivants :

```javascript
// categories/bûches
{
  name: "Bûches",
  description: "Bûches de bois de chauffage",
  image: "url-de-l-image"
}

// categories/granulés
{
  name: "Granulés",
  description: "Granulés de bois",
  image: "url-de-l-image"
}
```

#### 4.2 Créer des produits
Dans Firestore, créez une collection `products` avec des documents comme :

```javascript
{
  name: "Bûches de Chêne",
  description: "Bûches de chêne séchées, idéales pour le chauffage",
  price: 45.99,
  category: "bûches",
  type: "chêne",
  stock: 100,
  image: "url-de-l-image",
  rating: 4.5,
  reviewCount: 25,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### 5. Lancer l'application
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🏗 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout/          # Header, Footer, Layout
│   └── Products/        # ProductCard, etc.
├── contexts/            # Contextes React (Auth, Cart)
├── firebase/            # Configuration et services Firebase
├── hooks/               # Hooks personnalisés
├── pages/               # Pages de l'application
└── App.js              # Composant principal
```

## 🔧 Configuration avancée

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_FIREBASE_API_KEY=votre-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=votre-projet-id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=votre-app-id
```

### Déploiement

#### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Ajoutez les variables d'environnement dans les paramètres Vercel
3. Déployez automatiquement

#### Netlify
1. Connectez votre repository à Netlify
2. Configurez les variables d'environnement
3. Déployez

## 📱 Fonctionnalités à implémenter

### Phase 2 (Optionnelles)
- [ ] **Système de paiement** (Stripe, PayPal)
- [ ] **Notifications push** (Firebase Cloud Messaging)
- [ ] **Chat en direct** (Firebase Realtime Database)
- [ ] **Blog/Actualités**
- [ ] **Gestion des stocks** en temps réel
- [ ] **Système de fidélité**
- [ ] **API REST** pour mobile

### Améliorations techniques
- [ ] **Tests unitaires** (Jest, React Testing Library)
- [ ] **Tests d'intégration**
- [ ] **PWA** (Progressive Web App)
- [ ] **Optimisation SEO**
- [ ] **Analytics** (Google Analytics)

## 🛡 Sécurité

### Bonnes pratiques implémentées
- Authentification Firebase sécurisée
- Règles Firestore restrictives
- Validation des données côté client
- Protection CSRF
- Gestion des erreurs

### Recommandations
- Implémenter la validation côté serveur
- Ajouter un système de logs
- Configurer un CDN pour les images
- Mettre en place un monitoring

## 📞 Support

Pour toute question ou problème :
- Email : contact@boisdechauffage.fr
- Documentation Firebase : [firebase.google.com/docs](https://firebase.google.com/docs)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour la vente de bois de chauffage**

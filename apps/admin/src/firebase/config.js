// Firebase config for Admin app
// On aligne la configuration avec celle du client pour utiliser
// le même projet Firebase (mesbois-2) quand les variables d'env
// ne sont pas définies.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAsZ-PzFzZnEseovRojBT92uLNkE-DJyNU',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mesbois-2.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mesbois-2',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mesbois-2.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '102290138304',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:102290138304:web:0b5f44391cc1fea6baf925'
};

const app = initializeApp(firebaseConfig);

// Comme sur le client, on permet de forcer le long polling si nécessaire
let dbInstance;
if (process.env.REACT_APP_FIRESTORE_FORCE_LONG_POLLING === 'true') {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false
  });
} else {
  dbInstance = getFirestore(app);
}

export const auth = getAuth(app);
export const db = dbInstance;

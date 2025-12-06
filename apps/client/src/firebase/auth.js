import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Créer un compte utilisateur
export const createUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    await updateProfile(user, {
      displayName: userData.displayName
    });
    
    // Créer le document utilisateur dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName,
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      country: userData.country || 'France',
      createdAt: new Date(),
      role: 'customer',
      preferences: {
        emailOrderUpdates: true,
        emailPromotions: false
      }
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Connexion utilisateur
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Déconnexion utilisateur
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les données utilisateur
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: 'https://jeferco.boisdechauffages.com/auth/action',
      handleCodeInApp: true
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Observer les changements d'état d'authentification
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Mettre à jour les données profil utilisateur
export const updateUserData = async (uid, data) => {
  try {
    const payload = {};

    if ('displayName' in data) {
      payload.displayName = data.displayName || '';
    }
    if ('phone' in data) {
      payload.phone = data.phone || '';
    }
    if ('address' in data) {
      payload.address = data.address || '';
    }
    if ('city' in data) {
      payload.city = data.city || '';
    }
    if ('postalCode' in data) {
      payload.postalCode = data.postalCode || '';
    }
    if ('country' in data) {
      payload.country = data.country || 'France';
    }
    if ('preferences' in data) {
      payload.preferences = {
        emailOrderUpdates: !!data.preferences?.emailOrderUpdates,
        emailPromotions: !!data.preferences?.emailPromotions
      };
    }

    // Mettre à jour le document Firestore (merge pour conserver les autres champs)
    await setDoc(doc(db, 'users', uid), payload, { merge: true });

    // Mettre à jour le profil Firebase Auth (affichage du nom)
    if (auth.currentUser && 'displayName' in data) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName || ''
      });
    }

    // Retourner les nouvelles données à jour
    const snap = await getDoc(doc(db, 'users', uid));
    const freshData = snap.exists() ? snap.data() : null;

    return { success: true, data: freshData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Changer le mot de passe de l'utilisateur connecté
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    return { success: false, error: 'Utilisateur non connecté' };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';

export const initImages = async () => {
  try {
    // Vérifier si le document existe déjà
    const homeRef = doc(db, 'settings', 'home');
    const homeSnap = await getDoc(homeRef);
    
    if (!homeSnap.exists()) {
      // Initialiser avec des images par défaut
      const defaultImages = {
        categoryImages: {
          bois: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
          accessoires: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
          buches_densifiees: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
          pellets: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
          poeles: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop"
        },
        updatedAt: new Date()
      };
      
      await setDoc(homeRef, defaultImages);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

export const debugImages = async () => {
  try {
    const homeRef = doc(db, 'settings', 'home');
    const homeSnap = await getDoc(homeRef);
    if (homeSnap.exists()) {
      const data = homeSnap.data();
      // no-op
    }
    
    const productsSnap = await getDocs(collection(db, 'products'));
    
  } catch (error) {
    
  }
};
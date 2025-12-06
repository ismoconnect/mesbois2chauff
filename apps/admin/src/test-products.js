import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

export const testProducts = async () => {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    
    return productsSnap.docs.length;
  } catch (error) {
    return 0;
  }
};
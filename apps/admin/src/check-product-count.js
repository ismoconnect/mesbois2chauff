import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

export const checkProductCount = async () => {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    
    // Count by category
    const categories = {};
    productsSnap.docs.forEach(doc => {
      const data = doc.data();
      const category = data.category || 'unknown';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return productsSnap.docs.length;
  } catch (error) {
    return 0;
  }
};

// Run immediately if this file is executed directly
if (typeof window === 'undefined') {
  checkProductCount();
}
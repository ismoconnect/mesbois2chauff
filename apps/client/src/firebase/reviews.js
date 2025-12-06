import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// Ajouter un avis
export const addReview = async (reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { success: true, id: reviewRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les avis d'un produit
export const getProductReviews = async (productId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: reviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les avis d'un utilisateur
export const getUserReviews = async (userId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: reviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mettre à jour un avis
export const updateReview = async (reviewId, reviewData) => {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      ...reviewData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Supprimer un avis
export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Calculer la note moyenne d'un produit
export const getProductAverageRating = async (productId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );
    
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => doc.data());
    
    if (reviews.length === 0) {
      return { success: true, data: { average: 0, count: 0 } };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    return { 
      success: true, 
      data: { 
        average: Math.round(averageRating * 10) / 10, 
        count: reviews.length 
      } 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


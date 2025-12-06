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
  
} from 'firebase/firestore';
import { db } from './config';

// Remove unsupported Firestore values: undefined/NaN; clean nested objects/arrays
const sanitizeForFirestore = (input) => {
  const sanitize = (val) => {
    if (val === undefined) return undefined;
    if (val === null) return null;
    if (typeof val === 'number' && !Number.isFinite(val)) return null;
    if (Array.isArray(val)) {
      const arr = val.map(sanitize).filter((v) => v !== undefined);
      return arr;
    }
    if (val && typeof val === 'object') {
      const out = {};
      Object.keys(val).forEach((k) => {
        const v = sanitize(val[k]);
        if (v !== undefined) out[k] = v;
      });
      return out;
    }
    return val;
  };
  return sanitize(input);
};

// Créer une commande
export const createOrder = async (orderData) => {
  try {
    const cleaned = sanitizeForFirestore(orderData);
    const now = new Date();
    const payload = {
      ...cleaned,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    const orderRef = await addDoc(collection(db, 'orders'), payload);
    
    return { success: true, id: orderRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les commandes d'un utilisateur
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir une commande par ID
export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      return { 
        success: true, 
        data: { id: orderDoc.id, ...orderDoc.data() } 
      };
    } else {
      return { success: false, error: 'Commande non trouvée' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, status, trackingInfo = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (trackingInfo) {
      updateData.trackingInfo = trackingInfo;
    }
    
    await updateDoc(doc(db, 'orders', orderId), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir toutes les commandes (admin)
export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Annuler une commande
export const cancelOrder = async (orderId, reason) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


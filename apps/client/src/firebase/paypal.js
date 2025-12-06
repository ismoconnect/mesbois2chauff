import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Returns { email, instructions } from collection 'paypal' doc 'default'.
export async function getPaypalInfo() {
  try {
    const ref = doc(db, 'paypal', 'default');
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { success: false, error: 'Infos PayPal introuvables' };
    }
    const data = snap.data() || {};
    return {
      success: true,
      data: {
        email: data.email || '',
        instructions: data.instructions || ''
      }
    };
  } catch (e) {
    return { success: false, error: e?.message || 'Erreur de chargement PayPal' };
  }
}

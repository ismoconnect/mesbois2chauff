import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Returns { holder, iban, bic, bank } from collection 'rib' doc 'default'.
export async function getRIB() {
  try {
    const ref = doc(db, 'rib', 'default');
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { success: false, error: 'RIB introuvable' };
    }
    const data = snap.data() || {};
    return {
      success: true,
      data: {
        holder: data.holder || '',
        iban: data.iban || '',
        bic: data.bic || '',
        bank: data.bank || ''
      }
    };
  } catch (e) {
    return { success: false, error: e?.message || 'Erreur de chargement du RIB' };
  }
}

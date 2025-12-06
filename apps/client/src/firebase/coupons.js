import { db } from './config';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// Coupon shape expected in Firestore (settings/coupons):
// { code: string, type: 'percent' | 'fixed', value: number, minTotal?: number, expiresAt?: Timestamp, usageLimit?: number, active?: boolean }

export const getCouponByCode = async (code) => {
  try {
    const entered = (code || '').trim();
    const upper = entered.toUpperCase();

    const couponsCol = collection(db, 'settings', 'coupons', 'items');
    // Try with UPPER code
    let q = query(couponsCol, where('code', '==', upper));
    let snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    // Try with raw entered code
    q = query(couponsCol, where('code', '==', entered));
    snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }

    // Fallback: allow a root-level collection 'coupons/{CODE}'
    const direct = await getDoc(doc(db, 'coupons', upper));
    if (direct.exists()) {
      return { success: true, data: { id: direct.id, ...direct.data() } };
    }
    // Also allow querying root 'coupons' by field
    const rootCol = collection(db, 'coupons');
    q = query(rootCol, where('code', '==', upper));
    snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    q = query(rootCol, where('code', '==', entered));
    snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }

    return { success: false, error: 'Code promo introuvable' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const validateAndComputeDiscount = (coupon, subtotal) => {
  if (!coupon) return { valid: false, discount: 0, reason: 'Aucun coupon' };
  if (coupon.active === false) return { valid: false, discount: 0, reason: 'Coupon inactif' };

  const now = Date.now();
  const expiresAtMs = coupon.expiresAt?.toMillis ? coupon.expiresAt.toMillis() : (coupon.expiresAt ? new Date(coupon.expiresAt).getTime() : undefined);
  if (expiresAtMs && now > expiresAtMs) return { valid: false, discount: 0, reason: 'Coupon expiré' };

  const minTotal = typeof coupon.minTotal === 'number' ? coupon.minTotal : 0;
  if (subtotal < minTotal) return { valid: false, discount: 0, reason: `Montant minimum ${minTotal}€` };

  const type = coupon.type || 'percent';
  const value = Number(coupon.value || 0);
  let discount = 0;
  if (type === 'percent') {
    discount = Math.max(0, Math.min(subtotal, subtotal * (value / 100)));
  } else {
    discount = Math.max(0, Math.min(subtotal, value));
  }

  return { valid: discount > 0, discount, reason: '' };
};

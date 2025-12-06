import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const hasHydratedRef = useRef(false);

  // Normaliser les items pour Firestore (éviter toute valeur undefined)
  const normalizeCartItems = (items = []) => {
    try {
      return items.map((it) => ({
        id: it?.id || '',
        name: typeof it?.name === 'string' ? it.name : '',
        price: Number(it?.price ?? 0),
        image: typeof it?.image === 'string' ? it.image : '',
        quantity: Number(it?.quantity ?? 1),
      }));
    } catch {
      return [];
    }
  };

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('bois-de-chauffage-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {}
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque changement
  useEffect(() => {
    // Première exécution après montage : marquer comme hydraté sans écrire
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }
    localStorage.setItem('bois-de-chauffage-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Synchronisation Firestore lorsque l'utilisateur est connecté
  useEffect(() => {
    let unsubFn;

    const setup = async () => {
      if (!user) return; // pas connecté: rester en localStorage

      const cartRef = doc(db, 'carts', user.uid);
      try {
        const snap = await getDoc(cartRef);

        if (snap.exists()) {
          const remoteItems = snap.data()?.items || [];
          // Merge local->remote (priorité à la plus grande quantity)
          const map = new Map();
          for (const it of remoteItems) map.set(it.id, it);
          const localStr = localStorage.getItem('bois-de-chauffage-cart');
          const localItems = (() => { try { return JSON.parse(localStr || '[]'); } catch { return []; } })();
          for (const it of localItems) {
            const prev = map.get(it.id);
            if (!prev) map.set(it.id, it);
            else map.set(it.id, { ...prev, quantity: Math.max(prev.quantity || 0, it.quantity || 0) });
          }
          const merged = Array.from(map.values());
          setCartItems(merged);
          try {
            const displayName = (user?.displayName || '').trim();
            const firstName = displayName ? displayName.split(' ')[0] : '';
            const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
            await setDoc(cartRef, { items: normalizeCartItems(merged), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
          } catch (e) {}
        } else {
          const localStr = localStorage.getItem('bois-de-chauffage-cart');
          const localItems = (() => { try { return JSON.parse(localStr || '[]'); } catch { return []; } })();
          try {
            const displayName = (user?.displayName || '').trim();
            const firstName = displayName ? displayName.split(' ')[0] : '';
            const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
            await setDoc(cartRef, { items: normalizeCartItems(localItems), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
          } catch (e) {}
        }

        unsubFn = onSnapshot(cartRef, (docSnap) => {
          if (!docSnap.exists()) return;

          const data = docSnap.data();
          const items = Array.isArray(data.items) ? data.items : [];

          // Ne pas écraser le panier local avec un tableau vide
          if (!items.length) return;

          setCartItems(items);
        }, (e) => {});
      } catch (e) {
        
        return; // rester en local
      }
    };

    setup();

    return () => {
      if (typeof unsubFn === 'function') {
        unsubFn();
      }
    };
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // Persist Firestore si connecté
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          const displayName = (user?.displayName || '').trim();
          const firstName = displayName ? displayName.split(' ')[0] : '';
          const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
          setDoc(cartRef, { items: normalizeCartItems(newItems), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
        }
        return newItems;
      } else {
        const newItems = [...prevItems, { ...product, quantity }];
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          const displayName = (user?.displayName || '').trim();
          const firstName = displayName ? displayName.split(' ')[0] : '';
          const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
          setDoc(cartRef, { items: normalizeCartItems(newItems), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
        }
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        const displayName = (user?.displayName || '').trim();
        const firstName = displayName ? displayName.split(' ')[0] : '';
        const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
        setDoc(cartRef, { items: normalizeCartItems(newItems), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
      }
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        const displayName = (user?.displayName || '').trim();
        const firstName = displayName ? displayName.split(' ')[0] : '';
        const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
        setDoc(cartRef, { items: normalizeCartItems(newItems), updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      const displayName = (user?.displayName || '').trim();
      const firstName = displayName ? displayName.split(' ')[0] : '';
      const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
      setDoc(cartRef, { items: [], updatedAt: serverTimestamp(), email: user?.email || '', name: `${firstName} ${lastName}`.trim() }, { merge: true });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return total + price * qty;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


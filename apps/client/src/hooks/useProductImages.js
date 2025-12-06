import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const CACHE_KEY = 'mesbois:productImages:v1';

export const useProductImages = () => {
  const [productImages, setProductImages] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      // backward compatible: stored value may be either the images map or { images, savedAt }
      if (parsed && typeof parsed === 'object') {
        if (parsed.images && typeof parsed.images === 'object') return parsed.images;
        return parsed;
      }
      return {};
    } catch (e) {
      return {};
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const saveCache = (images) => {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          // store images along with meta (savedAt + cacheBuster when available)
          const existingRaw = sessionStorage.getItem(CACHE_KEY);
          let existing = null;
          try { existing = existingRaw ? JSON.parse(existingRaw) : null; } catch(e) { existing = null; }
          const payload = { images: images || {}, savedAt: new Date().toISOString(), cacheBuster: existing && existing.cacheBuster ? existing.cacheBuster : null };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        }
      } catch (e) {
        // ignore cache errors
      }
    };

    const setupListener = async () => {
      try {
        const ref = doc(db, 'settings', 'productImages');

        console.log('🔍 useProductImages: Initialisation du listener...');
        let onSnapshotFired = false;

        // onSnapshot pour mises à jour en temps réel
        unsubscribe = onSnapshot(ref, (snapshot) => {
          onSnapshotFired = true;
          if (snapshot.exists()) {
            const data = snapshot.data() || {};
            const images = data.images || {};
            console.debug('productImages onSnapshot keys:', Object.keys(images).length);
            setProductImages(images);
            saveCache(images);
          } else {
            console.warn('⚠️ productImages document introuvable (onSnapshot). Conserver le cache/état actuel.');
          }
          setLoading(false);
        }, (error) => {
          console.error('❌ Erreur onSnapshot productImages:', error);
          // On ne vide pas l'état en cas d'erreur réseau
          setLoading(false);
        });

        // Immediate check: comparer updatedAt ou cacheBuster du document à ce qui est en cache
        try {
          const cachedRaw = typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem(CACHE_KEY);
          const cached = cachedRaw ? JSON.parse(cachedRaw) : null;
          const docSnapImmediate = await getDoc(ref);
          if (docSnapImmediate.exists()) {
            const dataImmediate = docSnapImmediate.data() || {};
            const docUpdated = dataImmediate.updatedAt ? (dataImmediate.updatedAt.toDate ? dataImmediate.updatedAt.toDate().getTime() : new Date(dataImmediate.updatedAt).getTime()) : null;
            const docCacheBuster = dataImmediate.cacheBuster || null;
            const cachedTime = cached && cached.savedAt ? new Date(cached.savedAt).getTime() : null;
            const cachedBuster = cached && cached.cacheBuster ? cached.cacheBuster : null;

            const shouldUpdateByBuster = docCacheBuster && (!cachedBuster || docCacheBuster !== cachedBuster);
            const shouldUpdateByTime = !cachedTime || (docUpdated && docUpdated > cachedTime);

            if (shouldUpdateByBuster || shouldUpdateByTime) {
              const images = dataImmediate.images || {};
              console.log('🔁 getDoc immediate: document plus récent que le cache (buster/time), mise à jour du state');
              setProductImages(images);
              // save cache and include cacheBuster
              try {
                const payload = { images: images || {}, savedAt: new Date().toISOString(), cacheBuster: docCacheBuster || null };
                if (typeof window !== 'undefined' && window.sessionStorage) sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
              } catch (e) {}
              setLoading(false);
            }
          }
        } catch (immediateError) {
          // ignore immediate get errors — ne pas vider l'état
          console.warn('⚠️ getDoc immediate échoué:', immediateError && immediateError.message);
        }

        // Fallback: si onSnapshot n'a pas répondu dans X ms, tenter getDoc mais ne pas écraser l'état si absent
        const fallbackDelay = 1200;
        setTimeout(async () => {
          if (onSnapshotFired) return;
          try {
            const snap = await getDoc(ref);
            if (snap.exists()) {
              const data = snap.data() || {};
              const images = data.images || {};
              console.log('✅ getDoc fallback: images chargées', Object.keys(images).length);
              setProductImages(images);
              saveCache(images);
            } else {
              console.warn('⚠️ getDoc fallback: document non trouvé. Conserver cache/état.');
            }
          } catch (fallbackError) {
            console.warn('⚠️ getDoc fallback échoué:', fallbackError.message);
          } finally {
            setLoading(false);
          }
        }, fallbackDelay);

      } catch (error) {
        console.error('❌ Erreur setup listener:', error);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Debug log
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugImages') === '1') {
    console.log('🖼️  useProductImages hook state:', {
      loading,
      imageCount: Object.keys(productImages).length,
      sampleIds: Object.keys(productImages).slice(0, 3),
    });
  }

  return { productImages, loading };
};

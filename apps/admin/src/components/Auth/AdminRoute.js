import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Écouter l'état d'authentification pour que la session
    // soit restaurée correctement après un rafraîchissement.
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser || null);

      if (!fbUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'admins', fbUser.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        setIsAdmin(!!data && (data.enabled === undefined || data.enabled === true));
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;

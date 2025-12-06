import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserData, signInUser, createUser, signOutUser, resetPassword } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Récupérer les données utilisateur depuis Firestore
        const userDataResult = await getUserData(firebaseUser.uid);
        if (userDataResult.success) {
          setUserData(userDataResult.data);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await signInUser(email, password);
    if (res.success) {
      setUser(res.user);
      const userDataResult = await getUserData(res.user.uid);
      if (userDataResult.success) setUserData(userDataResult.data);
    }
    return res;
  };

  const register = async (email, password, extraData) => {
    const res = await createUser(email, password, extraData);
    if (res.success) {
      setUser(res.user);
      const userDataResult = await getUserData(res.user.uid);
      if (userDataResult.success) setUserData(userDataResult.data);
    }
    return res;
  };

  const logout = async () => {
    const res = await signOutUser();
    if (res.success) {
      setUser(null);
      setUserData(null);
    }
    return res;
  };

  const requestPasswordReset = async (email) => {
    return await resetPassword(email);
  };

  const value = {
    user,
    userData,
    loading,
    setUserData,
    login,
    register,
    logout,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


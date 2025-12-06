import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SiteSettingsContext = createContext(null);

const defaultSettings = {
  siteName: '',
  supportEmail: '',
  supportPhone: '',
  legalCompanyName: '',
  legalAddress: '',
  legalDirector: '',
  legalSiteUrl: '',
  legalContactEmail: '',
  legalDpoEmail: '',
  legalCompanyForm: '',
  legalSiren: '',
  legalSiret: '',
  legalRcs: '',
  legalVatNumber: '',
  hostName: '',
  hostAddress: ''
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, 'settings', 'global');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        // on garde les valeurs par défaut en cas d'erreur
      } finally {
        setLoaded(true);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    return { settings: defaultSettings, loaded: false };
  }
  return ctx;
};

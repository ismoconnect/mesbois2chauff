import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationES from './locales/es/translation.json';
import translationIT from './locales/it/translation.json';
import translationPT from './locales/pt/translation.json';
import translationNL from './locales/nl/translation.json';

const resources = {
    en: { translation: translationEN },
    fr: { translation: translationFR },
    de: { translation: translationDE },
    es: { translation: translationES },
    it: { translation: translationIT },
    pt: { translation: translationPT },
    nl: { translation: translationNL },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        supportedLngs: ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'],
        detection: {
            order: ['path', 'localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

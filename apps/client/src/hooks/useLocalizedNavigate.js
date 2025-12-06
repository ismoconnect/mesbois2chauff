import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer la navigation avec les routes localisées
 */
export const useLocalizedNavigate = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const localizedNavigate = (path, options) => {
        const lang = i18n.language || 'fr';
        const localizedPath = `/${lang}${path.startsWith('/') ? path : '/' + path}`;
        navigate(localizedPath, options);
    };

    return localizedNavigate;
};

/**
 * Fonction helper pour créer des chemins localisés
 */
export const getLocalizedPath = (path, lang) => {
    if (!lang) lang = localStorage.getItem('i18nextLng') || 'fr';
    return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
};

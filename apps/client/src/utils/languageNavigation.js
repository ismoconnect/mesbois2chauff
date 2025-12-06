import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Hook personnalisé pour la navigation avec support multilingue
 * Préserve automatiquement le préfixe de langue lors de la navigation
 */
export const useLanguageNavigate = () => {
    const navigate = useNavigate();
    const { lang } = useParams();
    const { i18n } = useTranslation();

    // Utilise la langue de l'URL, sinon celle de i18n, sinon 'fr' par défaut
    const currentLang = lang || i18n.language?.split('-')[0] || 'fr';

    /**
     * Navigue vers une route en ajoutant automatiquement le préfixe de langue
     * @param {string} path - Le chemin sans préfixe de langue (ex: '/products', '/about')
     * @param {object} options - Options de navigation (replace, state, etc.)
     */
    const navigateWithLang = (path, options = {}) => {
        // Enlève le slash initial si présent
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;

        // Construit le chemin complet avec la langue
        const fullPath = `/${currentLang}/${cleanPath}`;

        navigate(fullPath, options);
    };

    return navigateWithLang;
};

/**
 * Utilitaire pour construire des URLs avec préfixe de langue
 * @param {string} lang - Code de langue (ex: 'fr', 'de', 'nl')
 * @param {string} path - Chemin sans préfixe de langue
 * @returns {string} URL complète avec préfixe de langue
 */
export const buildLangUrl = (lang, path) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${lang}/${cleanPath}`;
};

/**
 * Extrait le chemin sans le préfixe de langue
 * @param {string} pathname - Chemin complet (ex: '/fr/products')
 * @returns {string} Chemin sans langue (ex: '/products')
 */
export const getPathWithoutLang = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    const langCodes = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];

    if (parts.length > 0 && langCodes.includes(parts[0])) {
        parts.shift();
    }

    return '/' + parts.join('/');
};

/**
 * Extrait le code de langue du pathname
 * @param {string} pathname - Chemin complet (ex: '/fr/products')
 * @returns {string|null} Code de langue ou null si non trouvé
 */
export const getLangFromPath = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    const langCodes = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];

    if (parts.length > 0 && langCodes.includes(parts[0])) {
        return parts[0];
    }

    return null;
};

/**
 * Vérifie si deux chemins pointent vers la même route (sans tenir compte de la langue)
 * @param {string} path1 - Premier chemin
 * @param {string} path2 - Deuxième chemin
 * @returns {boolean} True si les routes sont identiques
 */
export const isSameRoute = (path1, path2) => {
    return getPathWithoutLang(path1) === getPathWithoutLang(path2);
};

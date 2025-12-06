import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Composant Link qui ajoute automatiquement le préfixe de langue
 */
export const LocalizedLink = ({ to, children, ...props }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'fr';

    // Si le lien commence déjà par une langue, ne pas ajouter de préfixe
    const languages = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];
    const pathParts = to.split('/').filter(Boolean);
    const hasLangPrefix = languages.includes(pathParts[0]);

    const localizedTo = hasLangPrefix ? to : `/${lang}${to.startsWith('/') ? to : '/' + to}`;

    return (
        <RouterLink to={localizedTo} {...props}>
            {children}
        </RouterLink>
    );
};

export default LocalizedLink;

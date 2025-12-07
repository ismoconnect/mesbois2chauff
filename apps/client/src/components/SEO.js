import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * SEO Component - Manages meta tags for multilingual SEO
 * Automatically updates title, description, and Open Graph tags based on current language
 */
const SEO = ({
    titleKey = 'seo.default_title',
    descriptionKey = 'seo.default_description',
    customTitle,
    customDescription
}) => {
    const { t, i18n } = useTranslation();
    const { lang } = useParams();
    const currentLang = lang || i18n.language || 'fr';

    const title = customTitle || t(titleKey);
    const description = customDescription || t(descriptionKey);
    const siteName = 'brennholzkaufen';
    const siteUrl = 'https://webshopbrennholzkaufen.boisdechauffages.com';

    return (
        <Helmet>
            <html lang={currentLang} />
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${siteUrl}/${currentLang}`} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default SEO;

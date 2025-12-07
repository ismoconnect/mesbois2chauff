import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import styled, { css } from 'styled-components';
import Footer from './Footer';
import SEO from '../SEO';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  /* Desktop: offset for fixed TopBar + Header */
  @media (min-width: 769px) {
    padding-top: 122px;
  }
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
  
  @media (max-width: 480px) {
    padding-top: 55px;
  }
  
  @media (max-width: 375px) {
    padding-top: 50px;
  }

  /* When header is hidden, reduce the top padding so content sits closer to top */
  ${({ $noHeader }) => $noHeader && css`
    @media (min-width: 769px) {
      padding-top: 24px;
    }
    @media (max-width: 768px) {
      padding-top: 16px;
    }
    @media (max-width: 480px) {
      padding-top: 12px;
    }
    @media (max-width: 375px) {
      padding-top: 10px;
    }
  `}
`;

const MainContent = styled.main`
  flex: 1;
  background: #FFFFFF;
  padding-bottom: 56px;
  
  @media (max-width: 768px) {
    padding-bottom: 44px;
  }
  
  @media (max-width: 480px) {
    padding-bottom: 36px;
  }
`;

const Layout = ({ children, $noHeader }) => {
  const location = useLocation();
  const prevPathnameRef = React.useRef(null);

  useEffect(() => {
    // Extract pathname without language prefix
    const getPathWithoutLang = (path) => {
      const parts = path.split('/').filter(Boolean);
      const langCodes = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];
      if (parts.length > 0 && langCodes.includes(parts[0])) {
        parts.shift();
      }
      return '/' + parts.join('/');
    };

    const currentPathWithoutLang = getPathWithoutLang(location.pathname);
    const prevPathWithoutLang = prevPathnameRef.current ? getPathWithoutLang(prevPathnameRef.current) : null;

    // Sauvegarder la position de scroll actuelle avant de changer
    if (prevPathnameRef.current) {
      try {
        sessionStorage.setItem(`scroll_${prevPathnameRef.current}`, window.scrollY.toString());
      } catch (e) {
        // Ignorer les erreurs de sessionStorage
      }
    }

    // Only scroll if the actual route changed (not just the language)
    if (prevPathWithoutLang !== null && currentPathWithoutLang !== prevPathWithoutLang) {
      // Essayer de restaurer la position sauvegardée
      try {
        const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);

        if (savedPosition !== null) {
          // Utiliser setTimeout pour laisser le contenu se charger
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPosition, 10),
              left: 0,
              behavior: 'auto'
            });
          }, 50);
        } else {
          // Nouvelle page - scroll en haut
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      } catch (e) {
        // En cas d'erreur, scroll en haut par défaut
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }

    prevPathnameRef.current = location.pathname;
  }, [location.pathname]);

  const { t } = useTranslation();

  return (
    <LayoutContainer $noHeader={$noHeader}>
      <SEO />
      <MainContent>
        {children}
      </MainContent>

      <Footer />
    </LayoutContainer>
  );
};

export default Layout;

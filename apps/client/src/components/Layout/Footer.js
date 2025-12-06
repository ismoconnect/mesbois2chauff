import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const FooterContainer = styled.footer`
  background: #2c5530;
  color: white;
  padding: 40px 0 20px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    padding: 30px 0 15px;
    margin-top: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 25px 0 12px;
    margin-top: 30px;
  }
  
  @media (max-width: 375px) {
    padding: 20px 0 10px;
    margin-top: 25px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    padding: 0 12px;
  }
  
  @media (max-width: 375px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    padding: 0 10px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #fff;
    
    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 12px;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      font-size: 13px;
      margin-bottom: 10px;
    }
    
    @media (max-width: 375px) {
      font-size: 12px;
      margin-bottom: 8px;
    }
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
    color: #e0e0e0;
    
    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 1.4;
      margin-bottom: 10px;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    
    @media (max-width: 375px) {
      font-size: 10px;
      line-height: 1.2;
      margin-bottom: 6px;
    }
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: #e0e0e0;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 5px;
  }
  
  @media (max-width: 375px) {
    font-size: 10px;
    margin-bottom: 4px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #e0e0e0;
  
  svg {
    margin-right: 10px;
    color: #4a7c59;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 8px;
    justify-content: center;
    
    svg {
      margin-right: 6px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 6px;
    
    svg {
      margin-right: 4px;
    }
  }
  
  @media (max-width: 375px) {
    font-size: 10px;
    margin-bottom: 5px;
    
    svg {
      margin-right: 3px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 12px;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 10px;
  }
  
  @media (max-width: 375px) {
    gap: 6px;
    margin-top: 8px;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 375px) {
    width: 26px;
    height: 26px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  color: #e0e0e0;
  
  @media (max-width: 768px) {
    margin-top: 30px;
    padding-top: 15px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    margin-top: 25px;
    padding-top: 12px;
    font-size: 13px;
  }
  
  @media (max-width: 375px) {
    margin-top: 20px;
    padding-top: 10px;
    font-size: 12px;
  }
`;

const Footer = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { settings, loaded } = useSiteSettings();
  const siteName = loaded ? (settings.siteName || '') : '';
  const footerAddress = loaded ? (settings.legalAddress || '') : '';
  const footerPhone = loaded ? (settings.supportPhone || '') : '';
  const footerEmail = loaded ? (settings.supportEmail || '') : '';

  // Helper to get current language from URL
  const getCurrentLang = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const supportedLangs = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];
    return supportedLangs.includes(pathParts[0]) ? pathParts[0] : 'fr';
  };

  // Helper to create localized path
  const getLocalizedPath = (path) => {
    const lang = getCurrentLang();
    return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>{siteName}</h3>
          <p>
            {t('footer.footer_description')}
          </p>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <FiFacebook size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FiTwitter size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FiInstagram size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>{t('footer.footer_categories')}</h3>
          <FooterLink to={getLocalizedPath('/products?main=bois')}>{t('footer.footer_firewood')}</FooterLink>
          <FooterLink to={getLocalizedPath('/products?main=accessoires')}>{t('footer.footer_accessories')}</FooterLink>
          <FooterLink to={getLocalizedPath('/products?main=buches-densifiees')}>{t('footer.footer_compressed_logs')}</FooterLink>
          <FooterLink to={getLocalizedPath('/products?main=pellets')}>{t('footer.footer_pellets')}</FooterLink>
          <FooterLink to={getLocalizedPath('/products?main=poeles')}>{t('footer.footer_stoves')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>{t('footer.footer_information')}</h3>
          <FooterLink to={getLocalizedPath('/legal')}>{t('footer.footer_legal')}</FooterLink>
          <FooterLink to={getLocalizedPath('/delivery')}>{t('footer.footer_delivery_policy')}</FooterLink>
          <FooterLink to={getLocalizedPath('/privacy')}>{t('footer.footer_privacy_policy')}</FooterLink>
          <FooterLink to={getLocalizedPath('/returns')}>{t('footer.footer_returns')}</FooterLink>
          <FooterLink to={getLocalizedPath('/terms')}>{t('footer.footer_terms')}</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>{t('footer.footer_contact')}</h3>
          <ContactInfo>
            <FiMapPin size={16} />
            <span>{footerAddress}</span>
          </ContactInfo>
          <ContactInfo>
            <FiPhone size={16} />
            <span>{footerPhone}</span>
          </ContactInfo>
          <ContactInfo>
            <FiMail size={16} />
            <span>{footerEmail}</span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 {siteName}. {t('footer.footer_rights')}</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;


import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 80px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #1f2933;
`;

const Text = styled.p`
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 8px;
`;

const List = styled.ul`
  margin: 0 0 8px 20px;
  color: #4b5563;
  line-height: 1.7;
`;

const Legal = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';

  const { settings, loaded } = useSiteSettings();
  const companyName = loaded ? (settings.legalCompanyName || '') : '';
  const legalAddress = loaded ? (settings.legalAddress || '') : '';
  const legalSiteUrl = loaded ? (settings.legalSiteUrl || '') : '';
  const legalContactEmail = loaded ? (settings.legalContactEmail || '') : '';
  const legalDpoEmail = loaded ? (settings.legalDpoEmail || '') : '';
  const legalDirector = loaded ? (settings.legalDirector || '') : '';
  const legalCompanyForm = loaded ? (settings.legalCompanyForm || '') : '';
  const legalSiren = loaded ? (settings.legalSiren || '') : '';
  const legalSiret = loaded ? (settings.legalSiret || '') : '';
  const legalRcs = loaded ? (settings.legalRcs || '') : '';
  const legalVatNumber = loaded ? (settings.legalVatNumber || '') : '';
  const hostName = loaded ? (settings.hostName || '') : '';
  const hostAddress = loaded ? (settings.hostAddress || '') : '';

  // Sync i18n language with URL parameter
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <Container>
      <Title>{t('legal.page_title')}</Title>

      <SectionTitle>{t('legal.section_1_title')}</SectionTitle>
      <Text>
        {t('legal.section_1_intro', { siteUrl: legalSiteUrl, companyName })}
      </Text>
      <Text>
        {companyName}<br />
        {legalCompanyForm}<br />
        {legalSiren && <>{t('legal.siren')} : {legalSiren}<br /></>}
        {legalSiret && <>{t('legal.siret')} : {legalSiret}<br /></>}
        {legalRcs && <>{t('legal.rcs')} : {legalRcs}<br /></>}
        {legalVatNumber && <>{t('legal.vat_number')} : {legalVatNumber}<br /></>}
        {t('legal.address')} : {legalAddress}
      </Text>
      <Text>
        {t('legal.email')} : {legalContactEmail}<br />
        {t('legal.website')} : {legalSiteUrl}<br />
        {t('legal.director')} : {legalDirector}<br />
        {t('legal.contact')} : {legalContactEmail}
      </Text>

      <SectionTitle>{t('legal.section_2_title')}</SectionTitle>
      <Text>
        {hostName}<br />
        {hostAddress}
      </Text>

      <SectionTitle>{t('legal.section_3_title')}</SectionTitle>
      <Text>{t('legal.section_3_p1')}</Text>
      <Text>{t('legal.section_3_p2', { companyName })}</Text>

      <SectionTitle>{t('legal.section_4_title')}</SectionTitle>
      <Text>{t('legal.section_4_intro', { companyName })}</Text>
      <List>
        <li>{t('legal.section_4_li1')}</li>
        <li>{t('legal.section_4_li2')}</li>
        <li>{t('legal.section_4_li3')}</li>
        <li>{t('legal.section_4_li4')}</li>
      </List>

      <SectionTitle>{t('legal.section_5_title')}</SectionTitle>
      <Text>{t('legal.section_5_p1', { companyName })}</Text>
      <Text>{t('legal.section_5_p2')}</Text>

      <SectionTitle>{t('legal.section_6_title')}</SectionTitle>
      <Text>{t('legal.section_6_p1', { companyName })}</Text>
      <Text>{t('legal.section_6_p2')}</Text>
      <Text>{t('legal.section_6_p3')}</Text>
      <Text>{t('legal.section_6_p4')}</Text>
      <Text>{t('legal.section_6_p5')}</Text>
      <Text>{t('legal.section_6_p6', { dpoEmail: legalDpoEmail })}</Text>

      <SectionTitle>{t('legal.section_7_title')}</SectionTitle>
      <Text>{t('legal.section_7_p1')}</Text>
      <Text>{t('legal.section_7_p2')}</Text>
      <List>
        <li>{t('legal.section_7_li1')}</li>
        <li>{t('legal.section_7_li2')}</li>
        <li>{t('legal.section_7_li3')}</li>
      </List>
      <Text>{t('legal.section_7_p3')}</Text>

      <SectionTitle>{t('legal.section_8_title')}</SectionTitle>
      <Text>{t('legal.section_8_p1')}</Text>

      <SectionTitle>{t('legal.section_9_title')}</SectionTitle>
      <Text>{t('legal.section_9_p1', { companyName })}</Text>

      <SectionTitle>{t('legal.section_10_title')}</SectionTitle>
      <Text>{t('legal.section_10_p1')}</Text>
      <Text>{t('legal.section_10_p2')}</Text>

      <SectionTitle>{t('legal.section_11_title')}</SectionTitle>
      <Text>{t('legal.section_11_p1')}</Text>

      <SectionTitle>{t('legal.section_12_title')}</SectionTitle>
      <Text>{t('legal.section_12_p1', { companyName })}</Text>
    </Container>
  );
};

export default Legal;

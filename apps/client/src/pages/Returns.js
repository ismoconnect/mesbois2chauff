import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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

const Returns = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  // Sync i18n language with URL parameter
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <Container>
      <Title>{t('returns.page_title')}</Title>
      <Text>{t('returns.intro')}</Text>

      <SectionTitle>{t('returns.section_1_title')}</SectionTitle>
      <Text>{t('returns.section_1_text')}</Text>

      <SectionTitle>{t('returns.section_2_title')}</SectionTitle>
      <List>
        <li>{t('returns.section_2_li1')}</li>
        <li>{t('returns.section_2_li2')}</li>
        <li>{t('returns.section_2_li3')}</li>
      </List>

      <SectionTitle>{t('returns.section_3_title')}</SectionTitle>
      <Text>{t('returns.section_3_intro')}</Text>
      <List>
        <li>{t('returns.section_3_li1')}</li>
        <li>{t('returns.section_3_li2')}</li>
        <li>{t('returns.section_3_li3')}</li>
      </List>

      <SectionTitle>{t('returns.section_4_title')}</SectionTitle>
      <List>
        <li>{t('returns.section_4_li1')}</li>
        <li>{t('returns.section_4_li2')}</li>
        <li>{t('returns.section_4_li3')}</li>
      </List>

      <SectionTitle>{t('returns.section_5_title')}</SectionTitle>
      <Text>{t('returns.section_5_intro')}</Text>
      <List>
        <li>{t('returns.section_5_li1')}</li>
        <li>{t('returns.section_5_li2')}</li>
        <li>{t('returns.section_5_li3')}</li>
      </List>
    </Container>
  );
};

export default Returns;

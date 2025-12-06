import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiTruck, FiShield, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const AboutContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 40px;
  
  @media (max-width: 768px) {
    padding: 0 16px 20px;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    padding: 24px 12px;
    border-radius: 10px;
    margin-bottom: 24px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px; /* remove default top margin */
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 30px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
`;

const TextContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #2c5530;
    margin: 30px 0 15px 0;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const ValueCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #2c5530;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  
  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
`;

const ValueTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const ValueDescription = styled.p`
  color: #666;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 13.5px;
  }
`;

const TeamSection = styled.section`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const TeamTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 10px;
  }
`;

const TeamDescription = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 12.5px;
  }
`;

const About = () => {
  const { t } = useTranslation();
  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle>{t('about.hero_title')}</HeroTitle>
        <HeroSubtitle>
          {t('about.hero_subtitle')}
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <TextContent>
          <h3>{t('about.our_story_title')}</h3>
          <p>
            {t('about.our_story_text')}
          </p>

          <h3>{t('about.our_mission_title')}</h3>
          <p>
            {t('about.our_mission_text')}
          </p>

          <h3>{t('about.our_commitment_title')}</h3>
          <p>
            {t('about.our_commitment_text')}
          </p>
        </TextContent>
      </ContentSection>

      <ContentSection>
        <SectionTitle>{t('about.our_values_title')}</SectionTitle>
        <ValuesGrid>
          <ValueCard>
            <ValueIcon>
              <FiHeart size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_environment_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_environment_desc')}
            </ValueDescription>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FiShield size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_quality_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_quality_desc')}
            </ValueDescription>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FiTruck size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_service_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_service_desc')}
            </ValueDescription>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FiUsers size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_proximity_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_proximity_desc')}
            </ValueDescription>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FiAward size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_excellence_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_excellence_desc')}
            </ValueDescription>
          </ValueCard>

          <ValueCard>
            <ValueIcon>
              <FiHeart size={32} />
            </ValueIcon>
            <ValueTitle>{t('about.value_passion_title')}</ValueTitle>
            <ValueDescription>
              {t('about.value_passion_desc')}
            </ValueDescription>
          </ValueCard>
        </ValuesGrid>
      </ContentSection>

      <TeamSection>
        <TeamTitle>{t('about.our_team_title')}</TeamTitle>
        <TeamDescription>
          {t('about.our_team_desc')}
        </TeamDescription>

        <StatsGrid>
          <StatCard>
            <StatNumber>10+</StatNumber>
            <StatLabel>{t('about.stat_years')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>5000+</StatNumber>
            <StatLabel>{t('about.stat_clients')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>{t('about.stat_products')}</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>{t('about.stat_support')}</StatLabel>
          </StatCard>
        </StatsGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiTruck, FiShield, FiStar, FiHeart, FiArrowRight, FiCheck } from 'react-icons/fi';

// Container principal avec fond moderne
const HomeContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

// Hero Section moderne avec split design
const HeroSection = styled.section`
  min-height: 90vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 40px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 50%, #e0f2e9 100%);
  
  /* Pattern décoratif subtil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(44, 85, 48, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(39, 174, 96, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  /* Tous les enfants au-dessus du fond */
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 40px 20px 50px;
    gap: 32px;
    background: linear-gradient(180deg, #e8f5e9 0%, #f5faf6 100%);
    border-radius: 0 0 32px 32px;
    box-shadow: 0 4px 20px rgba(44, 85, 48, 0.08);
  }
  
  @media (max-width: 480px) {
    padding: 24px 16px 40px;
    gap: 24px;
    background: linear-gradient(180deg, #e0f2e9 0%, #f5faf6 80%);
    border-radius: 0 0 24px 24px;
    box-shadow: 0 2px 12px rgba(44, 85, 48, 0.1);
    
    &::before {
      background-image: 
        radial-gradient(circle at 50% 20%, rgba(44, 85, 48, 0.08) 0%, transparent 60%);
    }
  }
`;

const HeroContent = styled.div`
  z-index: 2;
  
  @media (max-width: 968px) {
    text-align: center;
  }
`;

const HeroLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(44, 85, 48, 0.1);
  color: #2c5530;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  
  svg {
    color: #27ae60;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 12px;
    margin-bottom: 16px;
    gap: 6px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: #2c5530;
  margin-bottom: 24px;
  
  span {
    background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 968px) {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
    line-height: 1.2;
    margin-bottom: 12px;
  }
`;

const HeroDescription = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #6b7c6d;
  margin-bottom: 32px;
  max-width: 500px;
  
  @media (max-width: 968px) {
    margin-left: auto;
    margin-right: auto;
    font-size: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 20px;
    padding: 0 8px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 968px) {
    justify-content: center;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 0 8px;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2c5530;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(44, 85, 48, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(44, 85, 48, 0.4);
    background: #1e3a22;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 24px;
    font-size: 15px;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #2c5530;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #2c5530;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 24px;
    font-size: 15px;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  height: 600px;
  
  @media (max-width: 968px) {
    height: 350px;
  }
  
  @media (max-width: 480px) {
    height: 280px;
  }
`;

const HeroImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: 100%;
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const HeroImage = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7f6 0%, #e6eae7 100%);
  position: relative;
  
  &:first-child {
    grid-row: span 2;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @media (max-width: 480px) {
    border-radius: 16px;
  }
`;

// Section Catégories avec cards modernes
const CategoriesSection = styled.section`
  padding: 80px 40px;
  background: #f8faf9;
  
  @media (max-width: 968px) {
    padding: 60px 24px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 800;
  color: #2c5530;
  margin-bottom: 16px;
  
  @media (max-width: 968px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #6b7c6d;
  line-height: 1.6;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 320px;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
    z-index: 1;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 0.9;
    }
    
    img {
      transform: scale(1.1);
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const CategoryContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  z-index: 2;
  color: white;
`;

const CategoryName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  opacity: 0.9;
  color: white;
`;

// Section Features avec layout moderne
const FeaturesSection = styled.section`
  padding: 100px 40px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 968px) {
    padding: 60px 24px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 40px 24px;
  border-radius: 20px;
  background: white;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5530;
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(44, 85, 48, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  box-shadow: 0 8px 20px rgba(44, 85, 48, 0.3);
`;

const FeatureTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  color: #6b7c6d;
  line-height: 1.6;
`;

// Section Stats moderne
const StatsSection = styled.section`
  padding: 80px 40px;
  background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
  color: white;
  
  @media (max-width: 968px) {
    padding: 60px 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const StatCard = styled.div`
  padding: 20px;
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 8px;
  
  @media (max-width: 968px) {
    font-size: 36px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  opacity: 0.9;
`;

// Section Testimonials moderne
const TestimonialsSection = styled.section`
  padding: 100px 40px;
  background: #f8faf9;
  
  @media (max-width: 968px) {
    padding: 60px 24px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
`;

const TestimonialRating = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  color: #FFA726;
  font-size: 18px;
`;

const TestimonialText = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #4a5a4c;
  margin-bottom: 24px;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 4px;
`;

const AuthorRole = styled.div`
  font-size: 14px;
  color: #6b7c6d;
`;

// CTA Section moderne
const CTASection = styled.section`
  padding: 100px 40px;
  background: white;
  
  @media (max-width: 968px) {
    padding: 60px 24px;
  }
`;

const CTAContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
  padding: 80px 60px;
  border-radius: 30px;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: 968px) {
    padding: 60px 32px;
  }
`;

const CTATitle = styled.h2`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 968px) {
    font-size: 32px;
  }
`;

const CTADescription = styled.p`
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.95;
  position: relative;
  z-index: 1;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #2c5530;
  padding: 18px 40px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Home = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [categoryImages, setCategoryImages] = useState({
    bois: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    accessoires: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    buches_densifiees: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    pellets: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    poeles: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    // Images Hero indépendantes
    hero1: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    hero2: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    hero3: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop"
  });

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const ref = doc(db, 'settings', 'home');
        const snap = await getDoc(ref);
        if (snap.exists() && mounted) {
          const data = snap.data();
          if (data.categoryImages) {
            setCategoryImages(prev => ({ ...prev, ...data.categoryImages }));
          }
        }
      } catch (e) {
        console.error('Erreur chargement images:', e);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);


  const categories = [
    { key: 'bois', name: t('home.category_bois_name'), description: t('home.category_bois_desc') },
    { key: 'pellets', name: t('home.category_pellets_name'), description: t('home.category_pellets_desc') },
    { key: 'buches_densifiees', name: t('home.category_buches_densifiees_name'), description: t('home.category_buches_densifiees_desc') },
    { key: 'accessoires', name: t('home.category_accessoires_name'), description: t('home.category_accessoires_desc') },
    { key: 'poeles', name: t('home.category_poeles_name'), description: t('home.category_poeles_desc') },
  ];

  const features = [
    { icon: <FiTruck />, title: t('home.feature_delivery_title'), description: t('home.feature_delivery_desc') },
    { icon: <FiShield />, title: t('home.feature_quality_title'), description: t('home.feature_quality_desc') },
    { icon: <FiStar />, title: t('home.feature_support_title'), description: t('home.feature_support_desc') },
    { icon: <FiHeart />, title: t('home.feature_satisfaction_title'), description: t('home.feature_satisfaction_desc') },
  ];

  const testimonials = [
    { name: t('home.testimonial_1_name'), role: t('home.testimonial_1_role'), text: t('home.testimonial_1_text') },
    { name: t('home.testimonial_2_name'), role: t('home.testimonial_2_role'), text: t('home.testimonial_2_text') },
    { name: t('home.testimonial_3_name'), role: t('home.testimonial_3_role'), text: t('home.testimonial_3_text') },
  ];

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent className="animate-fade-in">
          <HeroLabel>
            <FiCheck /> {t('home.hero_quality_badge')}
          </HeroLabel>
          <HeroTitle>
            {t('home.hero_title_part1')} <span>{t('home.hero_title_part2')}</span> {t('home.hero_title_part3')}
          </HeroTitle>
          <HeroDescription>
            {t('home.hero_description')}
          </HeroDescription>
          <HeroButtons>
            <PrimaryButton to={`/${currentLang}/products`}>
              {t('home.hero_cta_products')} <FiArrowRight />
            </PrimaryButton>
            <SecondaryButton to={`/${currentLang}/contact`}>
              {t('home.hero_cta_contact')}
            </SecondaryButton>
          </HeroButtons>
        </HeroContent>

        <HeroVisual className="animate-fade-in">
          <HeroImageGrid>
            <HeroImage>
              <img src={categoryImages.hero1} alt="Bois de chauffage" />
            </HeroImage>
            <HeroImage>
              <img src={categoryImages.hero2} alt="Pellets" />
            </HeroImage>
            <HeroImage>
              <img src={categoryImages.hero3} alt="Poêles" />
            </HeroImage>
          </HeroImageGrid>
        </HeroVisual>
      </HeroSection>

      {/* Categories Section */}
      <CategoriesSection>
        <SectionHeader>
          <SectionTitle>{t('home.categories_title')}</SectionTitle>
          <SectionSubtitle>
            {t('home.categories_subtitle')}
          </SectionSubtitle>
        </SectionHeader>
        <CategoriesGrid>
          {categories.map(cat => (
            <CategoryCard key={cat.key} to={`/${currentLang}/products?main=${cat.key}`} className="animate-fade-in">
              <img src={categoryImages[cat.key]} alt={cat.name} />
              <CategoryContent>
                <CategoryName>{cat.name}</CategoryName>
                <CategoryDescription>{cat.description}</CategoryDescription>
              </CategoryContent>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </CategoriesSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>{t('home.features_title')}</SectionTitle>
          <SectionSubtitle>
            {t('home.features_subtitle')}
          </SectionSubtitle>
        </SectionHeader>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} className="animate-fade-in">
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard className="animate-fade-in">
            <StatNumber>5000+</StatNumber>
            <StatLabel>{t('home.stats_clients')}</StatLabel>
          </StatCard>
          <StatCard className="animate-fade-in">
            <StatNumber>98%</StatNumber>
            <StatLabel>{t('home.stats_satisfaction')}</StatLabel>
          </StatCard>
          <StatCard className="animate-fade-in">
            <StatNumber>48h</StatNumber>
            <StatLabel>{t('home.stats_delivery')}</StatLabel>
          </StatCard>
          <StatCard className="animate-fade-in">
            <StatNumber>10 ans</StatNumber>
            <StatLabel>{t('home.stats_years')}</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionHeader>
          <SectionTitle>{t('home.testimonials_title')}</SectionTitle>
          <SectionSubtitle>
            {t('home.testimonials_subtitle', 'Consultez les retours d\'expérience de nos clients heureux')}
          </SectionSubtitle>
        </SectionHeader>
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} className="animate-fade-in">
              <TestimonialRating>
                {[...Array(5)].map((_, i) => <FiStar key={i} fill="#FFA726" />)}
              </TestimonialRating>
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.name[0]}</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.name}</AuthorName>
                  <AuthorRole>{testimonial.role}</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* CTA Section */}
      <CTASection>
        <CTAContainer className="animate-fade-in">
          <CTATitle>{t('home.cta_title')}</CTATitle>
          <CTADescription>
            {t('home.cta_description')}
          </CTADescription>
          <CTAButton to={`/${currentLang}/products`}>
            {t('home.cta_button')} <FiArrowRight />
          </CTAButton>
        </CTAContainer>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;

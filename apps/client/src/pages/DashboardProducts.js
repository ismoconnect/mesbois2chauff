import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart } from 'react-icons/fi';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Products from './Products';

const TopBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 12px;
  display: flex;
  justify-content: flex-end;
`;

const CartBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: #f9fafb;
  color: #1f2d1f;
  text-decoration: none;
  font-weight: 600;
  &:hover { background: #f1f3f5; }
`;

const DashboardProducts = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';

  // Sync i18n language with URL parameter
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <DashboardLayout>
      <TopBar>
        <CartBtn to={`/${currentLang}/dashboard/cart`}>
          <FiShoppingCart /> {t('dashboard.products.go_to_cart')}
        </CartBtn>
      </TopBar>
      <Products />
    </DashboardLayout>
  );
};

export default DashboardProducts;

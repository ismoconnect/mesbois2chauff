import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiCreditCard, FiPhone, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getOrderById, cancelOrder } from '../firebase/orders';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import { translateProductName } from '../utils/productTranslations';

// Mobile-First Container
const OrderDetailContainer = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  margin: 0 -20px; /* Annule les marges du DashboardLayout sur mobile */
  
  @media (min-width: 768px) {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    background: transparent;
  }
`;

// Mobile Header avec navigation sticky
const MobileHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (min-width: 768px) {
    position: static;
    background: transparent;
    border: none;
    padding: 0;
    margin-bottom: 30px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-weight: 500;
  padding: 8px;
  border-radius: 8px;
  
  &:hover {
    background: #FFFFFF;
    color: #1e3a22;
  }
  
  @media (min-width: 768px) {
    padding: 0;
    margin-bottom: 30px;
  }
`;

// Status Badge Mobile
const MobileStatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'shipped': return '#d4edda';
      case 'delivered': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'processing': return '#0c5460';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// Hero Section Mobile
const MobileHeroSection = styled.div`
  background: linear-gradient(135deg, #2c5530 0%, #1e3a22 100%);
  color: white;
  padding: 24px 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileOrderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const MobileOrderDate = styled.p`
  opacity: 0.9;
  font-size: 14px;
  margin-bottom: 16px;
`;

// Desktop Header (caché sur mobile)
const DesktopHeader = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;
  }
`;

const OrderTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'shipped': return '#d4edda';
      case 'delivered': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'processing': return '#0c5460';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

// Mobile Content Layout
const MobileContent = styled.div`
  padding: 0 0 80px 0;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// Desktop Content Layout
const DesktopContent = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 40px;
    align-items: start;
  }
`;

// Mobile Cards - Très réduites
const MobileCard = styled.div`
  background: white;
  margin: 12px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: calc(100% - 64px);
  max-width: 400px;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileCardHeader = styled.div`
  padding: 14px 16px 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #2c5530;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
`;

const MobileCardContent = styled.div`
  padding: 16px;
`;

// Mobile Order Item - Plus compact
const MobileOrderItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #FFFFFF;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const MobileItemImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MobileItemDetails = styled.div`
  flex: 1;
  
  .item-name {
    font-size: 14px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 3px;
    line-height: 1.3;
  }
  
  .item-description {
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    
    .quantity {
      color: #666;
    }
    
    .price {
      font-weight: 700;
      color: #2c5530;
    }
  }
`;

// Mobile Summary
const MobileSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #FFFFFF;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &.total {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #e9ecef;
    padding-top: 16px;
    margin-top: 8px;
  }
  
  .label {
    color: #666;
    font-size: 14px;
  }
  
  .value {
    font-weight: 600;
    color: #2c5530;
  }
`;

// Mobile Info Row - Plus compact
const MobileInfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #FFFFFF;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .icon {
    color: #2c5530;
    margin-top: 1px;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .value {
      font-size: 14px;
      color: #2c5530;
      font-weight: 500;
      line-height: 1.3;
    }
  }
`;

// Mobile Action Button - Aligné avec les cartes très réduites
const MobileActionButton = styled.button`
  width: calc(100% - 64px);
  margin: 16px 32px;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 400px;
  
  &.primary {
    background: #2c5530;
    color: white;
    
    &:hover {
      background: #1e3a22;
    }
  }
  
  &.danger {
    background: #fff;
    color: #dc3545;
    border: 2px solid #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Desktop Components - Agrandis pour desktop
const OrderItems = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  
  @media (min-width: 1200px) {
    padding: 50px;
    border-radius: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (min-width: 1200px) {
    font-size: 28px;
    margin-bottom: 35px;
    gap: 15px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  @media (min-width: 1200px) {
    gap: 32px;
    padding: 32px 0;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  @media (min-width: 1200px) {
    width: 120px;
    height: 120px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    margin: 0;
    line-height: 1.4;
    
    @media (min-width: 1200px) {
      font-size: 20px;
    }
  }
  
  .item-description {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
  
  .item-quantity {
    color: #4a5568;
    font-size: 14px;
    font-weight: 500;
    margin-top: 4px;
    background: #FFFFFF;
    padding: 4px 12px;
    border-radius: 20px;
    width: fit-content;
  }
`;

const ItemPrice = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  
  .unit-price {
    color: #888;
    font-size: 14px;
  }
  
  .total-price {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    
    @media (min-width: 1200px) {
      font-size: 22px;
    }
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  height: fit-content;
  position: sticky;
  top: 40px;
  
  @media (min-width: 1200px) {
    padding: 40px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  color: #666;
  font-size: 16px;
  
  &.total {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #f0f0f0;
    padding-top: 20px;
    margin-top: 20px;
    
    @media (min-width: 1200px) {
      font-size: 24px;
      padding-top: 25px;
      margin-top: 25px;
    }
  }
  
  @media (min-width: 1200px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const DeliveryInfo = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  margin-top: 30px;
  
  @media (min-width: 1200px) {
    padding: 40px;
  }
`;



const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

// Composant d'alerte personnalisé
const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const AlertBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
    
    &.success {
      color: #28a745;
    }
    
    &.error {
      color: #dc3545;
    }
  }
  
  p {
    color: #666;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  button {
    background: #2c5530;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:hover {
      background: #1e3a22;
    }
    
    &.success {
      background: #28a745;
      
      &:hover {
        background: #218838;
      }
    }
    
    &.error {
      background: #dc3545;
      
      &:hover {
        background: #c82333;
      }
    }
  }
`;

// Composant de confirmation personnalisé
const ConfirmBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    
    button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      min-width: 100px;
      
      &.confirm {
        background: #28a745;
        color: white;
        
        &:hover {
          background: #218838;
        }
      }
      
      &.cancel {
        background: #6c757d;
        color: white;
        
        &:hover {
          background: #5a6268;
        }
      }
    }
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #dc3545;
    color: #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  margin-top: 16px;
  background: #2c5530;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(44, 85, 48, 0.2);
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(44, 85, 48, 0.3);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const InfoCard = styled.div`
  background: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg {
      color: #2c5530;
    }
  }
  
  p {
    color: #4a5568;
    line-height: 1.6;
    font-size: 15px;
    margin: 0;
  }
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <FiClock size={20} />;
    case 'processing': return <FiPackage size={20} />;
    case 'shipped': return <FiTruck size={20} />;
    case 'delivered': return <FiCheckCircle size={20} />;
    case 'cancelled': return <FiXCircle size={20} />;
    default: return <FiClock size={20} />;
  }
};

const OrderDetail = () => {
  const { id, lang } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const currentLang = lang || i18n.language || 'fr';

  // Sync i18n language with URL parameter
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Fonction getStatusText utilisant t()
  const getStatusText = (status) => {
    const statusMap = {
      'pending': t('orders.status.pending'),
      'processing': t('orders.status.processing'),
      'shipped': t('orders.status.shipped'),
      'delivered': t('orders.status.delivered'),
      'cancelled': t('orders.status.cancelled')
    };
    return statusMap[status] || t('orders.status.unknown');
  };

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', title: '', message: '' }
  const [showConfirm, setShowConfirm] = useState(false); // Pour la confirmation d'annulation

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const result = await getOrderById(id);

      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t('orderDetail.loading_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate(`/${currentLang}/login`);
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const handleCancelOrder = () => {
    setShowConfirm(true);
  };

  const handlePayment = () => {
    navigate(`/${currentLang}/billing`);
  };

  const confirmCancelOrder = async () => {
    setShowConfirm(false);
    setCancelling(true);

    const result = await cancelOrder(id, t('orderDetail.cancel_order'));

    if (result.success) {
      setAlert({
        type: 'success',
        title: t('orderDetail.cancel_success_title'),
        message: t('orderDetail.cancel_success_message')
      });
      fetchOrder();
    } else {
      setAlert({
        type: 'error',
        title: t('orderDetail.cancel_error_title'),
        message: t('orderDetail.cancel_error_message')
      });
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <LoadingSpinner>{t('orderDetail.loading')}</LoadingSpinner>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <ErrorMessage>
            <h3>{t('orderDetail.error_title')}</h3>
            <p>{error}</p>
          </ErrorMessage>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <ErrorMessage>
            <h3>{t('orderDetail.not_found_title')}</h3>
            <p>{t('orderDetail.not_found_text')}</p>
          </ErrorMessage>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrderDetailContainer>
        {/* Mobile Header Sticky */}
        <MobileHeader>
          <BackButton onClick={() => navigate(`/${currentLang}/orders`)}>
            <FiArrowLeft size={18} />
            {t('orderDetail.back')}
          </BackButton>
          <MobileStatusBadge status={order.status}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </MobileStatusBadge>
        </MobileHeader>

        {/* Mobile Hero Section */}
        <MobileHeroSection>
          <MobileOrderTitle>
            <FiPackage size={24} />
            {t('orderDetail.order_number', { id: order.id.slice(-8) })}
          </MobileOrderTitle>
          <MobileOrderDate>
            {new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </MobileOrderDate>
        </MobileHeroSection>

        {/* Desktop Header (caché sur mobile) */}
        <DesktopHeader>
          <BackButton onClick={() => navigate(`/${currentLang}/orders`)}>
            <FiArrowLeft size={20} />
            {t('orderDetail.back_to_orders')}
          </BackButton>

          <OrderTitle>
            <FiPackage size={28} />
            {t('orderDetail.order_number', { id: order.id.slice(-8) })}
          </OrderTitle>

          <OrderInfo>
            <InfoItem>
              <h4>{t('orderDetail.order_date')}</h4>
              <p>
                {new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </InfoItem>

            <InfoItem>
              <h4>{t('orderDetail.order_number_label')}</h4>
              <p>{order.id}</p>
            </InfoItem>

            <InfoItem>
              <h4>{t('orderDetail.delivery_method')}</h4>
              <p>
                {order.delivery?.method === 'express' ? t('orderDetail.delivery_express') : t('orderDetail.delivery_standard')}
              </p>
            </InfoItem>
          </OrderInfo>

          <OrderStatus status={order.status}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </OrderStatus>
        </DesktopHeader>

        {/* Mobile Content */}
        <MobileContent>
          {/* Articles commandés - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiPackage size={20} />
                {t('orderDetail.ordered_items')}
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              {order.items.map((item, index) => (
                <MobileOrderItem key={index}>
                  <MobileItemImage>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-wood.jpg';
                        }}
                      />
                    ) : (
                      <FiPackage size={24} color="#2c5530" />
                    )}
                  </MobileItemImage>
                  <MobileItemDetails>
                    <div className="item-name">{translateProductName(item.name, currentLang)}</div>
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                    <div className="item-meta">
                      <span className="quantity">{t('orderDetail.quantity_short', { count: item.quantity })}</span>
                      <span className="price">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  </MobileItemDetails>
                </MobileOrderItem>
              ))}
            </MobileCardContent>
          </MobileCard>

          {/* Résumé de commande - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiCreditCard size={20} />
                {t('orderDetail.summary')}
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileSummaryRow>
                <span className="label">{t('orderDetail.subtotal')}</span>
                <span className="value">{(order.total - (order.delivery?.cost || 0)).toFixed(2)}€</span>
              </MobileSummaryRow>
              <MobileSummaryRow>
                <span className="label">{t('orderDetail.shipping')}</span>
                <span className="value">{(order.delivery?.cost || 0).toFixed(2)}€</span>
              </MobileSummaryRow>
              <MobileSummaryRow className="total">
                <span>{t('orderDetail.total')}</span>
                <span>{order.total.toFixed(2)}€</span>
              </MobileSummaryRow>
            </MobileCardContent>
          </MobileCard>

          {/* Informations de livraison - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiMapPin size={20} />
                {t('orderDetail.delivery')}
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileInfoRow>
                <FiUser className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.recipient')}</div>
                  <div className="value">
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                  </div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiMapPin className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.address')}</div>
                  <div className="value">
                    {order.customerInfo?.address}<br />
                    {order.customerInfo?.postalCode} {order.customerInfo?.city}<br />
                    {order.customerInfo?.country}
                  </div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiTruck className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.delivery_method')}</div>
                  <div className="value">
                    {order.delivery?.method === 'express' ? t('orderDetail.delivery_express') : t('orderDetail.delivery_standard')}
                  </div>
                </div>
              </MobileInfoRow>
            </MobileCardContent>
          </MobileCard>

          {/* Informations de contact - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiPhone size={20} />
                {t('orderDetail.contact')}
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileInfoRow>
                <FiMail className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.email')}</div>
                  <div className="value">{order.customerInfo?.email || t('orderDetail.not_provided')}</div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiPhone className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.phone')}</div>
                  <div className="value">{order.customerInfo?.phone || t('orderDetail.not_provided')}</div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiCreditCard className="icon" size={16} />
                <div className="content">
                  <div className="label">{t('orderDetail.payment')}</div>
                  <div className="value">
                    {order.payment?.method === 'card' ? t('orderDetail.payment_card') : 'PayPal'}
                  </div>
                </div>
              </MobileInfoRow>
            </MobileCardContent>
          </MobileCard>

          {/* Notes - Mobile */}
          {order.notes && (
            <MobileCard>
              <MobileCardHeader>
                <h3>
                  <FiCalendar size={20} />
                  {t('orderDetail.notes')}
                </h3>
              </MobileCardHeader>
              <MobileCardContent>
                <p style={{ color: '#666', lineHeight: '1.5' }}>{order.notes}</p>
              </MobileCardContent>
            </MobileCard>
          )}

          {/* Action Button - Mobile */}
          {(order.status === 'pending' || order.status === 'processing') && (
            <MobileActionButton
              className="danger"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? t('orderDetail.cancelling') : t('orderDetail.cancel_order')}
            </MobileActionButton>
          )}

          {(order.status === 'pending') && (
            <MobileActionButton
              className="primary"
              onClick={handlePayment}
              style={{ marginTop: 0 }}
            >
              {t('orderDetail.pay_order')}
            </MobileActionButton>
          )}
        </MobileContent>

        {/* Desktop Content (layout existant) */}
        <DesktopContent>
          <div>
            <OrderItems>
              <SectionTitle>
                <FiPackage size={20} />
                {t('orderDetail.ordered_items')}
              </SectionTitle>

              {order.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemImage
                    src={item.image || '/placeholder-wood.jpg'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-wood.jpg';
                    }}
                  />
                  <ItemInfo>
                    <h4>{translateProductName(item.name, currentLang)}</h4>
                    <div className="item-description">{item.description}</div>
                    <div className="item-quantity">{t('orderDetail.quantity_short', { count: item.quantity })}</div>
                  </ItemInfo>
                  <ItemPrice>
                    <div className="unit-price">{item.price}{t('orderDetail.per_unit')}</div>
                    <div className="total-price">{(item.price * item.quantity).toFixed(2)}€</div>
                  </ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>

            <DeliveryInfo>
              <SectionTitle>
                <FiMapPin size={20} />
                {t('orderDetail.delivery_info')}
              </SectionTitle>

              <InfoGrid>
                <InfoCard>
                  <h4>
                    <FiMapPin size={18} />
                    {t('orderDetail.address')}
                  </h4>
                  <p>
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}<br />
                    {order.customerInfo?.address}<br />
                    {order.customerInfo?.postalCode} {order.customerInfo?.city}<br />
                    {order.customerInfo?.country}
                  </p>
                </InfoCard>

                <InfoCard>
                  <h4>
                    <FiCreditCard size={18} />
                    {t('orderDetail.payment')}
                  </h4>
                  <p>
                    {order.payment?.method === 'card' ? t('orderDetail.payment_card') : 'PayPal'}
                  </p>
                </InfoCard>
              </InfoGrid>
            </DeliveryInfo>
          </div>

          <OrderSummary>
            <SectionTitle>{t('orderDetail.summary')}</SectionTitle>

            <SummaryRow>
              <span>{t('orderDetail.subtotal')}</span>
              <span>{(order.total - (order.delivery?.cost || 0)).toFixed(2)}€</span>
            </SummaryRow>

            <SummaryRow>
              <span>{t('orderDetail.shipping')}</span>
              <span>{(order.delivery?.cost || 0).toFixed(2)}€</span>
            </SummaryRow>

            <SummaryRow className="total">
              <span>{t('orderDetail.total')}</span>
              <span>{order.total.toFixed(2)}€</span>
            </SummaryRow>

            {order.notes && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#FFFFFF', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2c5530', marginBottom: '5px' }}>
                  {t('orderDetail.notes')}
                </h4>
                <p style={{ color: '#666', fontSize: '14px' }}>{order.notes}</p>
              </div>
            )}

            {(order.status === 'pending' || order.status === 'processing') && (
              <CancelButton
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? t('orderDetail.cancelling') : t('orderDetail.cancel_order')}
              </CancelButton>
            )}

            {(order.status === 'pending') && (
              <PayButton onClick={handlePayment}>
                {t('orderDetail.pay_order')}
              </PayButton>
            )}
          </OrderSummary>
        </DesktopContent>
      </OrderDetailContainer>

      {/* Confirmation d'annulation */}
      {showConfirm && (
        <AlertOverlay>
          <ConfirmBox>
            <h3>{t('orderDetail.confirm_cancel_title')}</h3>
            <p>{t('orderDetail.confirm_cancel_text')}</p>
            <div className="button-group">
              <button
                className="confirm"
                onClick={confirmCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? t('orderDetail.cancelling') : t('orderDetail.confirm_ok')}
              </button>
              <button
                className="cancel"
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
              >
                {t('orderDetail.confirm_cancel')}
              </button>
            </div>
          </ConfirmBox>
        </AlertOverlay>
      )}

      {/* Alerte personnalisée */}
      {alert && (
        <AlertOverlay>
          <AlertBox>
            <h3 className={alert.type}>{alert.title}</h3>
            <p>{alert.message}</p>
            <button
              className={alert.type}
              onClick={() => setAlert(null)}
            >
              OK
            </button>
          </AlertBox>
        </AlertOverlay>
      )}
    </DashboardLayout>
  );
};

export default OrderDetail;

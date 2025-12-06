import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingBag, FiPackage, FiTruck, FiUser, FiCreditCard, FiShoppingCart } from 'react-icons/fi';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';

const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 24px 20px;
  @media (max-width: 600px) { 
    padding: 0 16px 16px 16px; 
  }
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 8px;
  color: #1f2d1f;
  @media (max-width: 768px) { font-size: 26px; }
  @media (max-width: 600px) { font-size: 22px; }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 32px;
  @media (max-width: 600px) { 
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

// Sidebar/headers fournis par DashboardLayout

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled.div`
  background: ${props => props.bg || '#f8faf9'};
  border: 2px solid ${props => props.border || '#e6ebe8'};
  border-radius: 12px;
  padding: 20px;
  color: ${props => props.color || '#1f2d1f'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  @media (max-width: 600px) {
    padding: 16px 12px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 4px;
  color: ${props => props.color || 'inherit'};
  @media (max-width: 768px) { font-size: 28px; }
  @media (max-width: 600px) { font-size: 24px; }
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.7;
  font-weight: 500;
  @media (max-width: 600px) { 
    font-size: 11px;
  }
`;

const QuickActions = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  margin-bottom: 40px;
  @media (max-width: 600px) {
    padding: 20px 16px;
    margin-bottom: 24px;
  }
`;

const QuickActionsTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #1f2d1f;
  @media (max-width: 600px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: #f8faf9;
  border: 2px solid #e6ebe8;
  text-decoration: none;
  color: #1f2d1f;
  transition: all .2s ease;
  text-align: center;

  &:hover {
    background: #eaf4ee;
    border-color: #2c5530;
    transform: translateY(-2px);
  }

  svg {
    font-size: 24px;
    color: #2c5530;
  }

  span {
    font-size: 13px;
    font-weight: 600;
  }

  @media (max-width: 600px) {
    padding: 12px 8px;
    gap: 6px;

    svg {
      font-size: 20px;
    }

    span {
      font-size: 11px;
    }
  }
`;

const RecentOrders = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  @media (max-width: 600px) {
    padding: 20px 16px;
  }
`;

const RecentOrdersTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #1f2d1f;
  @media (max-width: 600px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const OrderItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: #f8faf9;
  margin-bottom: 12px;
  text-decoration: none;
  color: inherit;
  transition: all .2s ease;

  &:hover {
    background: #eaf4ee;
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderNumber = styled.div`
  font-weight: 700;
  font-size: 14px;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const OrderDate = styled.div`
  font-size: 12px;
  color: #666;
  @media (max-width: 600px) {
    font-size: 11px;
  }
`;

const OrderStatus = styled.span`
  padding: 4px 12px;
  border-radius: 999px;
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
`;

// Cette fonction sera remplacée par l'utilisation directe de t() dans le composant

const Section = styled.div`
  margin-bottom: 32px;
`;

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';
  
  // Sync i18n language with URL parameter
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  const getStatusText = (status) => {
    const statusMap = {
      'pending': t('dashboard.home.order_status.pending'),
      'processing': t('dashboard.home.order_status.processing'),
      'shipped': t('dashboard.home.order_status.shipped'),
      'delivered': t('dashboard.home.order_status.delivered'),
      'cancelled': t('dashboard.home.order_status.cancelled')
    };
    return statusMap[status] || t('dashboard.home.order_status.unknown');
  };

  const { user, userData } = useAuth();
  const { getCartItemsCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  });

  const name = userData?.displayName || user?.email || '';
  const cartCount = typeof getCartItemsCount === 'function' ? getCartItemsCount() : 0;

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      setLoading(true);
      const res = await getUserOrders(user.uid);
      if (res.success) {
        const ordersData = res.data || [];
        setOrders(ordersData.slice(0, 3)); // Les 3 dernières commandes
        
        // Calculer les statistiques
        const totalOrders = ordersData.length;
        const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const deliveredOrders = ordersData.filter(o => o.status === 'delivered').length;
        const totalSpent = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
        
        setStats({ totalOrders, pendingOrders, deliveredOrders, totalSpent });
      }
      setLoading(false);
    };
    loadOrders();
  }, [user]);

  return (
    <DashboardLayout>
      <Shell>
        <Section>
          <Title>{t('dashboard.home.page_title')}</Title>
          <Subtitle>{t('dashboard.home.welcome', { name })}</Subtitle>
        </Section>

        {/* Statistiques */}
        <StatsGrid>
          <StatCard bg="#f8faf9" border="#2c5530" color="#1f2d1f">
            <StatValue color="#2c5530">{stats.totalOrders}</StatValue>
            <StatLabel>{t('dashboard.home.stats.total_orders')}</StatLabel>
          </StatCard>
          <StatCard bg="#ffffff" border="#e6ebe8" color="#1f2d1f">
            <StatValue color="#1f2d1f">{stats.pendingOrders}</StatValue>
            <StatLabel>{t('dashboard.home.stats.in_progress')}</StatLabel>
          </StatCard>
          <StatCard bg="#ffffff" border="#e6ebe8" color="#1f2d1f">
            <StatValue color="#1f2d1f">{stats.deliveredOrders}</StatValue>
            <StatLabel>{t('dashboard.home.stats.delivered')}</StatLabel>
          </StatCard>
          <StatCard bg="#2c5530" border="#2c5530" color="#ffffff">
            <StatValue color="#ffffff">{stats.totalSpent.toFixed(0)} €</StatValue>
            <StatLabel style={{ color: '#ffffff', opacity: 0.9 }}>{t('dashboard.home.stats.total_spent')}</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Actions rapides */}
        <QuickActions>
          <QuickActionsTitle>{t('dashboard.home.quick_actions')}</QuickActionsTitle>
          <ActionGrid>
            <ActionButton to={`/${currentLang}/dashboard/products`}>
              <FiShoppingCart />
              <span>{t('dashboard.home.actions.order')}</span>
            </ActionButton>
            <ActionButton to={`/${currentLang}/dashboard/cart`}>
              <FiShoppingBag />
              <span>{t('dashboard.home.actions.cart')} {cartCount > 0 && `(${cartCount})`}</span>
            </ActionButton>
            <ActionButton to={`/${currentLang}/orders`}>
              <FiPackage />
              <span>{t('dashboard.home.actions.my_orders')}</span>
            </ActionButton>
            <ActionButton to={`/${currentLang}/suivi`}>
              <FiTruck />
              <span>{t('dashboard.home.actions.tracking')}</span>
            </ActionButton>
            <ActionButton to={`/${currentLang}/profile`}>
              <FiUser />
              <span>{t('dashboard.home.actions.my_profile')}</span>
            </ActionButton>
            <ActionButton to={`/${currentLang}/billing`}>
              <FiCreditCard />
              <span>{t('dashboard.home.actions.billing')}</span>
            </ActionButton>
          </ActionGrid>
        </QuickActions>

        {/* Commandes récentes */}
        <RecentOrders>
          <RecentOrdersTitle>{t('dashboard.home.recent_orders')}</RecentOrdersTitle>
          {loading && <EmptyState>{t('dashboard.home.loading')}</EmptyState>}
          {!loading && orders.length === 0 && (
            <EmptyState>{t('dashboard.home.no_orders')}</EmptyState>
          )}
          {!loading && orders.length > 0 && (
            <div>
              {orders.map((order) => (
                <OrderItem key={order.id} to={`/${currentLang}/orders/${order.id}`}>
                  <OrderInfo>
                    <OrderNumber>{t('dashboard.home.order_number', { id: order.id.slice(-8) })}</OrderNumber>
                    <OrderDate>
                      {order.createdAt 
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </OrderDate>
                  </OrderInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>
                      {order.total?.toFixed(2) || '0.00'} €
                    </div>
                    <OrderStatus status={order.status}>
                      {getStatusText(order.status)}
                    </OrderStatus>
                  </div>
                </OrderItem>
              ))}
              {orders.length >= 3 && (
                <Link 
                  to={`/${currentLang}/orders`} 
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    marginTop: '16px', 
                    color: '#2c5530',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  {t('dashboard.home.view_all_orders')}
                </Link>
              )}
            </div>
          )}
        </RecentOrders>
      </Shell>
    </DashboardLayout>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiCreditCard } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 16px;
  @media (max-width: 600px) { padding: 12px; }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  
  > div:first-child {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }
`;

const FollowButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  &:hover { background: #1e3a22; }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'awaiting_payment': return '#ffeaa7';
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
      case 'awaiting_payment': return '#b8860b';
      case 'processing': return '#0c5460';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

function iconFor(status) {
  switch (status) {
    case 'pending': return <FiClock size={14} />;
    case 'awaiting_payment': return <FiCreditCard size={14} />;
    case 'processing': return <FiPackage size={14} />;
    case 'shipped': return <FiTruck size={14} />;
    case 'delivered': return <FiCheckCircle size={14} />;
    case 'cancelled': return <FiXCircle size={14} />;
    default: return <FiClock size={14} />;
  }
}

const Suivi = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';

  // Sync i18n language with URL parameter
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const res = await getUserOrders(user.uid);
      if (res.success) setOrders(res.data || []);
      setLoading(false);
    };
    load();
  }, [user]);


  // Fonction textFor utilisant t()
  const textFor = (status) => {
    const statusMap = {
      'pending': t('suivi.status.pending'),
      'awaiting_payment': t('suivi.status.awaiting_payment'),
      'processing': t('suivi.status.processing'),
      'shipped': t('suivi.status.shipped'),
      'delivered': t('suivi.status.delivered'),
      'cancelled': t('suivi.status.cancelled')
    };
    return statusMap[status] || t('suivi.status.unknown');
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <Container>
        <Title>{t('suivi.title')}</Title>
        <Subtitle>{t('suivi.subtitle')}</Subtitle>
        {loading && <Card>{t('suivi.loading')}</Card>}
        {!loading && orders.length === 0 && (
          <Card>{t('suivi.no_orders')}</Card>
        )}
        {!loading && orders.length > 0 && (
          <List>
            {orders.map((o) => (
              <Card key={o.id}>
                <Row>
                  <div>
                    <strong>{t('suivi.order_number', { id: o.id.slice(-8) })}</strong>
                    <Status status={o.status}>
                      {iconFor(o.status)} {textFor(o.status)}
                    </Status>
                  </div>
                  <FollowButton to={`/${currentLang}/suivi/${o.id}`}>
                    <FiTruck /> {t('suivi.follow')}
                  </FollowButton>
                </Row>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Suivi;

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, cancelOrder } from '../firebase/orders';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import { translateProductName } from '../utils/productTranslations';

const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  word-break: break-word;
  overflow-wrap: break-word;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const OrdersHeader = styled.div`
  margin-bottom: 40px;
`;

const OrdersTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrdersSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  min-width: 0;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 600px) {
    padding: 18px;
    min-width: 0;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const OrderInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  .order-date {
    color: #666;
    font-size: 14px;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
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

const OrderItems = styled.div`
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  .item-quantity {
    color: #666;
    font-size: 14px;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2c5530;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
  font-size: 18px;
  font-weight: 700;
  color: #2c5530;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PayNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff8e1;
  border: 1px solid #ffe7a3;
  color: #8a6d3b;
  border-radius: 10px;
  padding: 12px 14px;
  margin: 12px 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const PayNoticeButton = styled(Link)`
  flex: 0 0 auto;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  &:hover { background: #1e3a22; }
  
  @media (max-width: 600px) {
    width: 100%;
    text-align: center;
  }
`;

const ActionButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: none;
  cursor: pointer;
  
  &.primary {
    background: #2c5530;
    color: white;
    
    &:hover {
      background: #1e3a22;
    }
  }
  
  &.secondary {
    background: #FFFFFF;
    color: #2c5530;
    border: 2px solid #e0e0e0;
    
    &:hover {
      background: #e9ecef;
    }
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  cursor: pointer;
  
  &:hover {
    background: #dc3545;
    color: #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ShopButton = styled(Link)`
  display: inline-block;
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <FiClock size={16} />;
    case 'processing': return <FiPackage size={16} />;
    case 'shipped': return <FiTruck size={16} />;
    case 'delivered': return <FiCheckCircle size={16} />;
    case 'cancelled': return <FiXCircle size={16} />;
    default: return <FiClock size={16} />;
  }
};

const Orders = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
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

  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showCenterAlert = (message, type = 'success') => {
    toast.dismiss('orders-alert');
    toast.custom((t) => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 20000
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '18px 20px 16px',
            maxWidth: '90vw',
            width: 340,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '22vh',
            border: type === 'error' ? '1px solid #fca5a5' : '1px solid #bbf7d0'
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: type === 'error' ? '#b91c1c' : '#166534'
            }}
          >
            {message}
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: '#2c5530',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    ), {
      id: 'orders-alert',
      duration: 3000,
      position: 'top-center'
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getUserOrders(user.uid);

      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t('orders.loading_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    const result = await cancelOrder(orderId, t('orders.cancel_order'));

    if (result.success) {
      showCenterAlert(t('orders.cancel_success'));
      // Recharger les commandes
      fetchOrders();
    } else {
      showCenterAlert(t('orders.cancel_error'), 'error');
    }
    setCancellingId(null);
    setConfirmId(null);
  };

  if (!user) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <LoadingSpinner>{t('orders.loading')}</LoadingSpinner>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <EmptyOrders>
            <FiXCircle size={64} />
            <h3>{t('orders.error_title')}</h3>
            <p>{error}</p>
          </EmptyOrders>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <OrdersHeader>
            <OrdersTitle>
              <FiPackage size={32} />
              {t('orders.page_title')}
            </OrdersTitle>
            <OrdersSubtitle>{t('orders.page_subtitle')}</OrdersSubtitle>
          </OrdersHeader>

          <EmptyOrders>
            <FiPackage size={64} />
            <h3>{t('orders.no_orders_title')}</h3>
            <p>{t('orders.no_orders_text')}</p>
            <ShopButton to={`/${currentLang}/dashboard/products`}>{t('orders.start_shopping')}</ShopButton>
          </EmptyOrders>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrdersContainer>
        <OrdersHeader>
          <OrdersTitle>
            <FiPackage size={32} />
            {t('orders.page_title')}
          </OrdersTitle>
          <OrdersSubtitle>{t('orders.page_subtitle')}</OrdersSubtitle>
        </OrdersHeader>

        <OrdersList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <h3>{t('orders.order_number', { id: order.id.slice(-8) })}</h3>
                  <div className="order-date">
                    {new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </OrderInfo>

                <OrderStatus status={order.status}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </OrderStatus>
              </OrderHeader>
              {(order?.payment?.method === 'bank') && (order.status !== 'paid' && order.status !== 'delivered') && (
                <PayNotice>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <FiCreditCard /> {t('orders.payment_notice')}
                  </span>
                  <PayNoticeButton to={`/${currentLang}/billing`}>{t('orders.go_to_rib')}</PayNoticeButton>
                </PayNotice>
              )}

              <OrderItems>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemImage
                      src={item.image || 'https://picsum.photos/seed/fallback/60/60'}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/fallback/60/60';
                      }}
                    />
                    <ItemInfo>
                      <h4>{translateProductName(item.name, currentLang)}</h4>
                      <div className="item-quantity">{t('orders.quantity', { count: item.quantity })}</div>
                    </ItemInfo>
                    <ItemPrice>{(item.price * item.quantity).toFixed(2)}€</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>

              <OrderTotal>
                <span>{t('orders.total')}</span>
                <span>{order.total.toFixed(2)}€</span>
              </OrderTotal>

              <OrderActions>
                <ActionButton to={`/${currentLang}/orders/${order.id}`} className="primary">
                  {t('orders.view_details')}
                </ActionButton>
                {order.status === 'delivered' && (
                  <ActionButton to={`/${currentLang}/orders/${order.id}/review`} className="secondary">
                    {t('orders.leave_review')}
                  </ActionButton>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <CancelButton
                    onClick={() => setConfirmId(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? t('orders.cancelling') : t('orders.cancel_order')}
                  </CancelButton>
                )}
              </OrderActions>
            </OrderCard>
          ))}
        </OrdersList>

        {confirmId && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)',
              zIndex: 20000
            }}
            onClick={() => !cancellingId && setConfirmId(null)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '18px 20px 16px',
                maxWidth: '90vw',
                width: 360,
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
                {t('orders.confirm_cancel_title')}
              </div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
                Cette action est définitive. Votre commande passera en statut « Annulée ».
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  disabled={!!cancellingId}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('orders.confirm_no')}
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelOrder(confirmId)}
                  disabled={!!cancellingId}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: 'none',
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('orders.confirm_yes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </OrdersContainer>
    </DashboardLayout>
  );
};

export default Orders;


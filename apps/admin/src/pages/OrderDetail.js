import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiArrowLeft, FiPackage, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  padding: 16px 10px 24px;

  @media (min-width: 768px) {
    padding: 24px 16px 32px;
  }

  @media (max-width: 767px) {
    overflow-x: hidden;
    margin: 0 -16px; /* Annule les marges du layout admin */
    padding: 0;
    background: #f8f9fa;
    min-height: 100vh;
  }
`;

// Mobile Header Sticky
const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    padding: 16px 20px;
    border-bottom: 1px solid #e9ecef;
    align-items: center;
    justify-content: space-between;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 4px 2px 0;
  
  @media (min-width: 768px) {
    gap: 16px;
  }

  @media (max-width: 767px) {
    display: none; /* Caché sur mobile, remplacé par MobileHeader */
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 2px solid #e6eae7;
  color: #2c5530;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background: #f5f7f6;
    border-color: #2c5530;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  word-break: break-word;
  
  @media (max-width: 767px) {
    font-size: 18px;
  }
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${p => {
    if (p.status === 'delivered') return '#d4edda';
    if (p.status === 'shipped') return '#d1ecf1';
    if (p.status === 'processing') return '#fff3cd';
    if (p.status === 'cancelled') return '#f8d7da';
    return '#e2e3e5';
  }};
  color: ${p => {
    if (p.status === 'delivered') return '#155724';
    if (p.status === 'shipped') return '#0c5460';
    if (p.status === 'processing') return '#856404';
    if (p.status === 'cancelled') return '#721c24';
    return '#6c757d';
  }};
  
  @media (min-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  align-items: flex-start;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 350px;
    gap: 30px;
    max-width: 1400px;
  }
  
  @media (min-width: 1200px) {
    gap: 40px;
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 24px;
  min-width: 0; /* allow children to shrink (prevent table overflow in grid) */
  
  @media (min-width: 992px) {
    gap: 30px;
  }
`;

const SideColumn = styled.div`
  display: grid;
  gap: 24px;
  align-content: flex-start;
  min-width: 0;
  
  @media (min-width: 992px) {
    gap: 30px;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  width: 100%;

  @media (min-width: 768px) {
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  
  @media (min-width: 1200px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 14px 0;
  color: #2c5530;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    margin-bottom: 14px;
    font-size: 16px;
    gap: 8px;
  }
  
  @media (min-width: 1200px) {
    font-size: 17px;
    margin-bottom: 16px;
    gap: 9px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 12px;
  
  @media (min-width: 1200px) {
    gap: 14px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f9faf9;
  border-radius: 10px;
  
  svg {
    color: #2c5530;
    margin-top: 2px;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7c6d;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #1f2d1f;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  
  @media (min-width: 768px) {
    margin-top: 16px;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    
    @media (min-width: 768px) {
      padding: 10px;
    }
    
    @media (min-width: 1200px) {
      padding: 12px;
    }
  }
  
  thead {
    background: #f5f7f6;
    
    th {
      font-weight: 700;
      color: #2c5530;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      @media (min-width: 768px) {
        font-size: 12px;
      }
      
      @media (min-width: 1200px) {
        font-size: 13px;
        letter-spacing: 0.8px;
      }
    }
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #fafbfa;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    font-size: 13px;
    color: #1f2d1f;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
    
    @media (min-width: 1200px) {
      font-size: 15px;
    }
  }
`;

const MobileItemList = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`;

const MobileItemCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: center;

  .meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const ProductImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f5f7f6;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    
    @media (min-width: 768px) {
      border-radius: 8px;
    }
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #eaf4ee;
  border-radius: 8px;
  margin-top: 12px;
  gap: 8px;
  
  @media (min-width: 768px) {
    padding: 14px;
    border-radius: 8px;
    margin-top: 14px;
  }
  
  @media (min-width: 1200px) {
    padding: 16px;
    border-radius: 10px;
    margin-top: 16px;
  }
  
  span:first-child {
    font-size: 14px;
    font-weight: 700;
    color: #2c5530;
    
    @media (min-width: 768px) {
      font-size: 15px;
    }
    
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
  
  span:last-child {
    font-size: 18px;
    font-weight: 800;
    color: #2c5530;
    
    @media (min-width: 768px) {
      font-size: 20px;
    }
    
    @media (min-width: 1200px) {
      font-size: 22px;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  border: 2px solid #e6eae7;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2c5530;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Nouveaux composants mobiles
const MobileHeroSection = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: block;
    background: linear-gradient(135deg, #2c5530 0%, #1e3a22 100%);
    color: white;
    padding: 24px 20px;
    text-align: center;
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

const MobileContent = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: block;
    padding: 0 0 80px 0;
  }
`;

const MobileCard = styled.div`
  background: white;
  margin: 16px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: calc(100% - 32px);
`;

const MobileCardHeader = styled.div`
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
`;

const MobileCardContent = styled.div`
  padding: 20px;
`;

const MobileInfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .icon {
    color: #2c5530;
    margin-top: 2px;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .value {
      font-size: 15px;
      color: #2c5530;
      font-weight: 500;
      line-height: 1.4;
    }
  }
`;

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
`;

const DesktopContent = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

const LoadingState = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 20px;
  color: #6b7c6d;
`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);
   const [userData, setUserData] = useState(null);

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, 'orders', id);
      const snap = await getDoc(ref);
      setOrder(snap.exists() ? { id, ...snap.data() } : null);
    };
    run();
  }, [id]);

  // Charger les infos utilisateur pour compléter les informations client de la commande
  useEffect(() => {
    const loadUser = async () => {
      if (!order?.userId) {
        setUserData(null);
        return;
      }
      try {
        const ref = doc(db, 'users', order.userId);
        const snap = await getDoc(ref);
        setUserData(snap.exists() ? snap.data() : null);
      } catch (e) {
        setUserData(null);
      }
    };

    loadUser();
  }, [order?.userId]);

  const updateStatus = async (status) => {
    if (!order) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status,
        updatedAt: new Date()
      });
      setOrder(o => ({ ...o, status }));
      try {
        const ci = order.customerInfo || {};
        const payload = {
          orderId: id,
          status,
          customer: {
            firstName: ci.firstName || '',
            lastName: ci.lastName || '',
            email: ci.email || ''
          }
        };
        fetch('/api/order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(()=>{});
      } catch(_) { /* ignore */ }
    } catch (error) {
      
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <LoadingState>
        <h3>Chargement de la commande...</h3>
      </LoadingState>
    );
  }

  // Construire des informations client robustes à partir de customerInfo et des données utilisateur
  const ci = order.customerInfo || {};
  const fullNameFromCI = (ci.firstName || ci.lastName)
    ? `${ci.firstName || ''} ${ci.lastName || ''}`.trim()
    : '';

  const clientName =
    fullNameFromCI ||
    userData?.displayName ||
    (userData && (userData.firstName || userData.lastName)
      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      : '') ||
    order.userId ||
    'N/A';

  const clientEmail = ci.email || userData?.email || 'N/A';
  const clientPhone = ci.phone || userData?.phone || 'N/A';

  const shipping = order.shippingAddress || {
    street: ci.address || userData?.address || '',
    city: ci.city || userData?.city || '',
    postalCode: ci.postalCode || userData?.postalCode || '',
    country: ci.country || userData?.country || '',
  };

  return (
    <Page>
      {/* Mobile Header Sticky */}
      <MobileHeader>
        <BackButton
          onClick={() => {
            const fromUser = location.state && location.state.fromUser;
            if (fromUser) {
              navigate(`/users/${fromUser}`);
            } else {
              navigate('/orders');
            }
          }}
        >
          <FiArrowLeft size={18} /> Retour
        </BackButton>
        <MobileStatusBadge status={order.status}>
          {order.status === 'pending' && 'En attente'}
          {order.status === 'processing' && 'En cours'}
          {order.status === 'shipped' && 'Expédiée'}
          {order.status === 'delivered' && 'Livrée'}
          {order.status === 'cancelled' && 'Annulée'}
        </MobileStatusBadge>
      </MobileHeader>

      {/* Mobile Hero Section */}
      <MobileHeroSection>
        <MobileOrderTitle>
          <FiPackage size={24} />
          Commande #{id.slice(-8)}
        </MobileOrderTitle>
        <MobileOrderDate>
          {order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A'
          }
        </MobileOrderDate>
      </MobileHeroSection>

      {/* Desktop Header */}
      <Header>
        <BackButton
          onClick={() => {
            const fromUser = location.state && location.state.fromUser;
            if (fromUser) {
              navigate(`/users/${fromUser}`);
            } else {
              navigate('/orders');
            }
          }}
        >
          <FiArrowLeft size={18} /> Retour
        </BackButton>
        <Title>Commande #{id.slice(-8)}</Title>
        <StatusBadge status={order.status}>
          {order.status === 'pending' && 'En attente'}
          {order.status === 'processing' && 'En cours'}
          {order.status === 'shipped' && 'Expédiée'}
          {order.status === 'delivered' && 'Livrée'}
          {order.status === 'cancelled' && 'Annulée'}
        </StatusBadge>
      </Header>

      {/* Mobile Content */}
      <MobileContent>
        {/* Informations client - Mobile */}
        <MobileCard>
          <MobileCardHeader>
            <h3>
              <FiUser size={20} />
              Informations client
            </h3>
          </MobileCardHeader>
          <MobileCardContent>
            <MobileInfoRow>
              <FiUser className="icon" size={16} />
              <div className="content">
                <div className="label">Nom complet</div>
                <div className="value">{clientName}</div>
              </div>
            </MobileInfoRow>
            <MobileInfoRow>
              <FiMail className="icon" size={16} />
              <div className="content">
                <div className="label">Email</div>
                <div className="value">{clientEmail}</div>
              </div>
            </MobileInfoRow>
            <MobileInfoRow>
              <FiPhone className="icon" size={16} />
              <div className="content">
                <div className="label">Téléphone</div>
                <div className="value">{clientPhone}</div>
              </div>
            </MobileInfoRow>
            <MobileInfoRow>
              <FiMapPin className="icon" size={16} />
              <div className="content">
                <div className="label">Adresse de livraison</div>
                <div className="value">
                  {shipping.street}<br />
                  {shipping.city}{shipping.city || shipping.postalCode ? ', ' : ''}{shipping.postalCode}<br />
                  {shipping.country}
                </div>
              </div>
            </MobileInfoRow>
          </MobileCardContent>
        </MobileCard>

        {/* Articles commandés - Mobile */}
        <MobileCard>
          <MobileCardHeader>
            <h3>
              <FiPackage size={20} />
              Articles commandés
            </h3>
          </MobileCardHeader>
          <MobileCardContent>
            {(order.items || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Aucun article
              </div>
            ) : (
              (order.items || []).map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  padding: '16px 0', 
                  borderBottom: idx < order.items.length - 1 ? '1px solid #f8f9fa' : 'none'
                }}>
                  <ProductImage style={{ width: 50, height: 50 }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <FiPackage size={24} color="#6b7c6d" />
                    )}
                  </ProductImage>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name || 'Produit'}</div>
                    {item.description && (
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#666' }}>Qté: {item.quantity || 1}</span>
                      <span style={{ fontWeight: '700', color: '#2c5530' }}>
                        {((item.price || 0) * (item.quantity || 1)).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px 0 0 0',
              borderTop: '2px solid #e9ecef',
              marginTop: '16px',
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c5530'
            }}>
              <span>Total</span>
              <span>{order.total?.toFixed(2) || '0.00'} €</span>
            </div>
          </MobileCardContent>
        </MobileCard>

        {/* Gestion du statut - Mobile */}
        <MobileCard>
          <MobileCardHeader>
            <h3>
              <FiPackage size={20} />
              Statut de la commande
            </h3>
          </MobileCardHeader>
          <MobileCardContent>
            <Select 
              value={order.status || 'pending'} 
              onChange={(e) => updateStatus(e.target.value)}
              disabled={saving}
            >
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </Select>
            <ActionButton disabled={saving}>
              {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </ActionButton>
          </MobileCardContent>
        </MobileCard>

        {/* Détails - Mobile */}
        <MobileCard>
          <MobileCardHeader>
            <h3>
              <FiCalendar size={20} />
              Détails
            </h3>
          </MobileCardHeader>
          <MobileCardContent>
            <MobileInfoRow>
              <FiCalendar className="icon" size={16} />
              <div className="content">
                <div className="label">Date de commande</div>
                <div className="value">
                  {order.createdAt?.seconds
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </div>
              </div>
            </MobileInfoRow>
            <MobileInfoRow>
              <FiCreditCard className="icon" size={16} />
              <div className="content">
                <div className="label">Mode de paiement</div>
                <div className="value">{order.paymentMethod || 'Carte bancaire'}</div>
              </div>
            </MobileInfoRow>
            <MobileInfoRow>
              <FiPackage className="icon" size={16} />
              <div className="content">
                <div className="label">Nombre d'articles</div>
                <div className="value">{order.items?.length || 0}</div>
              </div>
            </MobileInfoRow>
          </MobileCardContent>
        </MobileCard>
      </MobileContent>

      {/* Desktop Content */}
      <DesktopContent>
        <Grid>
          <MainColumn>
            {/* Informations client */}
            <Card>
              <CardTitle>
                <FiUser size={20} /> Informations client
              </CardTitle>
              <InfoGrid>
                <InfoRow>
                  <FiUser size={18} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Nom complet</InfoLabel>
                    <InfoValue>{clientName}</InfoValue>
                  </div>
                </InfoRow>
                <InfoRow>
                  <FiMail size={18} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{clientEmail}</InfoValue>
                  </div>
                </InfoRow>
                <InfoRow>
                  <FiPhone size={18} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Téléphone</InfoLabel>
                    <InfoValue>{clientPhone}</InfoValue>
                  </div>
                </InfoRow>
                <InfoRow>
                  <FiMapPin size={18} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Adresse de livraison</InfoLabel>
                    <InfoValue>
                      {shipping.street}<br />
                      {shipping.city}{shipping.city || shipping.postalCode ? ', ' : ''}{shipping.postalCode}<br />
                      {shipping.country}
                    </InfoValue>
                  </div>
                </InfoRow>
              </InfoGrid>
            </Card>

            {/* Articles commandés */}
            <Card>
              <CardTitle>
                <FiPackage size={20} /> Articles commandés
              </CardTitle>
              <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                <Table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                        Aucun article
                      </td>
                    </tr>
                  ) : (
                    (order.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ProductImage>
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <FiPackage size={24} color="#6b7c6d" />
                              )}
                            </ProductImage>
                            <div>
                              <div style={{ fontWeight: '600' }}>{item.name || 'Produit'}</div>
                              {item.description && (
                                <div style={{ fontSize: '12px', color: '#6b7c6d' }}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity || 1}</td>
                        <td>{item.price?.toFixed(2) || '0.00'} €</td>
                        <td>
                          <strong>
                            {((item.price || 0) * (item.quantity || 1)).toFixed(2)} €
                          </strong>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </Table>
              </div>
              {/* Mobile view: stacked cards */}
              <MobileItemList>
                {(order.items || []).length === 0 ? null : (
                  (order.items || []).map((item, idx) => (
                    <MobileItemCard key={idx}>
                      <ProductImage style={{ width: 60, height: 60 }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <FiPackage size={28} color="#6b7c6d" />
                        )}
                      </ProductImage>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{item.name || 'Produit'}</div>
                        {item.description && (
                          <div style={{ fontSize: 12, color: '#6b7c6d' }}>{item.description}</div>
                        )}
                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ fontSize: 13 }}>Qté: <strong>{item.quantity || 1}</strong></div>
                          <div style={{ fontSize: 13 }}>Prix: <strong>{item.price?.toFixed(2) || '0.00'} €</strong></div>
                          <div style={{ fontSize: 13 }}>Total: <strong>{((item.price || 0) * (item.quantity || 1)).toFixed(2)} €</strong></div>
                        </div>
                      </div>
                    </MobileItemCard>
                  ))
                )}
              </MobileItemList>
              <TotalRow>
                <span>Total de la commande</span>
                <span>{order.total?.toFixed(2) || '0.00'} €</span>
              </TotalRow>
            </Card>
          </MainColumn>

          {/* Sidebar */}
          <SideColumn>
            {/* Gestion du statut */}
            <Card>
              <CardTitle>
                <FiPackage size={20} /> Statut de la commande
              </CardTitle>
              <Select 
                value={order.status || 'pending'} 
                onChange={(e) => updateStatus(e.target.value)}
                disabled={saving}
              >
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </Select>
              <ActionButton disabled={saving}>
                {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
              </ActionButton>
            </Card>

            {/* Informations commande */}
            <Card>
              <CardTitle>
                <FiCalendar size={20} /> Détails
              </CardTitle>
              <InfoGrid>
                <InfoRow>
                  <FiCalendar size={16} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Date de commande</InfoLabel>
                    <InfoValue>
                      {order.createdAt?.seconds
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </InfoValue>
                  </div>
                </InfoRow>
                <InfoRow>
                  <FiCreditCard size={16} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Mode de paiement</InfoLabel>
                    <InfoValue>{order.paymentMethod || 'Carte bancaire'}</InfoValue>
                  </div>
                </InfoRow>
                <InfoRow>
                  <FiPackage size={16} />
                  <div style={{ flex: 1 }}>
                    <InfoLabel>Nombre d'articles</InfoLabel>
                    <InfoValue>{order.items?.length || 0}</InfoValue>
                  </div>
                </InfoRow>
              </InfoGrid>
            </Card>
          </SideColumn>
        </Grid>
      </DesktopContent>
    </Page>
  );
};

export default OrderDetail;

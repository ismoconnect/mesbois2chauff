import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard, FiXCircle, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getOrderById } from '../firebase/orders';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 20px;
  @media (max-width: 600px) { padding: 16px; }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 40px;
  margin-top: 20px;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 30px;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 10px;
    bottom: -20px;
    width: 2px;
    background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
    display: ${props => props.isLast ? 'none' : 'block'};
  }
`;

const TimelineIcon = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.active ? '#2c5530' : '#999'};
`;

const TimelineDate = styled.div`
  font-size: 13px;
  color: #666;
`;

const TimelineDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
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

// getStatusText sera utilisé via suivi.status dans le composant




const SuiviItinerary = () => {
  const { id, lang } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = lang || i18n.language || 'fr';
  
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTimelineSteps = (order) => {
    const currentStatus = order?.status || 'pending';
    const statusOrder = ['pending', 'awaiting_payment', 'processing', 'shipped', 'delivered'];
    const currentIndex = currentStatus === 'cancelled' ? -1 : statusOrder.indexOf(currentStatus);

    const steps = [
      {
        id: 'pending',
        title: t('suiviItinerary.steps.pending.title'),
        icon: <FiClock />,
        description: t('suiviItinerary.steps.pending.description'),
        date: order?.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
      },
      {
        id: 'awaiting_payment',
        title: t('suiviItinerary.steps.awaiting_payment.title'),
        icon: <FiCreditCard />,
        description: t('suiviItinerary.steps.awaiting_payment.description'),
        date: order?.awaitingPaymentDate ? new Date(order.awaitingPaymentDate.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
      },
      {
        id: 'processing',
        title: t('suiviItinerary.steps.processing.title'),
        icon: <FiPackage />,
        description: t('suiviItinerary.steps.processing.description'),
        date: order?.processingDate ? new Date(order.processingDate.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
      },
      {
        id: 'shipped',
        title: t('suiviItinerary.steps.shipped.title'),
        icon: <FiTruck />,
        description: t('suiviItinerary.steps.shipped.description'),
        date: order?.shippedDate ? new Date(order.shippedDate.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
      },
      {
        id: 'delivered',
        title: t('suiviItinerary.steps.delivered.title'),
        icon: <FiCheckCircle />,
        description: t('suiviItinerary.steps.delivered.description'),
        date: order?.deliveredDate ? new Date(order.deliveredDate.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
      },
    ];

    if (currentStatus === 'cancelled') {
      steps.push({
        id: 'cancelled',
        title: t('suivi.status.cancelled'),
        icon: <FiXCircle />,
        description: t('suivi.status.cancelled'),
        date: order?.cancelledDate ? new Date(order.cancelledDate.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`) : '',
        active: true,
        isLast: true,
      });

      return steps.map((step, index) => ({
        ...step,
        active: step.id === 'cancelled' || index <= Math.max(0, statusOrder.indexOf('pending')),
        isLast: step.id === 'cancelled',
      }));
    }

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      isLast: index === steps.length - 1,
    }));
  };

  const generatePDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(44, 85, 48);
    doc.text('MES BOIS', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Commande #${order.id.slice(-8)}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`)}`, 14, 35);
    doc.text(`Statut: ${t(`suivi.status.${order.status}`)}`, 14, 40);
    let startY = 55;
    if (order.shippingAddress) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Adresse de livraison:', 14, startY);
      doc.setFontSize(10);
      doc.setTextColor(60);
      doc.text(order.shippingAddress.fullName || '', 14, startY + 6);
      doc.text(order.shippingAddress.address || '', 14, startY + 11);
      doc.text(`${order.shippingAddress.postalCode || ''} ${order.shippingAddress.city || ''}`, 14, startY + 16);
      if (order.shippingAddress.phone) {
        doc.text(`Tél: ${order.shippingAddress.phone}`, 14, startY + 21);
      }
      startY += 30;
    }
    const tableRows = (order.items || []).map(item => [
      item.name,
      item.quantity,
      `${item.price.toFixed(2)} €`,
      `${(item.price * item.quantity).toFixed(2)} €`
    ]);
    autoTable(doc, {
      startY: startY,
      head: [['Article', 'Qté', 'Prix Unit.', 'Total']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [44, 85, 48], textColor: 255 },
      styles: { fontSize: 10 },
    });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(0);
    const subTotal = order.total - (order.delivery?.cost || 0);
    const deliveryCost = order.delivery?.cost || 0;
    doc.text(`Sous-total: ${subTotal.toFixed(2)} €`, 140, finalY);
    doc.text(`Livraison: ${deliveryCost.toFixed(2)} €`, 140, finalY + 5);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: ${order.total.toFixed(2)} €`, 140, finalY + 12);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text('Merci de votre confiance.', 14, finalY + 30);
    doc.text('Document généré automatiquement par MesBois.', 14, finalY + 35);
    doc.save(`facture_${order.id.slice(-8)}.pdf`);
  };

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
      setLoading(false);
    };
    load();
  }, [user, id]);

  if (!user) return null;

  const timelineSteps = order ? getTimelineSteps(order) : [];

  return (
    <DashboardLayout>
      <Container>
        <BackLink to={`/${currentLang}/suivi`}>
          <FiArrowLeft /> {t('suiviItinerary.back')}
        </BackLink>

        <Title>{t('suiviItinerary.title')}</Title>
        <Subtitle>{t('suiviItinerary.subtitle')}</Subtitle>

        {loading && <Card>{t('suiviItinerary.loading')}</Card>}

        {!loading && !order && (
          <Card>{t('suiviItinerary.not_found')}</Card>
        )}

        {!loading && order && (
          <>
            <Card>
              <OrderInfo>
                <InfoRow>
                  <Label>{t('suiviItinerary.order_number')}</Label>
                  <Value>#{order.id.slice(-8)}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>{t('suiviItinerary.order_date')}</Label>
                  <Value>
                    {order.createdAt
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(currentLang === 'en' ? 'en-US' : `${currentLang}-${currentLang.toUpperCase()}`, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : 'N/A'}
                  </Value>
                </InfoRow>
                <InfoRow>
                  <Label>{t('suiviItinerary.total_amount')}</Label>
                  <Value>{order.total?.toFixed(2) || '0.00'} €</Value>
                </InfoRow>
                <InfoRow>
                  <Label>{t('suiviItinerary.status_label')}</Label>
                  <Status status={order.status}>
                    {t(`suivi.status.${order.status}`)}
                  </Status>
                </InfoRow>
              </OrderInfo>

              {order.shippingAddress && (
                <div>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <FiMapPin size={16} /> Adresse de livraison
                  </Label>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.address}</div>
                    <div>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </div>
                    {order.shippingAddress.phone && (
                      <div>Tél: {order.shippingAddress.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>{t('suiviItinerary.timeline_title')}</h2>
              <Timeline>
                {timelineSteps.map((step) => (
                  <TimelineItem key={step.id} active={step.active} isLast={step.isLast}>
                    <TimelineIcon active={step.active}>
                      {step.icon}
                    </TimelineIcon>
                    <TimelineContent>
                      <TimelineTitle active={step.active}>{step.title}</TimelineTitle>
                      {step.date && <TimelineDate>{step.date}</TimelineDate>}
                      <TimelineDescription>{step.description}</TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>

              <DownloadButton onClick={generatePDF}>
                <FiDownload /> {t('suiviItinerary.download_pdf')}
              </DownloadButton>
            </Card>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default SuiviItinerary;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPaypalInfo } from '../firebase/paypal';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px 80px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 24px;
`;

const Title = styled.h1`
  color: #2c5530;
  font-size: 28px;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0 0 16px 0;
`;

const RGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const Field = styled.div`
  border: 1px dashed #e6eae7;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  strong { color: #2c5530; display:block; font-size: 13px; }
  div { font-weight: 700; }
`;

const CTA = styled(Link)`
  display: inline-block; margin-top: 20px; background:#2c5530; color:#fff; padding:14px 18px; border-radius:10px; font-weight:800; text-decoration:none; text-align:center;
  &:hover{ background:#1e3a22; }
`;

export default function PayPalPayment() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [info, setInfo] = useState({ email: '', instructions: '' });
  const [loading, setLoading] = useState(true);
  const ref = formatTransferRef(orderId || '');

  useEffect(() => {
    (async () => {
      const res = await getPaypalInfo();
      if (res.success) {
        setInfo(res.data);
      } else {
        toast.error(res.error || t('paypal.error_load_info'));
        setInfo({ email: process.env.REACT_APP_PAYPAL_EMAIL || '', instructions: process.env.REACT_APP_PAYPAL_INSTRUCTIONS || '' });
      }
      setLoading(false);
    })();
  }, [t]);

  return (
    <Container>
      <Card>
        <Title>{t('paypal.page_title')}</Title>
        <Subtitle>{t('paypal.page_subtitle')}</Subtitle>

        {loading && <p>{t('paypal.loading')}</p>}

        <RGrid>
          <Field>
            <strong>{t('paypal.paypal_email')}</strong>
            <div>{info.email}</div>
          </Field>
          <Field>
            <strong>{t('paypal.reference_to_include')}</strong>
            <div>{ref}</div>
          </Field>
          {info.instructions ? (
            <Field>
              <strong>{t('paypal.instructions')}</strong>
              <div style={{ whiteSpace: 'pre-wrap', fontWeight: 600 }}>{info.instructions}</div>
            </Field>
          ) : null}
        </RGrid>

        <p style={{ marginTop: 16, color: '#666' }}>
          {t('paypal.confirmation_message')}
        </p>
        <CTA to={`/${currentLang}/dashboard`}>{t('paypal.go_to_dashboard')}</CTA>
      </Card>
    </Container>
  );
}

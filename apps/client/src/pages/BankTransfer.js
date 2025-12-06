import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRIB } from '../firebase/rib';
import toast from 'react-hot-toast';
import { FiCreditCard, FiArrowLeft } from 'react-icons/fi';
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

const AlertBanner = styled.div`
  margin: 0 0 16px 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #7f1d1d;
  font-size: 14px;
  font-weight: 600;
`;

const RIBGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const RIBField = styled.div`
  border: 1px dashed #e6eae7;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  strong { color: #2c5530; display:block; font-size: 13px; }
  div { font-weight: 700; }
`;

const Back = styled(Link)`
  display: inline-flex; align-items:center; gap:8px; color:#2c5530; text-decoration:none; font-weight:700; margin-bottom:12px;
`;

const CTA = styled(Link)`
  display: inline-block; margin-top: 20px; background:#2c5530; color:#fff; padding:14px 18px; border-radius:10px; font-weight:800; text-decoration:none; text-align:center;
  &:hover{ background:#1e3a22; }
`;

const BankTransfer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '' });
  const [loading, setLoading] = useState(true);
  const ref = formatTransferRef(orderId || '');

  useEffect(() => {
    const load = async () => {
      const res = await getRIB();
      if (res.success) {
        setRib(res.data);
      } else {
        toast.error(res.error || t('bank_transfer.error_load_rib'));
        // Fallback éventuel sur ENV pour éviter l'affichage vide
        setRib({
          holder: process.env.REACT_APP_RIB_HOLDER || '',
          iban: process.env.REACT_APP_RIB_IBAN || '',
          bic: process.env.REACT_APP_RIB_BIC || '',
          bank: process.env.REACT_APP_RIB_BANK || ''
        });
      }
      setLoading(false);
    };
    load();
  }, [t]);

  return (
    <Container>
      <Back to={`/${currentLang}/dashboard`}>
        {t('bank_transfer.back_to_dashboard')}
      </Back>
      <Card>
        <Title>{t('bank_transfer.page_title')}</Title>
        <p>{t('bank_transfer.page_subtitle')}</p>

        <AlertBanner>
          {t('bank_transfer.instant_transfer_notice')}{' '}
          {t('bank_transfer.instant_transfer_info')}
        </AlertBanner>

        <div style={{ margin: '10px 0 18px', padding: '12px 12px 10px', borderRadius: 10, background: '#fffbeb', border: '1px solid #f59e0b' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
            fontWeight: 800,
            fontSize: 14,
            color: '#92400e'
          }}>
            <span style={{ fontSize: 18 }}>!</span>
            <span>{t('bank_transfer.important_steps_title')}</span>
          </div>
          <ol style={{ paddingLeft: 18, margin: 0, color: '#111827', fontSize: 13, lineHeight: 1.7 }}>
            <li style={{ marginBottom: 4 }}>
              {t('bank_transfer.step_1')}
            </li>
            <li style={{ marginBottom: 4 }}>
              {t('bank_transfer.step_2')}
            </li>
            <li style={{ marginBottom: 4 }}>
              {t('bank_transfer.step_3')}
            </li>
            <li>
              {t('bank_transfer.step_4')}
            </li>
          </ol>
        </div>
        {loading && <p>{t('bank_transfer.loading')}</p>}
        <RIBGrid>
          <RIBField>
            <strong>{t('bank_transfer.account_holder')}</strong>
            <div>{rib.holder}</div>
          </RIBField>
          <RIBField>
            <strong>{t('bank_transfer.bank')}</strong>
            <div>{rib.bank}</div>
          </RIBField>
          <RIBField>
            <strong>IBAN</strong>
            <div>{rib.iban}</div>
          </RIBField>
          <RIBField>
            <strong>BIC</strong>
            <div>{rib.bic}</div>
          </RIBField>
          <RIBField style={{ gridColumn: '1 / -1' }}>
            <strong>{t('bank_transfer.transfer_reference')}</strong>
            <div>{ref}</div>
          </RIBField>
        </RIBGrid>
        <p style={{ marginTop: 16, color: '#666' }}>
          {t('bank_transfer.confirmation_email')}
        </p>
        <CTA to={`/${currentLang}/dashboard`}>{t('bank_transfer.go_to_dashboard')}</CTA>
      </Card>
    </Container>
  );
};

export default BankTransfer;

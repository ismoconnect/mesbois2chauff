import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getAuth,
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';

const Container = styled.div`
  max-width: 520px;
  margin: 0 auto;
  padding: 40px 16px 60px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 10px;
`;

const Text = styled.p`
  color: #444;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  margin-bottom: 10px;
  &:focus { outline: none; border-color: #2c5530; }
`;

const Button = styled.button`
  width: 100%;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const Helper = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

export default function AuthAction() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [lang, setLang] = useState('fr');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get('mode') || '';
    const oc = sp.get('oobCode') || '';
    const l = sp.get('lang') || 'fr';
    setMode(m);
    setOobCode(oc);
    setLang(l);

    // Change i18n language based on URL parameter
    if (l && i18n.language !== l) {
      i18n.changeLanguage(l);
    }

    if (!m || !oc) return;

    if (m === 'verifyEmail') {
      setStatus({ state: 'loading', message: t('authAction.verifying') });
      applyActionCode(auth, oc)
        .then(() => {
          setStatus({ state: 'success', message: t('authAction.email_verified_success') });
        })
        .catch((e) => {
          setStatus({ state: 'error', message: t('authAction.invalid_link') });
        });
    } else if (m === 'resetPassword') {
      // Valider le code de réinitialisation d'abord
      setStatus({ state: 'loading', message: t('authAction.verifying_link') });
      verifyPasswordResetCode(auth, oc)
        .then(() => setStatus({ state: 'ready-reset', message: '' }))
        .catch(() => setStatus({ state: 'error', message: t('authAction.invalid_link') }));
    } else {
      setStatus({ state: 'error', message: t('authAction.unknown_action') });
    }
  }, [auth, navigate, t, i18n]);

  const onSubmitReset = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setStatus({ state: 'error', message: t('authAction.password_too_short') });
      return;
    }
    if (password !== password2) {
      setStatus({ state: 'error', message: t('authAction.passwords_no_match') });
      return;
    }
    try {
      setStatus({ state: 'loading', message: t('authAction.updating_password') });
      await confirmPasswordReset(auth, oobCode, password);
      setStatus({ state: 'success', message: t('authAction.password_updated_redirect') });
      setTimeout(() => navigate(`/${lang}/login`, { replace: true }), 1200);
    } catch (e) {
      setStatus({ state: 'error', message: t('authAction.password_update_failed') });
    }
  };

  return (
    <Container>
      <Card>
        {status.state === 'loading' && (
          <>
            <Title>{t('authAction.processing')}</Title>
            <Text>{status.message || t('authAction.please_wait')}</Text>
          </>
        )}

        {status.state === 'success' && (
          <>
            <Title>{t('authAction.success')}</Title>
            <Text>{status.message}</Text>
            <Button type="button" onClick={() => navigate(`/${lang}/login`, { replace: true })} style={{ marginTop: 12 }}>
              {t('authAction.go_to_login')}
            </Button>
          </>
        )}

        {status.state === 'error' && (
          <>
            <Title>{t('authAction.error')}</Title>
            <Text>{status.message || t('authAction.error_occurred')}</Text>
            <Helper>{t('authAction.request_new_link')}</Helper>
          </>
        )}

        {status.state === 'ready-reset' && (
          <>
            <Title>{t('authAction.reset_password_title')}</Title>
            <form onSubmit={onSubmitReset}>
              <Input
                type="password"
                placeholder={t('authAction.new_password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder={t('authAction.confirm_password')}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
              <Button type="submit">{t('authAction.validate')}</Button>
            </form>
          </>
        )}
      </Card>
    </Container>
  );
}

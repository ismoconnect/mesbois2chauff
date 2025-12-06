import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { updateUserData, changePassword } from '../firebase/auth';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 32px;
  @media (max-width: 600px) { padding: 16px 12px 24px; }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px 20px 22px;
  @media (max-width: 600px) { padding: 16px 14px 18px; }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 18px 0;
  @media (max-width: 600px) { font-size: 20px; }
`;

const Section = styled.section`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

const SectionDescription = styled.p`
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const OptionLabel = styled.div`
  color: #111827;
  font-weight: 500;
`;

const OptionHint = styled.div`
  color: #6b7280;
  font-size: 13px;
`;

const Toggle = styled.button`
  min-width: 52px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: ${props => (props.$active ? '#22c55e' : '#f3f4f6')};
  position: relative;
  cursor: pointer;
  padding: 0;
  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => (props.$active ? '27px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: #9ca3af;
  }
`;

const PasswordForm = styled.form`
  margin-top: 8px;
  display: grid;
  gap: 10px;
  max-width: 420px;
`;

const PasswordField = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #2c5530;
  }
`;

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PasswordHint = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #2c5530;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Settings = () => {
  const { user, userData, setUserData } = useAuth();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';

  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const [emailOrderUpdates, setEmailOrderUpdates] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showCenterAlert = (message, type = 'success') => {
    toast.dismiss('settings-alert');
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
      id: 'settings-alert',
      duration: 2500,
      position: 'top-center'
    });
  };

  useEffect(() => {
    if (userData && userData.preferences) {
      setEmailOrderUpdates(
        userData.preferences.emailOrderUpdates !== undefined
          ? !!userData.preferences.emailOrderUpdates
          : true
      );
      setEmailPromotions(
        userData.preferences.emailPromotions !== undefined
          ? !!userData.preferences.emailPromotions
          : false
      );
    }
  }, [userData]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await updateUserData(user.uid, {
        preferences: {
          emailOrderUpdates,
          emailPromotions
        }
      });

      if (!res.success) {
        throw new Error(res.error || 'Erreur lors de la mise à jour');
      }

      if (res.data) {
        setUserData(res.data);
      }

      showCenterAlert(t('settings.preferences_updated'));
    } catch (e) {
      showCenterAlert(t('settings.preferences_error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showCenterAlert(t('settings.fill_all_fields'), 'error');
      return;
    }

    if (newPassword.length < 6) {
      showCenterAlert(t('settings.password_min_length'), 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showCenterAlert(t('settings.passwords_no_match'), 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (!res.success) {
        throw new Error(res.error || 'Erreur lors du changement de mot de passe');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showCenterAlert(t('settings.password_updated'));
    } catch (error) {
      showCenterAlert('Impossible de changer le mot de passe. Vérifiez l’ancien mot de passe.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Card>
          <Title>{t('settings.title')}</Title>

          <Section>
            <SectionTitle>{t('settings.communication_title')}</SectionTitle>
            <SectionDescription>
              {t('settings.communication_desc')}
            </SectionDescription>

            <OptionRow>
              <div>
                <OptionLabel>{t('settings.email_orders')}</OptionLabel>
                <OptionHint>{t('settings.email_orders_hint')}</OptionHint>
              </div>
              <Toggle
                type="button"
                aria-label="Préférence email suivi"
                $active={emailOrderUpdates}
                onClick={() => setEmailOrderUpdates(v => !v)}
              />
            </OptionRow>

            <OptionRow>
              <div>
                <OptionLabel>{t('settings.email_promos')}</OptionLabel>
                <OptionHint>{t('settings.email_promos_hint')}</OptionHint>
              </div>
              <Toggle
                type="button"
                aria-label="Préférence email promo"
                $active={emailPromotions}
                onClick={() => setEmailPromotions(v => !v)}
              />
            </OptionRow>

            <SaveRow>
              <SaveButton type="button" onClick={handleSave} disabled={saving}>
                {saving ? t('settings.saving') : t('settings.save_preferences')}
              </SaveButton>
            </SaveRow>
          </Section>

          <Section>
            <SectionTitle>{t('settings.security_title')}</SectionTitle>
            <SectionDescription>
              {t('settings.security_desc')}
            </SectionDescription>

            <OptionRow>
              <div>
                <OptionLabel>{t('settings.change_password')}</OptionLabel>
                <OptionHint>{t('settings.change_password_hint')}</OptionHint>
              </div>
            </OptionRow>

            <PasswordForm onSubmit={handleChangePassword}>
              <PasswordField>
                <PasswordInput
                  type={showCurrent ? 'text' : 'password'}
                  placeholder={t('settings.old_password')}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  aria-label={showCurrent ? t('settings.hide_password') : t('settings.show_password')}
                >
                  {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </EyeButton>
              </PasswordField>
              <PasswordField>
                <PasswordInput
                  type={showNew ? 'text' : 'password'}
                  placeholder={t('settings.new_password')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  aria-label={showNew ? t('settings.hide_password') : t('settings.show_password')}
                >
                  {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </EyeButton>
                <PasswordHint>{t('settings.password_hint')}</PasswordHint>
              </PasswordField>
              <PasswordField>
                <PasswordInput
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('settings.confirm_password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? t('settings.hide_password') : t('settings.show_password')}
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </EyeButton>
              </PasswordField>
              <SaveRow>
                <SaveButton type="submit" disabled={passwordLoading}>
                  {passwordLoading ? t('settings.updating') : t('settings.update_password')}
                </SaveButton>
              </SaveRow>
            </PasswordForm>
          </Section>

        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;

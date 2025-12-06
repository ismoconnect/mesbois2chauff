import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { signInUser, resetPassword } from '../firebase/auth';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 10px;
  }
`;

const LoginTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: ${(p) => (p.$withLeftIcon ? '56px' : '16px')};
  padding-right: ${(p) => (p.$withRightAction ? '56px' : '16px')};
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding-left: ${(p) => (p.$withLeftIcon ? '52px' : '14px')};
    padding-right: ${(p) => (p.$withRightAction ? '52px' : '14px')};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
`;

const Button = styled.button`
  background: #2c5530;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  text-decoration: underline;
  
  &:hover {
    color: #1e3a22;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  
  a {
    color: #2c5530;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
`;

const Login = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const mapAuthError = (raw) => {
    if (!raw) return t("auth.error_generic");
    const msg = String(raw).toLowerCase();

    if (msg.includes('auth/invalid-login-credentials') || msg.includes('auth/wrong-password')) {
      return t("auth.error_invalid_credentials");
    }
    if (msg.includes('auth/user-not-found')) {
      return t("auth.error_user_not_found");
    }
    if (msg.includes('auth/too-many-requests')) {
      return t("auth.error_too_many_requests");
    }
    if (msg.includes('auth/network-request-failed')) {
      return t("auth.error_network_failed");
    }
    if (msg.includes('auth/user-disabled')) {
      return t("auth.error_user_disabled");
    }
    if (msg.includes('auth/invalid-email')) {
      return t("auth.error_invalid_email");
    }

    return t("auth.error_login_failed");
  };

  // Rediriger si déjà connecté (uniquement quand on est sur la page /login)
  React.useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (user && (path === '/login' || path.endsWith('/login'))) {
      navigate(`/${currentLang}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInUser(formData.email, formData.password);
      
      if (result.success) {
        toast.success(t('auth.login_success'));
        navigate(`/${currentLang}/dashboard`, { replace: true });
      } else {
        setError(mapAuthError(result.error));
      }
    } catch (err) {
      setError(t("auth.error_login_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailToUse = formData.email || resetEmail;
    if (!emailToUse) {
      setShowReset(true);
      return;
    }

    try {
      const result = await resetPassword(emailToUse.trim());
      if (result.success) {
        toast.success(t('auth.login_reset_email_sent'));
        setShowReset(false);
      } else {
        toast.error(mapAuthError(result.error));
      }
    } catch (err) {
      toast.error(t('auth.login_reset_email_error'));
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>{t('auth.login_title')}</LoginTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FiMail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder={t('auth.login_email_placeholder')}
              value={formData.email}
              onChange={handleChange}
              required
              $withLeftIcon
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FiLock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={t('auth.login_password_placeholder')}
              value={formData.password}
              onChange={handleChange}
              required
              $withLeftIcon
              $withRightAction
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </PasswordToggle>
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? t('auth.login_submitting') : t('auth.login_submit')}
          </Button>
          
          <ForgotPassword type="button" onClick={handleForgotPassword}>
            {t('auth.login_forgot_password')}
          </ForgotPassword>

          {showReset && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>
                {t('auth.login_reset_prompt')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  type="email"
                  name="resetEmail"
                  placeholder={t('auth.login_reset_email_placeholder')}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    background: '#2c5530',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('auth.login_reset_send')}
                </button>
              </div>
            </div>
          )}
        </Form>
        
        <SignupLink>
          {t('auth.login_no_account')} <Link to={`/${currentLang}/register`}>{t('auth.login_signup_link')}</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;


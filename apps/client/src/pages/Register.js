import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { createUser } from '../firebase/auth';
import toast from 'react-hot-toast';
import { sendEmailVerification, getAuth } from 'firebase/auth';

const RegisterContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 10px;
  }
`;

const RegisterTitle = styled.h1`
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 56px 12px 72px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding: 12px 52px 12px 64px;
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

const LoginLink = styled.div`
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

const PasswordRequirements = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  
  ul {
    margin: 5px 0;
    padding-left: 20px;
  }
`;

const Register = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const mapAuthError = (raw) => {
    if (!raw) return t('auth.error_generic');
    const msg = String(raw).toLowerCase();
    if (msg.includes('auth/email-already-in-use')) {
      return t("auth.error_email_in_use_full");
    }
    if (msg.includes('auth/invalid-email')) {
      return t("auth.error_invalid_email");
    }
    if (msg.includes('auth/weak-password')) {
      return t("auth.error_weak_password");
    }
    if (msg.includes('network') || msg.includes('request-failed')) {
      return t("auth.error_network");
    }
    return t('auth.error_generic');
  };

  // Rediriger si déjà connecté (uniquement quand on est sur la page /register)
  React.useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (user && (path === '/register' || path.endsWith('/register'))) {
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

  const validateForm = () => {
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('checkout.error_invalid_email'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register_password_mismatch'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('auth.register_password_requirement'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const displayName = `${(formData.firstName || '').trim()} ${(formData.lastName || '').trim()}`.trim();
      const result = await createUser(formData.email, formData.password, {
        displayName: displayName || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      });

      if (result.success) {
        try {
          // Set Firebase language to match user's chosen language
          const auth = getAuth();
          auth.languageCode = currentLang;

          await sendEmailVerification(result.user, {
            url: 'https://webshopbrennholzkaufen.boisdechauffages.com/auth/action',
            handleCodeInApp: true
          });
          toast.success(t('auth.register_email_verification'));
        } catch (errCode) {
          console.error("Erreur envoi email verification:", errCode);
          // On notifie quand même le succès de la création, mais on peut avertir pour l'email
          toast.success(t('auth.register_success'));
        }
        navigate(`/${currentLang}/dashboard`, { replace: true });
      } else {
        setError(mapAuthError(result.error));
      }
    } catch (err) {
      setError(mapAuthError(err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>{t('auth.register_title')}</RegisterTitle>

        {error && (
          <>
            <ErrorMessage>{error}</ErrorMessage>
            {error.includes('déjà utilisée') && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => navigate(`/${currentLang}/login`)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    background: '#2c5530',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('auth.register_go_to_login')}
                </button>
              </div>
            )}
          </>
        )}

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="firstName"
                placeholder={t('auth.register_firstname_placeholder')}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="lastName"
                placeholder={t('auth.register_lastname_placeholder')}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiPhone size={20} />
              </InputIcon>
              <Input
                type="tel"
                name="phone"
                placeholder={t('auth.register_phone_placeholder')}
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FiMail size={20} />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder={t('auth.register_email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title={t('checkout.error_invalid_email')}
                required
              />
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiLock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('auth.register_password_placeholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </PasswordToggle>
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FiLock size={20} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t('auth.register_confirm_password_placeholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </PasswordToggle>
            </InputGroup>
          </FormRow>

          <PasswordRequirements>
            {t('auth.register_password_requirement')}
          </PasswordRequirements>

          <InputGroup>
            <InputIcon>
              <FiMapPin size={20} />
            </InputIcon>
            <Input
              type="text"
              name="address"
              placeholder={t('auth.register_address_placeholder')}
              value={formData.address}
              onChange={handleChange}
            />
          </InputGroup>
          <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
            {t('auth.register_address_notice')}
          </div>

          <FormRow>
            <InputGroup>
              <Input
                type="text"
                name="city"
                placeholder={t('auth.register_city_placeholder')}
                value={formData.city}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                name="postalCode"
                placeholder={t('auth.register_postal_code_placeholder')}
                value={formData.postalCode}
                onChange={handleChange}
              />
            </InputGroup>
          </FormRow>

          <Button type="submit" disabled={loading}>
            {loading ? t('auth.register_creating') : t('auth.register_create_account')}
          </Button>
        </Form>

        <LoginLink>
          {t('auth.register_have_account')} <Link to={`/${currentLang}/login`}>{t('auth.register_login_link')}</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 40px;
  
  @media (max-width: 768px) {
    padding: 0 16px 20px;
  }
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const ContactTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 15px;
`;

const ContactSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const InfoTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 30px;
  
  svg {
    color: #2c5530;
    margin-top: 5px;
  }
  
  div {
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #2c5530;
      margin-bottom: 5px;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
  }
`;

const ContactForm = styled.form`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const FormTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const SubmitButton = styled.button`
  background: #2c5530;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const MapSection = styled.div`
  margin-top: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
`;

const MapTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
`;

const MapPlaceholder = styled.div`
  background: #FFFFFF;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 15px;
  }
  
  p {
    font-size: 16px;
  }
`;

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(t('contact.success_message'));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('contact.error_message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <ContactTitle>{t('contact.page_title')}</ContactTitle>
        <ContactSubtitle>
          {t('contact.page_subtitle')}
        </ContactSubtitle>
      </ContactHeader>

      <ContactContent>
        <ContactInfo>
          <InfoTitle>
            <FiMessageCircle size={24} />
            {t('contact.info_title')}
          </InfoTitle>

          <InfoItem>
            <FiMapPin size={20} />
            <div>
              <h4>{t('contact.address_label')}</h4>
              <p>
                {t('contact.address_value').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </InfoItem>

          <InfoItem>
            <FiPhone size={20} />
            <div>
              <h4>{t('contact.phone_label')}</h4>
              <p>+33 1 23 45 67 89</p>
            </div>
          </InfoItem>

          <InfoItem>
            <FiMail size={20} />
            <div>
              <h4>{t('contact.email_label')}</h4>
              <p>contact@boisdechauffage.fr</p>
            </div>
          </InfoItem>

          <InfoItem>
            <FiClock size={20} />
            <div>
              <h4>{t('contact.hours_label')}</h4>
              <p>
                {t('contact.hours_weekdays')}<br />
                {t('contact.hours_saturday')}<br />
                {t('contact.hours_sunday')}
              </p>
            </div>
          </InfoItem>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>
            <FiSend size={24} />
            {t('contact.form_title')}
          </FormTitle>

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">{t('contact.form_firstname')} *</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">{t('contact.form_lastname')} *</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="email">{t('contact.form_email')} *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">{t('contact.form_phone')}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="subject">{t('contact.form_subject')} *</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">{t('contact.form_message')} *</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            <FiSend size={20} />
            {loading ? t('contact.form_sending') : t('contact.form_submit')}
          </SubmitButton>
        </ContactForm>
      </ContactContent>

      <MapSection>
        <MapTitle>{t('contact.map_title')}</MapTitle>
        <MapPlaceholder>
          <FiMapPin size={48} />
          <p>{t('contact.map_placeholder')}</p>
        </MapPlaceholder>
      </MapSection>
    </ContactContainer>
  );
};

export default Contact;

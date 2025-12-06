import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 16px 0;
`;

const Stars = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => (props.active ? '#f5a524' : '#ccc')};
  font-size: 28px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  outline: none;
  &:focus { border-color: #2c5530; }
`;

const Submit = styled.button`
  margin-top: 16px;
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const OrderReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = () => {
    // TODO: enregistrer l'avis en base si souhaité
    navigate('/orders');
  };

  return (
    <DashboardLayout>
      <Container>
        <BackButton onClick={() => navigate('/orders')}>
          <FiArrowLeft /> Retour
        </BackButton>
        <Card>
          <Title>Laisser un avis — Commande #{id?.slice?.(-8) || id}</Title>
          <Stars>
            {[1,2,3,4,5].map(n => (
              <StarButton key={n} type="button" active={n <= rating} onClick={() => setRating(n)}>
                <FiStar />
              </StarButton>
            ))}
          </Stars>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Votre commentaire (optionnel)" />
          <Submit onClick={submit} disabled={rating === 0}>Envoyer l'avis</Submit>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default OrderReview;

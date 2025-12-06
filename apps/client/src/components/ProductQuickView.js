import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiStar, FiShoppingCart } from 'react-icons/fi';
import { useProductImages } from '../hooks/useProductImages';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => (props.open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Dialog = styled.div`
  position: relative;
  background: #ffffff;
  width: min(1100px, 95vw);
  height: min(88vh, 900px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.25);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 92vh;
    width: 96vw;
    border-radius: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #f3f4f6;
  border: none;
  color: #111827;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover { background: #e5e7eb; }

  @media (max-width: 768px) {
    top: calc(env(safe-area-inset-top, 0px) + 10px);
    right: calc(env(safe-area-inset-right, 0px) + 10px);
    width: 48px;
    height: 48px;
    background: rgba(243, 244, 246, 0.9);
    backdrop-filter: saturate(120%) blur(4px);
  }
`;

const Left = styled.div`
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 12px;
    height: 40vh;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: #ffffff;
`;

const Right = styled.div`
  padding: 28px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #2c5530;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #27ae60;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f39c12;
  margin-bottom: 16px;

  .text { color: #6b7280; font-size: 14px; }

  @media (max-width: 768px) {
    .text { font-size: 13px; }
  }
`;

const Stock = styled.div`
  font-size: 12px;
  color: ${p => (p.instock ? '#155724' : '#721c24')};
  background: ${p => (p.instock ? '#d4edda' : '#f8d7da')};
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 11.5px;
  }
`;

const Description = styled.p`
  color: #4b5563;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 16px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: #2c5530;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover { background: #1e3a22; transform: translateY(-1px); }
  &:disabled { background: #c7c7c7; cursor: not-allowed; }

  @media (max-width: 768px) {
    padding: 10px 14px;
    border-radius: 8px;
  }
`;

export default function ProductQuickView({ open, product, onClose, onAddToCart }) {
  const { productImages } = useProductImages();
  
  useEffect(() => {
    if (!open) return;
    const handleKey = e => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  // Utiliser l'image centralisée si disponible, sinon l'image du produit
  // Sinon utiliser une image temporaire basée sur l'ID via picsum
  const imageUrl = productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/900/700`;

  return (
    <Overlay open={open} onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()}>
        <CloseButton aria-label="Fermer" onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
        <Left>
          <ProductImage
            src={imageUrl}
            alt={product.name}
            onError={e => { e.currentTarget.src = 'https://picsum.photos/seed/fallback/900/700'; }}
          />
          
        </Left>
        <Right>
          <Title>{product.name}</Title>
          <Price>{product.price}€</Price>
          <Rating>
            <FiStar size={16} />
            <span className="text">{product.rating || 4.5} ({product.reviewCount || 0} avis)</span>
          </Rating>
          <Stock instock={(product.stock || 0) > 0}>
            {(product.stock || 0) > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
          </Stock>
          <Description>{product.description}</Description>
          <Actions>
            <AddToCartButton onClick={() => onAddToCart?.(product)} disabled={(product.stock || 0) === 0}>
              <FiShoppingCart size={18} />
              Ajouter au panier
            </AddToCartButton>
          </Actions>
        </Right>
      </Dialog>
    </Overlay>
  );
}

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { getCategoryImage } from '../../utils/categoryImages';
import { useProductImages } from '../../hooks/useProductImages';
import toast from 'react-hot-toast';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    &:hover { transform: none; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 150px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => props.type === 'sale' ? '#e74c3c' : '#2c5530'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c5530;
  line-height: 1.4;
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2c5530;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f39c12;
  font-size: 14px;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const StockInfo = styled.div`
  font-size: 12px;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  margin-bottom: 15px;
  font-weight: 500;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #2c5530;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #1e3a22;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 10px;
    font-weight: 700;
  }
`;

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const isInCartItem = isInCart(product.id);

  const { productImages, loading } = useProductImages();

  // Choix de l'image (priorité): image centralisée produit > image produit > image catégorie > placeholder picsum
  const imageUrl = productImages[product.id] || product.image || getCategoryImage(product.category) || `https://picsum.photos/seed/${product.id}/600/400`;

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.dismiss('add-to-cart');
    toast.custom((toastObj) => (
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
            padding: '20px 18px 16px',
            maxWidth: '90vw',
            width: 320,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '22vh'
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            {t('product_card.product_added_title')}
          </div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            {t('product_card.product_added_question')}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => toast.dismiss(toastObj.id)}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '8px 10px',
                borderRadius: 999,
                border: '1px solid #ccc',
                background: '#fff',
                color: '#333',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {t('product_card.continue_shopping')}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastObj.id);
                navigate(`/${currentLang}/cart`);
              }}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '8px 10px',
                borderRadius: 999,
                border: 'none',
                background: '#e95420',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('product_card.view_cart')}
            </button>
          </div>
        </div>
      </div>
    ), {
      id: 'add-to-cart',
      duration: 100,
      position: 'top-center'
    });
  };

  return (
    <CardContainer>
      <ImageContainer>
        <ProductImage
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://picsum.photos/seed/fallback/600/400';
          }}
        />
        
        {product.sale && (
          <Badge type="sale">{t('product_card.promo')}</Badge>
        )}
        {product.new && (
          <Badge type="new">{t('product_card.new')}</Badge>
        )}
      </ImageContainer>

      <CardContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>

        <ProductInfo>
          <Price>{product.price}€</Price>
          <Rating>
            <FiStar size={14} />
            <span>{product.rating || 4.5}</span>
          </Rating>
        </ProductInfo>

        <StockInfo inStock={product.stock > 0}>
          {product.stock > 0 ? `${t('product_card.in_stock')} (${product.stock})` : t('product_card.out_of_stock')}
        </StockInfo>

        <AddToCartButton
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCartItem}
        >
          <FiShoppingCart size={16} />
          {isInCartItem ? t('product_card.in_cart') : t('product_card.add_to_cart')}
        </AddToCartButton>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;

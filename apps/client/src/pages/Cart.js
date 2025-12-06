import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { translateProductName } from '../utils/productTranslations';

const CartContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px 96px;
  
  @media (max-width: 600px) {
    padding: 24px 16px 32px;
  }
`;

const ClearCartButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: #e74c3c;
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.05s ease;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.25);
  &:hover { background: #c0392b; }
  &:active { transform: translateY(1px); }
`;

const CartHeader = styled.div`
  display: flex;
  flex-direction: column; /* Titre sous le lien retour */
  align-items: flex-start;
  gap: 10px;
  margin-top: 0;
  margin-bottom: 24px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #1e3a22;
  }
`;

const CartTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  
  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 24px 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const ItemImage = styled.img`
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  
  @media (max-width: 600px) {
    width: 84px;
    height: 84px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 5px;
  
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ItemDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c5530;
  
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  
  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5530;
    color: #2c5530;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 600px) {
    width: 32px;
    height: 32px;
  }
`;

const QuantityInput = styled.input`
  width: 64px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
  
  @media (max-width: 600px) {
    width: 56px;
    padding: 6px;
  }
`;



const RemoveIconButton = styled.button`
  background: #fff5f5;
  color: #c0392b;
  border: 1px solid #ffd9d9;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover { background: #ffecec; border-color: #ffc9c9; }
`;

const SummaryItems = styled.div`
  margin: 10px 0 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
`;

const SummaryItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-top: 1px solid #eee;
  &:first-child { border-top: none; }
  small { color: #666; }
  strong { color: #2c5530; }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ShopButton = styled(Link)`
  display: inline-block;
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
    top: auto;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  
  &.total {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
  }
  
  @media (max-width: 600px) {
    font-size: 14px;
    &.total { font-size: 16px; }
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: #219a52;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;



const LoginPrompt = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  
  p {
    margin: 0 0 10px 0;
    color: #856404;
  }
  
  a {
    color: #2c5530;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Cart = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate(`/${currentLang}/checkout`);
      return;
    }
    navigate(`/${currentLang}/checkout`);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <BackButton to={`/${currentLang}/products`}>
            <FiArrowLeft size={20} />
            {t('cart.back_to_products')}
          </BackButton>
          <CartTitle>
            <FiShoppingBag size={32} />
            {t('cart.my_cart')}
          </CartTitle>
        </CartHeader>

        <EmptyCart>
          <FiShoppingBag size={64} />
          <h3>{t('cart.empty_cart_title')}</h3>
          <p>{t('cart.empty_cart_message')}</p>
          <ShopButton to={`/${currentLang}/products`}>{t('cart.start_shopping')}</ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <BackButton to={`/${currentLang}/products`}>
          <FiArrowLeft size={20} />
          {t('cart.back_to_products')}
        </BackButton>
        <CartTitle>
          <FiShoppingBag size={32} />
          {t('cart.my_cart')} ({cartItems.length} {cartItems.length > 1 ? t('cart.cart_items_count_plural') : t('cart.cart_items_count')})
        </CartTitle>
      </CartHeader>

      <CartContent>
        <CartItems>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <ClearCartButton onClick={clearCart}>
              <FiTrash2 size={16} /> {t('cart.clear_cart')}
            </ClearCartButton>
          </div>
          {cartItems.map((item, idx) => (
            <CartItem key={item.id || item.productId || `${item.name || 'item'}-${idx}`}>
              <RemoveIconButton onClick={() => removeFromCart(item.id)} aria-label={t('cart.remove_item')}>
                <FiTrash2 size={16} />
              </RemoveIconButton>
              <ItemImage
                src={item.image || 'https://picsum.photos/seed/fallback/96/96'}
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/seed/fallback/96/96';
                }}
              />
              <ItemInfo>
                <ItemName>{translateProductName(item.name, i18n.language)}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
                <ItemPrice>{(Number(item.price) || 0)}€ {t('cart.per_unit')}</ItemPrice>

                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={16} />
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FiPlus size={16} />
                  </QuantityButton>
                </QuantityControls>
              </ItemInfo>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '10px' }}>
                  {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}€
                </div>
              </div>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>{t('cart.order_summary')}</SummaryTitle>
          {/* Résumé simplifié: uniquement les totaux, sans liste des articles */}

          {!user && (
            <LoginPrompt>
              <p>{t('cart.create_account_next')}</p>
              <Link to={`/${currentLang}/checkout`}>{t('cart.continue_payment')}</Link>
            </LoginPrompt>
          )}

          <SummaryRow>
            <span>{t('cart.subtotal')}</span>
            <span>{subtotal.toFixed(2)}€</span>
          </SummaryRow>

          <SummaryRow>
            <span>{t('cart.shipping')}</span>
            <span>{shipping === 0 ? t('cart.free') : `${shipping.toFixed(2)}€`}</span>
          </SummaryRow>

          {shipping > 0 && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              {t('cart.free_shipping_notice')}
            </div>
          )}

          <SummaryRow className="total">
            <span>{t('cart.total')}</span>
            <span>{total.toFixed(2)}€</span>
          </SummaryRow>

          <CheckoutButton
            onClick={() => navigate(`/${currentLang}/products`)}
            style={{ background: 'white', color: '#2c5530', border: '1px solid #2c5530', marginBottom: '10px', marginTop: '0' }}
          >
            {t('cart.continue_shopping')}
          </CheckoutButton>
          <CheckoutButton onClick={handleCheckout}>
            {user ? t('cart.finalize_order') : t('cart.continue_payment')}
          </CheckoutButton>
        </CartSummary>
      </CartContent>


    </CartContainer>
  );
};

export default Cart;


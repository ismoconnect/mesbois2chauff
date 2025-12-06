import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { createOrder } from '../firebase/orders';
import toast from 'react-hot-toast';
import { getCouponByCode, validateAndComputeDiscount } from '../firebase/coupons';
import { translateProductName } from '../utils/productTranslations';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 16px;
  word-break: break-word;
  overflow-wrap: break-word;
  @media (max-width: 768px) { padding: 0 8px 12px; }
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 0 20px 0;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 8px;
  &:hover { color: #1e3a22; }
  @media (max-width: 600px) { gap: 6px; }
`;

const CartTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  @media (max-width: 600px) { font-size: 22px; gap: 8px; }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  width: 100%;
  min-width: 0;
  @media (max-width: 1024px) { grid-template-columns: 1fr 320px; gap: 18px; }
  @media (max-width: 768px) { 
    grid-template-columns: 1fr; 
    gap: 12px;
    min-width: 0;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
  min-width: 0;
  overflow: hidden;
  @media (max-width: 768px) { 
    padding: 12px;
    min-width: 0;
  }
`;

const ClearCartButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: #e74c3c;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  &:hover { background: #c0392b; }
  &:active { transform: scale(0.98); }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
  @media (max-width: 600px) { flex-direction: column; align-items: stretch; gap: 8px; padding: 8px 0; }
`;

const ItemImage = styled.img`
  width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;
  @media (max-width: 768px) { width: 72px; height: 72px; }
  @media (max-width: 600px) { width: 64px; height: 64px; }
`;

const ItemInfo = styled.div`
  flex: 1; min-width: 0;
`;

const ItemName = styled.h3`
  font-size: 16px; font-weight: 600; color: #2c5530; margin-bottom: 4px;
  @media (max-width: 600px) { font-size: 15px; }
`;

const ItemDescription = styled.p`
  color: #666; font-size: 13px; margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemPrice = styled.div`
  font-size: 15px; font-weight: 600; color: #2c5530;
`;

const QuantityControls = styled.div`
  display: flex; align-items: center; gap: 6px; margin: 6px 0;
  @media (max-width: 600px) { flex-wrap: wrap; }
`;

const QuantityButton = styled.button`
  width: 30px; height: 30px; border: 2px solid #e0e0e0; background: white; border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
  &:hover { border-color: #2c5530; color: #2c5530; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const QuantityInput = styled.input`
  width: 50px; text-align: center; border: 2px solid #e0e0e0; border-radius: 6px; padding: 6px; font-weight: 600;
  &:focus { outline: none; border-color: #2c5530; }
  @media (max-width: 600px) { width: 46px; }
`;

const RemoveButton = styled.button`
  background: #e74c3c; color: white; border: none; padding: 6px 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 11px;
  &:hover { background: #c0392b; }
`;

const EmptyCart = styled.div`
  text-align: center; padding: 60px 20px; color: #666;
  svg { font-size: 64px; color: #ccc; margin-bottom: 20px; }
  h3 { font-size: 24px; margin-bottom: 10px; color: #2c5530; }
`;

const ShopButton = styled(Link)`
  display: inline-block; background: #2c5530; color: white; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;
  &:hover { background: #1e3a22; }
`;

const CartSummary = styled.div`
  background: white; 
  border-radius: 12px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
  padding: 16px; 
  height: fit-content; 
  position: sticky; 
  top: 16px;
  min-width: 0;
  overflow: hidden;
  @media (max-width: 768px) { 
    position: static; 
    top: auto; 
    padding: 12px;
    min-width: 0;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 16px; font-weight: 700; color: #2c5530; margin-bottom: 12px;
  @media (max-width: 600px) { font-size: 15px; }
`;

const SummaryRow = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 10px; color: #666; font-size: 14px;
  &.total { font-size: 16px; font-weight: 700; color: #2c5530; border-top: 2px solid #f0f0f0; padding-top: 10px; margin-top: 10px; }
  @media (max-width: 600px) { font-size: 13px; &.total { font-size: 15px; } }
`;

const CheckoutButton = styled.button`
  width: 100%; background: #27ae60; color: white; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer;
  &:hover { background: #219a52; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const LoginPrompt = styled.div`
  background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin-bottom: 16px; text-align: center;
  p { margin: 0 0 8px 0; color: #856404; }
  a { color: #2c5530; text-decoration: none; font-weight: 600; }
`;

const CouponContainer = styled.div`
  margin: 16px 0 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #FFFFFF;
  border: 1px solid #e0e0e0;
`;

const CouponForm = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  font-size: 13px;
  outline: none;
  &:focus { border-color: #2c5530; }
`;

const CouponButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #2c5530;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const DashboardCart = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || i18n.language || 'fr';

  // Sync i18n language with URL parameter
  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank'); // 'bank' ou 'paypal'

  const showCenterAlert = (message, type = 'error') => {
    toast.dismiss('dashboard-alert');
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
      id: 'dashboard-alert',
      duration: 2500,
      position: 'top-center'
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate(`/${currentLang}/login`, { state: { from: { pathname: '/dashboard/cart' } } });
      return;
    }

    try {
      const subtotal = getCartTotal();
      const shipping = subtotal > 50 ? 0 : 9.99;
      const total = Math.max(0, subtotal - discount) + shipping;
      const orderData = {
        userId: user.uid,
        items: cartItems,
        delivery: { method: 'standard', cost: shipping },
        payment: { method: paymentMethod },
        total,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value,
          discount,
        } : null,
      };

      const res = await createOrder(orderData);
      if (res.success) {
        try {
          const displayName = (user.displayName || '').trim();
          const firstName = displayName ? displayName.split(' ')[0] : '';
          const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';
          const customerEmail = ((user && user.email) || (orderData && orderData.customerInfo && orderData.customerInfo.email) || '').trim();
          if (!customerEmail) {
            showCenterAlert(t('dashboard.cart.no_email'), 'error');
            return;
          }
          const emailPayload = {
            orderId: res.id,
            total: orderData.total,
            items: Array.isArray(orderData.items) ? orderData.items.map(it => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price,
            })) : [],
            customer: {
              firstName,
              lastName,
              email: customerEmail,
            },
            newUser: false,
          };
          fetch('/api/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
            keepalive: true,
          }).catch(() => { });
        } catch (_) { /* ignore */ }
        clearCart();
        navigate(`/${currentLang}/billing`);
      } else {
        showCenterAlert(res.error || t('dashboard.cart.cannot_create_order'), 'error');
      }
    } catch (e) {
      showCenterAlert(t('dashboard.cart.order_creation_error'), 'error');
    }
  };
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount) + shipping;

  useEffect(() => {
    if (!appliedCoupon) return;
    const { valid, discount: d } = validateAndComputeDiscount(appliedCoupon, subtotal);
    setDiscount(valid ? Number(d.toFixed(2)) : 0);
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = async () => {
    const raw = (couponCode || '').trim();
    if (!raw) {
      showCenterAlert(t('dashboard.cart.enter_code'), 'error');
      return;
    }
    try {
      setApplyingCoupon(true);
      const res = await getCouponByCode(raw);
      if (!res.success || !res.data) {
        setAppliedCoupon(null);
        setDiscount(0);
        showCenterAlert(res.error || t('dashboard.cart.invalid_code'), 'error');
        return;
      }
      const coupon = res.data;
      const { valid, discount: d, reason } = validateAndComputeDiscount(coupon, subtotal);
      if (!valid) {
        setAppliedCoupon(null);
        setDiscount(0);
        showCenterAlert(reason || t('dashboard.cart.code_not_applicable'), 'error');
        return;
      }
      setAppliedCoupon(coupon);
      setDiscount(Number(d.toFixed(2)));
      toast.dismiss('coupon-applied');
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
              padding: '20px 18px 16px',
              maxWidth: '90vw',
              width: 320,
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
              marginTop: '22vh'
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Code promo appliqué avec succès.
            </div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
              Votre remise a été prise en compte sur le total.
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
        id: 'coupon-applied',
        duration: 1000,
        position: 'top-center'
      });
    } catch (err) {
      showCenterAlert(t('dashboard.cart.cannot_apply_code'), 'error');
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <DashboardLayout>
      <CartContainer>
        <BackButton to={`/${currentLang}/dashboard/products`}>
          <FiArrowLeft size={20} />
          {t('dashboard.cart.back_to_products')}
        </BackButton>
        <CartHeader>
          <CartTitle>
            <FiShoppingBag size={28} />
            {t('dashboard.cart.my_cart')} ({cartItems.length} {t('dashboard.cart.items_count', { count: cartItems.length })})
          </CartTitle>
        </CartHeader>

        {cartItems.length === 0 ? (
          <EmptyCart>
            <FiShoppingBag size={64} />
            <h3>{t('dashboard.cart.empty_cart_title')}</h3>
            <ShopButton to={`/${currentLang}/dashboard/products`}>{t('dashboard.cart.start_shopping')}</ShopButton>
          </EmptyCart>
        ) : (
          <CartContent>
            <CartItems>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <ClearCartButton onClick={clearCart}>
                  <FiTrash2 size={16} /> {t('dashboard.cart.clear_cart')}
                </ClearCartButton>
              </div>
              {cartItems.map(item => (
                <CartItem key={item.id}>
                  <ItemImage src={item.image || '/placeholder-wood.jpg'} alt={item.name} onError={(e) => { e.target.src = '/placeholder-wood.jpg'; }} />
                  <ItemInfo>
                    <ItemName>{translateProductName(item.name, currentLang)}</ItemName>
                    <ItemDescription>{item.description}</ItemDescription>
                    <ItemPrice>{item.price}{t('dashboard.cart.per_unit')}</ItemPrice>
                    <QuantityControls>
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <FiMinus size={16} />
                      </QuantityButton>
                      <QuantityInput type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)} min="1" />
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <FiPlus size={16} />
                      </QuantityButton>
                    </QuantityControls>
                  </ItemInfo>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c5530', marginBottom: '8px' }}>
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      <FiTrash2 size={14} />
                      {t('dashboard.cart.remove')}
                    </RemoveButton>
                  </div>
                </CartItem>
              ))}
            </CartItems>

            <CartSummary>
              <SummaryTitle>{t('dashboard.cart.order_summary')}</SummaryTitle>
              {!user && (
                <LoginPrompt>
                  <p>{t('dashboard.cart.login_prompt')}</p>
                  <Link to={`/${currentLang}/login`}>{t('dashboard.cart.login')}</Link>
                </LoginPrompt>
              )}
              <CouponContainer>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#2c5530' }}>
                  {t('dashboard.cart.coupon_question')}
                </div>
                <CouponForm>
                  <CouponInput
                    type="text"
                    placeholder={t('dashboard.cart.coupon_placeholder')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <CouponButton type="button" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                    {applyingCoupon ? 'Application…' : 'Appliquer'}
                  </CouponButton>
                </CouponForm>
                {appliedCoupon && discount > 0 && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#2c5530' }}>
                    {t('dashboard.cart.code_applied')} <strong>{appliedCoupon.code}</strong>
                  </div>
                )}
              </CouponContainer>
              <SummaryRow>
                <span>{t('dashboard.cart.subtotal')}</span>
                <span>{subtotal.toFixed(2)}€</span>
              </SummaryRow>
              {discount > 0 && (
                <SummaryRow>
                  <span>{t('dashboard.cart.discount')}{appliedCoupon?.code ? ` (${appliedCoupon.code})` : ''}</span>
                  <span>-{discount.toFixed(2)}€</span>
                </SummaryRow>
              )}
              <SummaryRow>
                <span>{t('dashboard.cart.shipping')}</span>
                <span>{shipping === 0 ? t('dashboard.cart.free') : `${shipping.toFixed(2)}€`}</span>
              </SummaryRow>
              {shipping > 0 && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                  {t('dashboard.cart.free_shipping_info')}
                </div>
              )}
              <SummaryRow className="total">
                <span>{t('dashboard.cart.total')}</span>
                <span>{total.toFixed(2)}€</span>
              </SummaryRow>

              {/* Payment Method Selection */}
              <div style={{ marginTop: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#2c5530', marginBottom: 10 }}>
                  {t('dashboard.cart.payment_method')}
                </div>
                <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '2px solid',
                    borderColor: paymentMethod === 'bank' ? '#2c5530' : '#e0e0e0',
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'bank' ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: paymentMethod === 'bank' ? 600 : 400, fontSize: 14 }}>
                      {t('dashboard.cart.bank_transfer')}
                    </span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '2px solid',
                    borderColor: paymentMethod === 'paypal' ? '#2c5530' : '#e0e0e0',
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'paypal' ? '#f0fdf4' : 'white',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: paymentMethod === 'paypal' ? 600 : 400, fontSize: 14 }}>
                      {t('dashboard.cart.paypal')}
                    </span>
                  </label>
                </div>
              </div>

              <CheckoutButton onClick={handleCheckout} disabled={cartItems.length === 0}>
                {user ? t('dashboard.cart.finalize_order') : t('dashboard.cart.login_to_order')}
              </CheckoutButton>
            </CartSummary>
          </CartContent>
        )}
      </CartContainer>
    </DashboardLayout>
  );
};

export default DashboardCart;

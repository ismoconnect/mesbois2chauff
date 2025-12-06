import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useProductImages } from '../hooks/useProductImages';
import { getProductById } from '../firebase/products';
import { products as catalogue } from '../data/catalogue.js';
import { translateProductName } from '../utils/productTranslations';
import toast from 'react-hot-toast';



const ProductDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  
  &:hover {
    color: #1e3a22;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  @media (max-width: 992px) {
    gap: 24px;
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: contain; /* show the entire product without cropping */
  border-radius: 12px;
  background: #ffffff; /* neutral backdrop around contained image */
  
  @media (max-width: 992px) {
    height: 280px;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const ProductInfo = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
  }
  
  .price {
    font-size: 28px;
    font-weight: 700;
    color: #27ae60;
    margin-bottom: 20px;
  }
  
  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  .stars {
    display: flex;
    gap: 2px;
    color: #f39c12;
  }
  
  .rating-text {
    color: #666;
    font-size: 14px;
  }
`;

const StockInfo = styled.div`
  background: ${props => props.inStock ? '#d4edda' : '#f8d7da'};
  color: ${props => props.inStock ? '#155724' : '#721c24'};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-weight: 600;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  
  label {
    font-weight: 600;
    color: #333;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
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
`;

const QuantityInput = styled.input`
  width: 80px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  font-weight: 600;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const AddToCartButton = styled.button`
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
  margin-bottom: 20px;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #FFFFFF;
  border-radius: 8px;
  
  svg {
    color: #2c5530;
  }
  
  div {
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #2c5530;
      margin-bottom: 5px;
    }
    
    p {
      font-size: 12px;
      color: #666;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const ProductDetail = () => {
  const { id, lang } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = lang || 'fr';
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { productImages } = useProductImages();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await getProductById(id);

        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          // Fallback local catalogue
          const mapMainToCategory = (main) => {
            const m = (main || '').toLowerCase();
            if (['bois', 'bûches', 'buches', 'charbon'].includes(m)) return 'bûches';
            if (['pellets', 'granulés', 'granules'].includes(m)) return 'pellets';
            if (['allumage', 'accessoires'].includes(m)) return 'accessoires';
            if (['poêles', 'poeles'].includes(m)) return 'poêles';
            if (['bûches densifiées', 'buches densifiees', 'densifiees'].includes(m)) return 'bûches densifiées';
            return '';
          };

          const buildFromCatalogue = (p, idx) => ({
            id: p.id || `p-${idx}`,
            name: p.name,
            description: [p.vendor, p.regularPrice ? `(${t('product_detail.regular_price')} ${p.regularPrice}€)` : null].filter(Boolean).join(' · '),
            price: p.price,
            regularPrice: p.regularPrice,
            category: mapMainToCategory(p.main),
            type: '',
            stock: 1,
            image: `https://picsum.photos/seed/${p.id || `p-${idx}`}/1000/700`,
            rating: 0,
            reviewCount: 0,
            sale: p.regularPrice ? p.price < p.regularPrice : false,
            new: false,
            weight: '',
            dimensions: '',
            humidity: '',
            calorificValue: ''
          });

          let local = null;
          if (id && id.startsWith('p-')) {
            const idx = parseInt(id.split('-')[1], 10);
            if (!Number.isNaN(idx) && idx >= 0 && idx < catalogue.length) {
              local = buildFromCatalogue(catalogue[idx], idx);
            }
          }
          if (!local) {
            const idx = catalogue.findIndex(p => String(p.id) === String(id));
            if (idx !== -1) local = buildFromCatalogue(catalogue[idx], idx);
          }

          if (local) {
            setProduct(local);
          } else {
            setError(result.error || t('product_detail.product_not_found'));
          }
        }
      } catch (err) {
        setError(t('product_detail.loading_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (!product) return;
    const max = product?.stock ?? 0;
    if (newQuantity >= 1 && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.dismiss('add-to-cart');
    toast.custom((toastInstance) => (
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
            {t('product_detail.success_message')}
          </div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            {t('product_detail.what_next')}
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
              onClick={() => toast.dismiss(toastInstance.id)}
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
              {t('product_detail.continue_shopping')}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastInstance.id);
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
              {t('product_detail.view_cart')}
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

  if (error) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>
          <h3>{t('product_detail.error')}</h3>
          <p>{error}</p>
        </ErrorMessage>
      </ProductDetailContainer>
    );
  }

  const view = product || {
    id,
    name: t('products.title'),
    description: '',
    price: '',
    stock: 0,
    image: `https://picsum.photos/seed/${id}/1000/700`,
    rating: 4.5,
    reviewCount: 0
  };

  const isInCartItem = product ? isInCart(product.id) : false;
  const cartItem = product ? getCartItem(product.id) : null;

  const handleBack = () => {
    // Si on a un historique, on retourne en arrière
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Sinon, on redirige vers la page produits
      navigate(`/${currentLang}/products`);
    }
  };

  return (
    <ProductDetailContainer>
      <BackButton onClick={handleBack}>
        <FiArrowLeft size={20} />
        {t('product_detail.back')}
      </BackButton>

      <ProductContainer>
        <div>
          <ProductImage
            src={productImages[view.id] || view.image || `https://picsum.photos/seed/${view.id}/1000/700`}
            alt={view.name}
            onError={(e) => {
              e.target.src = 'https://picsum.photos/seed/fallback/1000/700';
            }}
          />
        </div>

        <ProductInfo>
          <h1>{translateProductName(view.name, i18n.language)}</h1>
          <div className="price">{view.price}{view.price !== '' ? '€' : ''}</div>

          <Rating>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  fill={i < Math.floor(view.rating || 4.5) ? '#f39c12' : 'none'}
                />
              ))}
            </div>
            <span className="rating-text">
              {view.rating || 4.5} ({view.reviewCount || 0} {t('product_detail.reviews')})
            </span>
          </Rating>

          <StockInfo inStock={view.stock > 0}>
            {view.stock > 0
              ? `${t('product_detail.in_stock')} (${view.stock} ${t('product_detail.available')})`
              : t('product_detail.out_of_stock')
            }
          </StockInfo>

          <p className="description">{translateProductName(view.description, i18n.language)}</p>

          <QuantitySelector>
            <label>{t('product_detail.quantity')}</label>
            <QuantityControls>
              <QuantityButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={!product || quantity <= 1}
              >
                <FiMinus size={16} />
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={view.stock}
              />
              <QuantityButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!product || quantity >= view.stock}
              >
                <FiPlus size={16} />
              </QuantityButton>
            </QuantityControls>
          </QuantitySelector>

          <AddToCartButton
            onClick={handleAddToCart}
            disabled={!product || view.stock === 0}
          >
            <FiShoppingCart size={20} />
            {isInCartItem
              ? `${t('product_detail.added_to_cart')} (${cartItem.quantity})`
              : t('product_detail.add_to_cart')
            }
          </AddToCartButton>

          <Features>
            <Feature>
              <FiTruck size={24} />
              <div>
                <h4>{t('product_detail.fast_delivery')}</h4>
                <p>{t('product_detail.delivery_time')}</p>
              </div>
            </Feature>

            <Feature>
              <FiShield size={24} />
              <div>
                <h4>{t('product_detail.guaranteed_quality')}</h4>
                <p>{t('product_detail.certified_product')}</p>
              </div>
            </Feature>
          </Features>
        </ProductInfo>
      </ProductContainer>
    </ProductDetailContainer>
  );
};

export default ProductDetail;


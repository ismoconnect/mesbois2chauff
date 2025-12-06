import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiFilter, FiGrid, FiList, FiStar, FiShoppingCart, FiTag, FiTruck, FiShield, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { products as catalogue } from '../data/catalogue.js';
import { useCart } from '../contexts/CartContext';
import { useProductImages } from '../hooks/useProductImages';
import toast from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { translateProductName } from '../utils/productTranslations';

const ProductsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 40px;
  
  @media (max-width: 768px) {
    padding: 0 16px 20px;
    margin-top: 0;
  }
  
  @media (max-width: 480px) {
    margin-top: 0;
  }
  
  @media (max-width: 375px) {
    margin-top: 0;
  }
`;



const CategoriesNav = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 10px;
  border: 2px solid ${p => p.$active ? '#2c5530' : '#e0e0e0'};
  background: ${p => p.$active ? '#2c5530' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#2c5530'};
  font-weight: 700;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-top: 8px;
  }
`;

const StatCard = styled.div`
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  min-height: 120px;

  @media (max-width: 768px) {
    padding: 6px;
    border-radius: 8px;
    min-height: 66px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    h4 { font-size: 12px; margin: 0 0 2px 0; line-height: 1.1; }
    p { font-size: 10px; margin: 0; }
    svg { width: 16px; height: 16px; margin-bottom: 4px; }
  }

  @media (max-width: 400px) {
    h4 { font-size: 10px; }
    p { font-size: 9px; }
    svg { width: 14px; height: 14px; }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 4px;
  }
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin: 0 0 10px; /* remove default top margin */
  
  @media (max-width: 768px) {
    font-size: 21px;
    margin: 0 0 3px;
  }
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const FiltersSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 16px;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const FiltersTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

const ViewToggleButton = styled.button`
  padding: 8px;
  border: 2px solid ${props => props.active ? '#2c5530' : '#e0e0e0'};
  background: ${props => props.active ? '#2c5530' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const FilterGroup = styled.div`
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
    font-size: 14px;
  }
  
  select, input:not([type='checkbox']) {
    width: 100%;
    padding: 8px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #2c5530;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  padding: 4px 0;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    vertical-align: middle;
    position: relative;
    top: 0.5px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  margin-bottom: 12px;
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px 0 4px;
  
  @media (max-width: 480px) {
    gap: 4px;
  }

  @media (min-width: 769px) {
    justify-content: flex-end;
  }
`;

const PageButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: 2px solid ${p => p.$active ? '#2c5530' : '#e0e0e0'};
  background: ${p => p.$active ? '#2c5530' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#2c5530'};
  font-weight: 700;
  font-size: 13px;
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .mobile-icon { display: none; }

  @media (max-width: 600px) {
    padding: 6px 8px;
    min-width: 32px;
    
    .desktop-text { display: none; }
    .mobile-icon { display: flex; }
  }
`;

const PageInfo = styled.span`
  font-size: 13px;
  color: #666;
  margin-left: 6px;
`;

// Composants pour les cartes produits améliorées
const ProductCardEnhanced = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(44, 85, 48, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(44, 85, 48, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(44, 85, 48, 0.15);
    border-color: rgba(44, 85, 48, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${ProductCardEnhanced}:hover & {
    transform: scale(1.1);
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Badge = styled.div`
  background: ${props => props.type === 'sale' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : props.type === 'new' ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #2c5530, #3a6b3e)'};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 10px;
  }
`;

const ProductContent = styled.div`
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #2c5530;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
  margin-left: 15px;
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin-left: 8px;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    margin-bottom: 6px;
  }
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stars {
    display: flex;
    gap: 2px;
    color: #f39c12;
  }
  
  .rating-text {
    color: #666;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    .rating-text { display: none; }
  }
`;

const ProductStock = styled.div`
  font-size: 12px;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
  background: ${props => props.inStock ? '#d4edda' : '#f8d7da'};
  padding: 4px 8px;
  border-radius: 12px;
`;

const ProductSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #666;
  
  .spec-item {
    display: flex;
    justify-content: space-between;
    
    .spec-value {
      font-weight: 600;
      color: #2c5530;
    }
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #ccc, #999);
    cursor: not-allowed;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 13px;
    border-radius: 8px;
    gap: 6px;
  }
`;

const QuickViewButton = styled.button`
  background: transparent;
  color: #2c5530;
  border: 2px solid #2c5530;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 12.5px;
    border-radius: 6px;
    gap: 6px;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
  }
`;



const Products = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'fr';
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { productImages } = useProductImages();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    available: searchParams.get('available') === 'true'
  });



  const [mainCategory, setMainCategory] = useState(searchParams.get('main') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const inDashboard = location.pathname.startsWith('/dashboard');
  const { addToCart } = useCart();
  
  // Sync i18n language with URL parameter
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const [fsProducts, setFsProducts] = useState([]);
  const [fsLoading, setFsLoading] = useState(true);

  // Pagination (mobile uniquement)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // mobile: 10, desktop: 8

  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null;
    const update = () => {
      const mobile = mq ? mq.matches : false;
      setItemsPerPage(mobile ? 10 : 8);
    };
    update();
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', update);
    } else if (mq && mq.addListener) {
      mq.addListener(update);
    }
    return () => {
      if (mq && mq.removeEventListener) {
        mq.removeEventListener('change', update);
      } else if (mq && mq.removeListener) {
        mq.removeListener(update);
      }
    };
  }, []);

  // Charger les produits depuis Firestore (préféré) et rebasculer sur le catalogue local si vide
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFsProducts(list);
      } catch (e) {
        // silencieux: on bascule simplement sur le catalogue local
        setFsProducts([]);
      } finally {
        setFsLoading(false);
      }
    })();
  }, []);

  // Réinitialiser la page si les filtres changent
  const filtersKey = React.useMemo(() => JSON.stringify(filters), [filters]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtersKey, mainCategory]);

  // Synchronise la catégorie principale avec l'URL
  useEffect(() => {
    const urlMain = searchParams.get('main') || '';
    setMainCategory(urlMain);
  }, [searchParams]);

  // Mapping d'affichage pour catégories issus des slugs Firestore ou du catalogue
  const mapMainToCategory = (main) => {
    switch (main) {
      case 'bois':
        return 'bûches';
      case 'accessoires':
        return 'accessoires';
      case 'buches-densifiees':
        return 'bûches densifiées';
      case 'pellets':
        return 'pellets';
      case 'poeles':
        return 'poêles';
      default:
        return '';
    }
  };

  // Produits Firestore (si disponibles), sinon catalogue local
  const fsMapped = fsProducts.map((p, i) => ({
    id: p.id,
    name: p.name,
    description: [p.vendor, p.regularPrice ? `(${t('products.regular_price')} ${p.regularPrice}€)` : null].filter(Boolean).join(' · '),
    price: p.price,
    regularPrice: p.regularPrice,
    category: mapMainToCategory(p.category || p.main),
    type: p.type || '',
    stock: typeof p.stock === 'number' ? p.stock : 1,
    image: p.image || `https://picsum.photos/seed/${p.id}/800/500`,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
    sale: p.regularPrice ? (p.price || 0) < p.regularPrice : false,
    new: !!p.new,
    weight: p.weight || '',
    dimensions: p.dimensions || '',
    humidity: p.humidity || '',
    calorificValue: p.calorificValue || ''
  }));

  // Catalogue importé (fallback)
  const catMapped = catalogue.map((p, i) => {
    const mapMainToCategory = (main) => {
      switch (main) {
        case 'bois':
          return 'bûches';
        case 'accessoires':
          return 'accessoires';
        case 'buches-densifiees':
          return 'bûches densifiées';
        case 'pellets':
          return 'pellets';
        case 'poeles':
          return 'poêles';
        default:
          return '';
      }
    };
    return {
      id: p.id || `p-${i}`,
      name: p.name,
      description: [p.vendor, p.regularPrice ? `(${t('products.regular_price')} ${p.regularPrice}€)` : null].filter(Boolean).join(' · '),
      price: p.price,
      regularPrice: p.regularPrice,
      category: mapMainToCategory(p.main),
      type: '',
      stock: 1,
      image: `https://picsum.photos/seed/${p.id || `p-${i}`}/800/500`,
      rating: 0,
      reviewCount: 0,
      sale: p.regularPrice ? p.price < p.regularPrice : false,
      new: false,
      weight: '',
      dimensions: '',
      humidity: '',
      calorificValue: ''
    };
  });

  const usingFS = fsProducts.length > 0;
  const allProducts = usingFS ? fsMapped : catMapped;

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    if (mainCategory) params.set('main', mainCategory);
    setSearchParams(params);
  };

  const setActiveMainCategory = (slug) => {
    setMainCategory(slug);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    if (slug) params.set('main', slug);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      available: false
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
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



  // Logique de filtrage des produits
  const mapToMainCategory = (p) => {
    const cat = (p.category || '').toLowerCase();
    if (['bûches', 'buches', 'charbon'].includes(cat)) return 'bois';
    if (['pellets', 'granulés', 'granules'].includes(cat)) return 'pellets';
    if (['allumage', 'accessoires'].includes(cat)) return 'accessoires';
    if (['poêles', 'poeles'].includes(cat)) return 'poeles';
    if (['bûches densifiées', 'buches densifiees', 'densifiees'].includes(cat)) return 'buches-densifiees';
    return '';
  };

  // Options dynamiques pour filtres
  const fixedCategories = [
    { value: 'bûches', label: t('footer.footer_firewood') },
    { value: 'accessoires', label: t('footer.footer_accessories') },
    { value: 'bûches densifiées', label: t('footer.footer_compressed_logs') },
    { value: 'pellets', label: t('footer.footer_pellets') },
    { value: 'poêles', label: t('footer.footer_stoves') }
  ];
  const uniqueCategories = fixedCategories;
  const typesSource = allProducts.filter(p => {
    // restreindre par catégorie si sélectionnée
    if (filters.category) return p.category === filters.category;
    // restreindre par catégorie principale si définie
    if (mainCategory) return mapToMainCategory(p) === mainCategory;
    return true;
  });
  const uniqueTypes = Array.from(new Set(typesSource.map(p => (p.type || '').trim()).filter(Boolean)));

  const filteredProducts = allProducts.filter(product => {
    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower) &&
        !product.description.toLowerCase().includes(searchLower) &&
        !product.category.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtre par catégorie principale (5 groupes)
    if (mainCategory) {
      if (mapToMainCategory(product) !== mainCategory) return false;
    }

    // Filtre par catégorie
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filtre par type
    if (filters.type && product.type !== filters.type) {
      return false;
    }

    // Filtre par prix minimum
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }

    // Filtre par prix maximum
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }

    // Filtre par disponibilité
    if (filters.available && product.stock === 0) {
      return false;
    }

    return true;
  });

  // Pagination calculée (après le filtrage)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / (itemsPerPage || 1)));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pagedProducts = filteredProducts.slice(startIdx, endIdx);

  const getPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, Math.min(currentPage - 2, totalPages - (maxToShow - 1)));
      const end = Math.min(totalPages, start + maxToShow - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  // Clampe la page si le nombre total change
  useEffect(() => {
    setCurrentPage(p => Math.min(p, totalPages));
  }, [totalPages]);

  // Statistiques dynamiques (après définition de filteredProducts)
  const totalProducts = allProducts.length;
  const ratings = allProducts
    .map(p => (typeof p.rating === 'number' ? p.rating : 0))
    .filter(n => n > 0);
  const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.7;
  const averageRatingFormatted = averageRating.toFixed(1);



  // Vue lorsqu'une catégorie est sélectionnée: filtres + produits
  return (
    <ProductsContainer>
      <PageHeader>
        <PageTitle>{t('products.products_title')}</PageTitle>
        <PageSubtitle>
          {t('products.products_subtitle')}
        </PageSubtitle>

        {/* Statistiques rapides */}
        <StatsGrid>
          <StatCard style={{ background: 'linear-gradient(135deg, #2c5530, #27ae60)' }}>
            <FiTag size={24} style={{ marginBottom: '6px' }} />
            <h4>{totalProducts} {t('products.products_count')}</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>{t('products.products_in_catalog')}</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)' }}>
            <FiTruck size={24} style={{ marginBottom: '6px' }} />
            <h4>{t('products.products_delivery')}</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>{t('products.products_delivery_time')}</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
            <FiStar size={24} style={{ marginBottom: '6px' }} />
            <h4>{averageRatingFormatted}/5</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>{t('products.products_rating')}</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
            <FiShield size={24} style={{ marginBottom: '6px' }} />
            <h4>{t('products.products_guarantee')}</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>{t('products.products_certified_quality')}</p>
          </StatCard>
        </StatsGrid>
      </PageHeader>

      <FiltersSection>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter size={20} />
            {t('products.filters_title')}
          </FiltersTitle>
          <ViewToggle>
            <ViewToggleButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewToggleButton>
            <ViewToggleButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewToggleButton>
          </ViewToggle>
        </FiltersHeader>

        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder={t('products.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <FiltersGrid>
          <FilterGroup>
            <label>{t('products.filter_category')}</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">{t('products.filter_all_categories')}</option>
              {uniqueCategories.map(cat => {
                const value = typeof cat === 'string' ? cat : cat.value;
                const label = typeof cat === 'string' ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : cat.label;
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>{t('products.filter_type')}</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">{t('products.filter_all_types')}</option>
              {uniqueTypes.length === 0 ? null : uniqueTypes.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>{t('products.filter_min_price')}</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
            />
          </FilterGroup>

          <FilterGroup>
            <label>{t('products.filter_max_price')}</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="1000"
            />
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              {t('products.filter_available_only')}
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
              />
            </CheckboxLabel>
          </FilterGroup>
        </FiltersGrid>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: '2px solid #e0e0e0',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            {t('products.clear_filters')}
          </button>
        </div>
        {/* Catégories principales déplacées sous la carte de filtres */}
        <div style={{ marginTop: '16px' }}>
          <CategoriesNav>
            <CategoryButton $active={!mainCategory} onClick={() => setActiveMainCategory('')}>
              {t('products.view_all')}
            </CategoryButton>
            <CategoryButton $active={mainCategory === 'bois'} onClick={() => setActiveMainCategory('bois')}>
              {t('footer.footer_firewood')}
            </CategoryButton>
            <CategoryButton $active={mainCategory === 'accessoires'} onClick={() => setActiveMainCategory('accessoires')}>
              {t('footer.footer_accessories')}
            </CategoryButton>
            <CategoryButton $active={mainCategory === 'buches-densifiees'} onClick={() => setActiveMainCategory('buches-densifiees')}>
              {t('footer.footer_compressed_logs')}
            </CategoryButton>
            <CategoryButton $active={mainCategory === 'pellets'} onClick={() => setActiveMainCategory('pellets')}>
              {t('footer.footer_pellets')}
            </CategoryButton>
            <CategoryButton $active={mainCategory === 'poeles'} onClick={() => setActiveMainCategory('poeles')}>
              {t('footer.footer_stoves')}
            </CategoryButton>
          </CategoriesNav>
        </div>
      </FiltersSection>

      {filteredProducts.length === 0 ? (
        <NoProducts>
          <h3>{t('products.no_products_title')}</h3>
          <p>{t('products.no_products_message')}</p>
        </NoProducts>
      ) : (
        <>
          <div style={{ marginBottom: '20px', color: '#666', fontSize: '16px' }}>
            {filteredProducts.length} {t('products.products_found')}
          </div>

          {viewMode === 'grid' ? (
            <ProductsGrid>
              {pagedProducts.map(product => (
                <ProductCardEnhanced
                  key={product.id}
                  onClick={() => navigate(inDashboard ? `/${currentLang}/dashboard/product/${product.id}` : `/${currentLang}/product/${product.id}`)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dx = (x - rect.width / 2) / rect.width; // -0.5 .. 0.5
                    const dy = (y - rect.height / 2) / rect.height; // -0.5 .. 0.5
                    el.style.setProperty('--tx', `${dx * 6}px`);
                    el.style.setProperty('--ty', `${dy * 6}px`);
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.setProperty('--tx', '0px');
                    el.style.setProperty('--ty', '0px');
                  }}
                >
                  <ProductImageContainer>
                    <ProductImage
                      src={productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/fallback/800/500';
                      }}
                    />

                    <ProductBadges>
                      {product.sale && <Badge type="sale">{t('products.badge_sale')}</Badge>}
                      {product.new && <Badge type="new">{t('products.badge_new')}</Badge>}
                    </ProductBadges>
                  </ProductImageContainer>

                  <ProductContent>
                    <ProductHeader>
                      <ProductName>{translateProductName(product.name, i18n.language)}</ProductName>
                      <ProductPrice>{product.price}€</ProductPrice>
                    </ProductHeader>

                    <ProductDescription>{translateProductName(product.description, i18n.language)}</ProductDescription>

                    <ProductInfo>
                      <ProductRating>
                        {(() => {
                          const r = product.rating || 4.5; return (
                            <>
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    size={14}
                                    fill={i < Math.floor(r) ? '#f39c12' : 'none'}
                                  />
                                ))}
                              </div>
                              <span className="rating-text">{r} ({product.reviewCount || 0})</span>
                            </>
                          );
                        })()}
                      </ProductRating>

                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? t('products.in_stock') : t('products.out_of_stock')}
                      </ProductStock>
                    </ProductInfo>

                    <ProductSpecs>
                      <div className="spec-item">
                        <span>{t('products.spec_weight')}</span>
                        <span className="spec-value">{product.weight}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t('products.spec_dimensions')}</span>
                        <span className="spec-value">{product.dimensions}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t('products.spec_humidity')}</span>
                        <span className="spec-value">{product.humidity}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t('products.spec_calorific')}</span>
                        <span className="spec-value">{product.calorificValue}</span>
                      </div>
                    </ProductSpecs>

                    <ProductActions>
                      <AddToCartButton onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>
                        <FiShoppingCart size={16} />
                        {t('products.add')}
                      </AddToCartButton>
                      <QuickViewButton onClick={(e) => { e.stopPropagation(); navigate(inDashboard ? `/${currentLang}/dashboard/product/${product.id}` : `/${currentLang}/product/${product.id}`); }}>
                        {t('products.view')}
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsGrid>
          ) : (
            <ProductsList>
              {pagedProducts.map(product => (
                <ProductCardEnhanced
                  key={product.id}
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onClick={() => navigate(inDashboard ? `/${currentLang}/dashboard/product/${product.id}` : `/${currentLang}/product/${product.id}`)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dx = (x - rect.width / 2) / rect.width;
                    const dy = (y - rect.height / 2) / rect.height;
                    el.style.setProperty('--tx', `${dx * 6}px`);
                    el.style.setProperty('--ty', `${dy * 6}px`);
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.setProperty('--tx', '0px');
                    el.style.setProperty('--ty', '0px');
                  }}
                >
                  <ProductImageContainer style={{ width: '200px', height: '150px' }}>
                    <ProductImage
                      src={productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-wood.jpg';
                      }}
                    />
                    {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugImages') === '1' && (
                      <div style={{ padding: 8, fontSize: 12, color: '#666' }}>{productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`}</div>
                    )}
                    <ProductBadges>
                      {product.sale && <Badge type="sale">{t('products.badge_sale')}</Badge>}
                      {product.new && <Badge type="new">{t('products.badge_new')}</Badge>}
                    </ProductBadges>
                  </ProductImageContainer>

                  <ProductContent style={{ flex: 1 }}>
                    <ProductHeader>
                      <ProductName>{translateProductName(product.name, i18n.language)}</ProductName>
                      <ProductPrice>{product.price}€</ProductPrice>
                    </ProductHeader>

                    <ProductDescription>{translateProductName(product.description, i18n.language)}</ProductDescription>

                    <ProductInfo>
                      <ProductRating>
                        {(() => {
                          const r = product.rating || 4.5; return (
                            <>
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    size={14}
                                    fill={i < Math.floor(r) ? '#f39c12' : 'none'}
                                  />
                                ))}
                              </div>
                              <span className="rating-text">{r} ({product.reviewCount || 0})</span>
                            </>
                          );
                        })()}
                      </ProductRating>

                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? t('products.in_stock') : t('products.out_of_stock')}
                      </ProductStock>
                    </ProductInfo>

                    <ProductActions>
                      <AddToCartButton onClick={() => handleAddToCart(product)}>
                        <FiShoppingCart size={16} />
                        {t('products.add')}
                      </AddToCartButton>
                      <QuickViewButton onClick={() => navigate(inDashboard ? `/${currentLang}/dashboard/product/${product.id}` : `/${currentLang}/product/${product.id}`)}>
                        {t('products.view')}
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsList>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationBar>
              <PageButton onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <span className="desktop-text">{t('products.previous')}</span>
                <span className="mobile-icon"><FiChevronLeft size={16} /></span>
              </PageButton>
              {getPageNumbers().map(n => (
                <PageButton key={n} $active={n === currentPage} onClick={() => setCurrentPage(n)}>
                  {n}
                </PageButton>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <PageInfo>…</PageInfo>
              )}
              <PageButton onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <span className="desktop-text">{t('products.next')}</span>
                <span className="mobile-icon"><FiChevronRight size={16} /></span>
              </PageButton>
            </PaginationBar>
          )}

        </>
      )}
    </ProductsContainer>
  );
};

export default Products;

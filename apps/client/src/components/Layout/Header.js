import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import styled from 'styled-components';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiPhone, FiClock } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { translateProductName } from '../../utils/productTranslations';

const HeaderContainer = styled.header`
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 52px; /* increased offset below the fixed TopBar on desktop */
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 0 !important;
    width: 100vw !important;
    height: 60px !important;
    z-index: 9999 !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    will-change: transform !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    overflow: visible !important;
  }
  
  @media (max-width: 480px) {
    height: 55px !important;
  }
  
  @media (max-width: 375px) {
    height: 50px !important;
  }
`;

const LogoIcon = styled.span`
  font-size: 32px;
  display: flex;
  align-items: center;
  @media (min-width: 769px) {
    font-size: 40px;
  }
`;

const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const HeaderAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #2c5530;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const TopBar = styled.div`
  display: none;
  background: #f3f6f4;
  color: #2c5530;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 1001;
  border-bottom: 1px solid #e8eee9;
  
  @media (min-width: 769px) {
    display: block;
  }
`;

const TopBarContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 6px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileOnly = styled.div`
  @media (min-width: 769px) {
    display: none !important;
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 5px;
    height: 60px;
    min-width: 0;
  }
  
  @media (max-width: 480px) {
    padding: 0 4px;
    height: 55px;
  }
  
  @media (max-width: 375px) {
    padding: 0 3px;
    height: 50px;
  }
`;


const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #2c5530;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    font-size: 16px;
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    gap: 3px;
  }
  
  @media (max-width: 375px) {
    font-size: 13px;
    gap: 2px;
  }
`;

const LogoImage = styled.img`
  height: 65px;
  width: auto;
  object-fit: contain;
  
  @media (max-width: 968px) {
    height: 65px;
  }
  
  @media (max-width: 768px) {
    height: 50px;
  }
  
  @media (max-width: 480px) {
    height: 42px;
  }
  
  @media (max-width: 375px) {
    height: 38px;
  }
`;


const SearchBar = styled.div`
  flex: 1;
  max-width: 380px;
  margin: 0 20px;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  &:hover {
    color: #2c5530;
  }
  
  &.desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
  min-width: 0;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
  
  @media (max-width: 375px) {
    gap: 4px;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:focus-visible { outline: none; box-shadow: none; }
  &::-moz-focus-inner { border: 0; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #eef4ef;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 11px;
    top: -4px;
    right: -4px;
  }
  
  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    font-size: 10px;
    top: -3px;
    right: -3px;
  }
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:focus-visible { outline: none; box-shadow: none; }
  &::-moz-focus-inner { border: 0; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #eef4ef;
  }
`;

const MobileMenuButton = styled.button`
  display: none; /* Hidden by default */
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    display: flex; /* Show on mobile */
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }

  &:hover {
    background-color: #eef4ef;
  }
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }

  @media (max-width: 768px) {
    display: flex;
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }

  &:hover {
    background-color: #eef4ef;
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 9999;
  border-top: 1px solid #f0f0f0;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.25s ease, opacity 0.25s ease;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileSearchPanel = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 10000;
  border-top: 1px solid #f0f0f0;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.25s ease, opacity 0.25s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2c5530;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 12px 0;
  color: #333 !important;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  opacity: 1;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 15px;
  }
  
  &:hover {
    color: #2c5530 !important;
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 200px;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: left;
  font-size: 14px;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ResponsiveIcon = styled.div`
  font-size: 24px;
  color: #2c5530;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartDrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 11000;
`;

const EmptyCartAlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12000;
`;

const EmptyCartAlertBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 320px;
  width: 80vw;
  text-align: center;
`;

const EmptyCartAlertTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2c5530;
`;

const EmptyCartAlertText = styled.div`
  font-size: 14px;
  color: #444;
  margin-bottom: 16px;
`;

const EmptyCartAlertButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #2c5530;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

const CartDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  max-width: 100%;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  z-index: 11001;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    right: 0;
    left: auto;
    width: 70vw;
    max-width: 420px;
    top: 0;
    height: 100vh;
  }
`;

const CartDrawerHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const CartDrawerTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #2c5530;
`;

const CartDrawerClose = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CartDrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

const CartDrawerItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const CartDrawerItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  background: #f5f5f5;
`;

const CartDrawerItemInfo = styled.div`
  flex: 1;
`;

const CartDrawerItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const CartDrawerItemMeta = styled.div`
  font-size: 13px;
  color: #666;
`;

const CartDrawerItemActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const CartQtyControls = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  overflow: hidden;
`;

const CartQtyButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartQtyValue = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 13px;
`;

const CartRemoveButton = styled.button`
  border: none;
  background: none;
  color: #e74c3c;
  font-size: 12px;
  cursor: pointer;
`;

const CartDrawerFooter = styled.div`
  border-top: 1px solid #f0f0f0;
  padding: 16px 20px 20px;

  @media (max-width: 480px) {
    padding-bottom: 64px; /* remonter encore le bloc CTA sur mobile */
  }
`;

const CartDrawerRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
`;

const CartDrawerPrimary = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: none;
  background: #27ae60;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
`;

const CartDrawerSecondary = styled.button`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #2c5530;
  font-weight: 600;
  cursor: pointer;
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isEmptyCartAlertOpen, setIsEmptyCartAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, userData, logout } = useAuth();
  const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, loaded } = useSiteSettings();
  const { lang } = useParams();
  const currentLang = lang || 'fr';

  const headerSiteName = loaded ? (settings.siteName || '') : '';
  const headerPhone = loaded ? (settings.supportPhone || '') : '';
  const profileDisplayName = userData?.displayName || '';
  const profileInitial = profileDisplayName ? profileDisplayName.charAt(0).toUpperCase() : '';

  let headerSiteNameDisplay = headerSiteName;
  if (headerSiteName.length > 10) {
    const breakIndex = headerSiteName.indexOf(' ', 10);
    if (breakIndex !== -1 && breakIndex < headerSiteName.length - 1) {
      headerSiteNameDisplay = (
        <>
          {headerSiteName.slice(0, breakIndex)}
          <br />
          {headerSiteName.slice(breakIndex + 1)}
        </>
      );
    }
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Helper to get current language from URL
  const getCurrentLang = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const supportedLangs = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];
    return supportedLangs.includes(pathParts[0]) ? pathParts[0] : 'fr';
  };

  // Helper to create localized path
  const getLocalizedPath = (path) => {
    const lang = getCurrentLang();
    return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const localizedPath = getLocalizedPath(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      navigate(localizedPath);
    }
  };

  const closeAllOverlays = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileSearchOpen(false);
        setIsUserDropdownOpen(false);
      }
      return next;
    });
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
      }
      return next;
    });
  };

  const handleUserToggle = () => {
    setIsUserDropdownOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
      return next;
    });
  };

  const handleGoToCart = () => {
    closeAllOverlays();
    const path = location.pathname || '';
    const inDashboardArea = path === '/dashboard' || path.startsWith('/dashboard/') || path === '/profile' || path === '/orders' || path.startsWith('/orders/');
    if (inDashboardArea) {
      navigate('/orders');
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  const handleLinkClick = (e, to) => {
    e.preventDefault();
    closeAllOverlays();
    const localizedTo = getLocalizedPath(to);
    if (location.pathname === localizedTo) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
    navigate(localizedTo);
  };

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    await logout();
    // Ne pas naviguer ici - Firebase Auth va déclencher onAuthStateChange
    // qui mettra à jour l'UI automatiquement
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!(isMobileMenuOpen || isUserDropdownOpen || isMobileSearchOpen)) return;
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeAllOverlays();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isMobileMenuOpen, isUserDropdownOpen, isMobileSearchOpen]);

  // Empêcher le scroll de la page en arrière-plan quand le panier est ouvert
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isCartDrawerOpen]);

  return (
    <>
      {/* Desktop Top Bar */}
      <TopBar>
        <TopBarContent>
          <InfoGroup>
            <InfoItem>
              <FiPhone /> <span>{headerPhone}</span>
            </InfoItem>
            <InfoItem>
              <FiClock /> <span>{t('nav.business_hours')}</span>
            </InfoItem>
          </InfoGroup>

          <DesktopOnly>
            <UserActions>
              <LanguageSwitcher />
              {!user && (
                <>
                  <NavLink to={getLocalizedPath('/login')}>{t('nav.login')}</NavLink>
                  <NavLink to={getLocalizedPath('/register')}>{t('nav.register')}</NavLink>
                </>
              )}
              <CartButton onClick={handleGoToCart}>
                <ResponsiveIcon>
                  <FiShoppingCart />
                </ResponsiveIcon>
                {cartItemsCount > 0 && (
                  <CartBadge>{cartItemsCount}</CartBadge>
                )}
              </CartButton>
            </UserActions>
          </DesktopOnly>
        </TopBarContent>
      </TopBar>

      <HeaderContainer ref={headerRef}>
        <HeaderContent>
          <Logo to="/" onClick={(e) => handleLinkClick(e, '/')}>
            <LogoImage src="/logo.png" alt={headerSiteNameDisplay} />
          </Logo>

          <SearchBar>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder={t('nav.search_placeholder', 'Rechercher des produits...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon />
            </form>
          </SearchBar>

          <Nav>
            <NavLink to="/" onClick={(e) => handleLinkClick(e, '/')}>{t('nav.home')}</NavLink>
            <NavLink to="/products" onClick={(e) => handleLinkClick(e, '/products')}>{t('nav.products')}</NavLink>
            <NavLink to="/about" onClick={(e) => handleLinkClick(e, '/about')}>{t('nav.about')}</NavLink>
            <NavLink to="/contact" onClick={(e) => handleLinkClick(e, '/contact')}>{t('nav.contact')}</NavLink>
          </Nav>

          <RightActions>
            {/* Mobile search toggle */}
            <MobileSearchButton onClick={toggleMobileSearch} aria-label="Recherche">
              <ResponsiveIcon>
                <FiSearch />
              </ResponsiveIcon>
            </MobileSearchButton>

            <UserActions>
              {user ? (
                <Dropdown>
                  <UserButton onClick={handleUserToggle}>
                    <HeaderAvatar>{profileInitial}</HeaderAvatar>
                  </UserButton>
                  <DropdownContent isOpen={isUserDropdownOpen}>
                    <DropdownItem to={getLocalizedPath('/dashboard')} onClick={() => setIsUserDropdownOpen(false)}>{t('nav.dashboard')}</DropdownItem>
                    <DropdownItem to={getLocalizedPath('/orders')} onClick={() => setIsUserDropdownOpen(false)}>{t('nav.orders')}</DropdownItem>
                    <DropdownItem to={getLocalizedPath('/profile')} onClick={() => setIsUserDropdownOpen(false)}>{t('nav.profile')}</DropdownItem>
                    <DropdownItem
                      as="button"
                      onClick={handleLogout}
                      style={{ color: '#b91c1c', fontWeight: 600 }}
                    >
                      {t('nav.logout')}
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              ) : (
                <Dropdown>
                  <UserButton onClick={handleUserToggle}>
                    <ResponsiveIcon>
                      <FiUser />
                    </ResponsiveIcon>
                  </UserButton>
                  <DropdownContent isOpen={isUserDropdownOpen}>
                    <DropdownItem to={getLocalizedPath('/login')} onClick={() => setIsUserDropdownOpen(false)}>{t('nav.login')}</DropdownItem>
                    <DropdownItem to={getLocalizedPath('/register')} onClick={() => setIsUserDropdownOpen(false)}>{t('nav.register')}</DropdownItem>
                  </DropdownContent>
                </Dropdown>
              )}

              {/* Cart visible here only on mobile; on desktop it's in TopBar */}
              <MobileOnly>
                <CartButton onClick={handleGoToCart}>
                  <ResponsiveIcon>
                    <FiShoppingCart />
                  </ResponsiveIcon>
                  {cartItemsCount > 0 && (
                    <CartBadge>{cartItemsCount}</CartBadge>
                  )}
                </CartButton>
              </MobileOnly>
            </UserActions>

            {/* Language Switcher for Mobile */}
            <MobileOnly>
              <div style={{ marginRight: '4px', display: 'flex', alignItems: 'center' }}>
                <LanguageSwitcher />
              </div>
            </MobileOnly>

            <MobileMenuButton onClick={toggleMobileMenu} aria-label="Menu">
              <ResponsiveIcon>
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </ResponsiveIcon>
            </MobileMenuButton>
          </RightActions>
        </HeaderContent>

        {/* Mobile Search Panel */}
        <MobileSearchPanel isOpen={isMobileSearchOpen}>
          <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }}>
            <MobileSearchInput
              type="text"
              placeholder={t('nav.search_placeholder', 'Rechercher des produits...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </MobileSearchPanel>

        <MobileMenu isOpen={isMobileMenuOpen}>
          <MobileNavLink to="/" onClick={(e) => handleLinkClick(e, '/')}>
            {t('nav.home')}
          </MobileNavLink>
          <MobileNavLink to="/products" onClick={(e) => handleLinkClick(e, '/products')}>
            {t('nav.products')}
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={(e) => handleLinkClick(e, '/about')}>
            {t('nav.about')}
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={(e) => handleLinkClick(e, '/contact')}>
            {t('nav.contact')}
          </MobileNavLink>
        </MobileMenu>
      </HeaderContainer>

      {/* Cart drawer (public pages) */}
      {isCartDrawerOpen && (
        <>
          <CartDrawerOverlay onClick={() => setIsCartDrawerOpen(false)} />
          <CartDrawer>
            <CartDrawerHeader>
              <CartDrawerTitle>{t('header_cart.cart_drawer_title')}</CartDrawerTitle>
              <CartDrawerClose onClick={() => setIsCartDrawerOpen(false)}>×</CartDrawerClose>
            </CartDrawerHeader>
            <CartDrawerBody>
              {cartItems.length === 0 ? (
                <p>{t('header_cart.cart_empty')}</p>
              ) : (
                cartItems.map((item) => (
                  <CartDrawerItem key={item.id}>
                    <CartDrawerItemImage src={item.image || 'https://picsum.photos/seed/cart/80/80'} alt={item.name} />
                    <CartDrawerItemInfo>
                      <CartDrawerItemName>{translateProductName(item.name, i18n.language)}</CartDrawerItemName>
                      <CartDrawerItemMeta>
                        {item.quantity} × {Number(item.price || 0).toFixed(2)}€
                      </CartDrawerItemMeta>
                      <CartDrawerItemActions>
                        <CartQtyControls>
                          <CartQtyButton
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </CartQtyButton>
                          <CartQtyValue>{item.quantity}</CartQtyValue>
                          <CartQtyButton
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </CartQtyButton>
                        </CartQtyControls>
                        <CartRemoveButton type="button" onClick={() => removeFromCart(item.id)}>
                          {t('header_cart.remove')}
                        </CartRemoveButton>
                      </CartDrawerItemActions>
                    </CartDrawerItemInfo>
                  </CartDrawerItem>
                ))
              )}
            </CartDrawerBody>
            <CartDrawerFooter>
              <CartDrawerRow>
                <span>{t('header_cart.subtotal')}</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </CartDrawerRow>
              {cartItems.length > 0 && (
                <CartRemoveButton
                  type="button"
                  onClick={() => {
                    clearCart();
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {t('header_cart.clear_cart')}
                </CartRemoveButton>
              )}
              <CartDrawerSecondary
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate(`/${currentLang}/products`);
                }}
                style={{ marginBottom: 8 }}
              >
                {t('header_cart.continue_shopping')}
              </CartDrawerSecondary>
              <CartDrawerSecondary
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate(`/${currentLang}/cart`);
                }}
              >
                {t('header_cart.view_cart')}
              </CartDrawerSecondary>
              <CartDrawerPrimary
                type="button"
                onClick={() => {
                  if (!cartItems || cartItems.length === 0) {
                    setIsEmptyCartAlertOpen(true);
                    return;
                  }
                  setIsCartDrawerOpen(false);
                  navigate(`/${currentLang}/checkout`);
                }}
              >
                {t('header_cart.checkout')}
              </CartDrawerPrimary>
            </CartDrawerFooter>
          </CartDrawer>
        </>
      )}

      {isEmptyCartAlertOpen && (
        <EmptyCartAlertOverlay onClick={() => { setIsEmptyCartAlertOpen(false); setIsCartDrawerOpen(false); }}>
          <EmptyCartAlertBox onClick={(e) => e.stopPropagation()}>
            <EmptyCartAlertTitle>{t('header_cart.empty_cart_alert_title')}</EmptyCartAlertTitle>
            <EmptyCartAlertText>
              {t('header_cart.empty_cart_alert_message')}
            </EmptyCartAlertText>
            <EmptyCartAlertButton
              type="button"
              onClick={() => { setIsEmptyCartAlertOpen(false); setIsCartDrawerOpen(false); }}
            >
              OK
            </EmptyCartAlertButton>
          </EmptyCartAlertBox>
        </EmptyCartAlertOverlay>
      )}
    </>
  );
};

export default Header;

import React, { useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import Layout from './components/Layout/Layout';
import Header from './components/Layout/Header';
import CookieBanner from './components/Layout/CookieBanner';
import styled from 'styled-components';
import PrivateRoute from './components/Auth/PrivateRoute';
import './i18n';

// Pages (client) – eager where needed
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import BankTransfer from './pages/BankTransfer';
import PayPalPayment from './pages/PayPalPayment';
import OrderReview from './pages/OrderReview';
import About from './pages/About';
import Contact from './pages/Contact';
import Delivery from './pages/Delivery';
import Returns from './pages/Returns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Legal from './pages/Legal';

import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Suivi from './pages/Suivi';
import SuiviItinerary from './pages/SuiviItinerary';
import DashboardCart from './pages/DashboardCart';
import DashboardProducts from './pages/DashboardProducts';
import DashboardCheckout from './pages/DashboardCheckout';
import DashboardProductDetail from './pages/DashboardProductDetail';
import AuthAction from './pages/AuthAction';

// Styles globaux
import './App.css';

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

// Component to redirect root to default language
function LanguageRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'fr';
    navigate(`/${savedLang}`, { replace: true });
  }, [navigate]);

  return null;
}

// Component to sync language from URL
function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <Outlet />;
}

function RootLayout() {
  const location = useLocation();
  const path = location.pathname || '';

  // Remove language prefix to get the actual route
  const getPathWithoutLang = (pathname) => {
    const parts = pathname.split('/').filter(Boolean);
    const langCodes = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl'];
    if (parts.length > 0 && langCodes.includes(parts[0])) {
      parts.shift();
    }
    return '/' + parts.join('/');
  };

  const pathWithoutLang = getPathWithoutLang(path);

  const isDashboard = pathWithoutLang === '/dashboard';
  const isDashboardArea = (
    isDashboard ||
    pathWithoutLang.startsWith('/dashboard/') ||
    pathWithoutLang === '/profile' ||
    pathWithoutLang === '/orders' ||
    pathWithoutLang.startsWith('/orders/') ||
    pathWithoutLang === '/settings' ||
    pathWithoutLang.startsWith('/settings/') ||
    pathWithoutLang === '/billing' ||
    pathWithoutLang.startsWith('/billing/') ||
    pathWithoutLang === '/suivi' ||
    pathWithoutLang.startsWith('/suivi/')
  );
  const isMinimalArea = isDashboardArea || pathWithoutLang.startsWith('/payment/bank') || pathWithoutLang.startsWith('/payment/paypal');
  return (
    <AppContainer className="App">
      {!isMinimalArea && <Header />}
      {isMinimalArea ? (
        <Outlet />
      ) : (
        <Layout $noHeader={isMinimalArea}>
          <Outlet />
        </Layout>
      )}
      <CookieBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#27ae60',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#e74c3c',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppContainer>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Redirect root to default language */}
      <Route path="/" element={<LanguageRedirect />} />

      {/* All routes with language prefix */}
      <Route path="/:lang" element={<LanguageWrapper />}>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />

          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="dashboard/cart" element={<PrivateRoute><DashboardCart /></PrivateRoute>} />
          <Route path="dashboard/products" element={<PrivateRoute><DashboardProducts /></PrivateRoute>} />
          <Route path="dashboard/product/:id" element={<PrivateRoute><DashboardProductDetail /></PrivateRoute>} />
          <Route path="dashboard/checkout" element={<PrivateRoute><DashboardCheckout /></PrivateRoute>} />
          <Route path="billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
          <Route path="payment/bank" element={<BankTransfer />} />
          <Route path="payment/paypal" element={<PayPalPayment />} />
          <Route path="orders/:id/review" element={<PrivateRoute><OrderReview /></PrivateRoute>} />
          <Route path="auth/action" element={<AuthAction />} />
          <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="suivi" element={<PrivateRoute><Suivi /></PrivateRoute>} />
          <Route path="suivi/:id" element={<PrivateRoute><SuiviItinerary /></PrivateRoute>} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="legal" element={<Legal />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="returns" element={<Returns />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteSettingsProvider>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          />
        </SiteSettingsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


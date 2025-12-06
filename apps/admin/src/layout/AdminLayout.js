import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FiHome, FiUsers, FiShoppingBag, FiShoppingCart, FiImage, FiLogOut, FiMenu, FiX, FiSettings, FiCreditCard } from 'react-icons/fi';

const Shell = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7f6 0%, #eaf4ee 100%);
`;

const HeaderBar = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e6eae7;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 100;
  
  @media (min-width: 768px) {
    padding: 0 24px;
    height: 64px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 800;
  font-size: 16px;
  transition: transform 0.2s;
  
  @media (min-width: 768px) {
    gap: 10px;
    font-size: 20px;
  }
  
  &:hover {
    transform: scale(1.02);
  }
  
  span {
    @media (max-width: 500px) {
      display: none;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f7f6;
  color: #2c5530;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #eaf4ee;
  }
  
  @media (max-width: 900px) {
    display: flex;
  }
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border-right: 1px solid #e6eae7;
  padding: 24px 16px;
  position: fixed;
  top: 64px;
  left: 0;
  width: 260px;
  bottom: 0;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  transition: transform 0.3s ease;

  @media (max-width: 900px) {
    top: 56px;
    transform: translateX(${props => props.$open ? '0' : '-100%'});
    z-index: 90;
  }
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: 900px) {
    display: ${props => props.$open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 89;
  }
`;

const NavSection = styled.div`
  margin-bottom: 32px;
  
  h3 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7c6d;
    margin: 0 0 12px 12px;
    font-weight: 700;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: ${props => props.$active ? '#2c5530' : '#1f2d1f'};
  background: ${props => props.$active ? '#eaf4ee' : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '700' : '600'};
  font-size: 13px;
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    gap: 12px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  svg {
    color: ${props => props.$active ? '#2c5530' : '#6b7c6d'};
    flex-shrink: 0;
  }
  
  &:hover {
    background: #f5f7f6;
    transform: translateX(2px);
  }
`;

const Content = styled.main`
  padding: 16px;
  padding-top: calc(56px + 16px);
  padding-left: 16px;
  min-height: 100vh;
  
  @media (min-width: 768px) {
    padding: 32px 48px;
    padding-top: calc(64px + 32px);
  }
  
  @media (min-width: 900px) {
    padding-left: calc(260px + 48px);
  }
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background: #e74c3c;
    color: #fff;
  }
  
  span {
    @media (max-width: 500px) {
      display: none;
    }
  }
`;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch { }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Shell>
      <HeaderBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </MenuButton>
          <Brand to="/dashboard">
            <FiShoppingBag size={24} />
            <span>MesBois Admin</span>
          </Brand>
        </div>
        <HeaderActions>
          <LogoutBtn onClick={onLogout}>
            <FiLogOut size={18} />
            <span>Déconnexion</span>
          </LogoutBtn>
        </HeaderActions>
      </HeaderBar>

      <Overlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <Sidebar $open={sidebarOpen}>
        <NavSection>
          <h3>Navigation</h3>
          <NavItem
            to="/dashboard"
            $active={isActive('/dashboard')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiHome size={18} />
            Tableau de bord
          </NavItem>
          <NavItem
            to="/orders"
            $active={isActive('/orders')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiShoppingBag size={18} />
            Commandes
          </NavItem>
          <NavItem
            to="/users"
            $active={isActive('/users')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiUsers size={18} />
            Utilisateurs
          </NavItem>
          <NavItem
            to="/carts"
            $active={isActive('/carts')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiShoppingCart size={18} />
            Paniers
          </NavItem>
        </NavSection>

        <NavSection>
          <h3>Contenu</h3>
          <NavItem
            to="/images"
            $active={isActive('/images')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiImage size={18} />
            Gestion des images
          </NavItem>
          <NavItem
            to="/settings/site"
            $active={isActive('/settings/site')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiSettings size={18} />
            Paramètres du site
          </NavItem>
          <NavItem
            to="/settings/payments"
            $active={isActive('/settings/payments')}
            onClick={() => setSidebarOpen(false)}
          >
            <FiCreditCard size={18} />
            Gestion des paiements
          </NavItem>
        </NavSection>
      </Sidebar>

      <Content>
        <Inner>
          {children}
        </Inner>
      </Content>
    </Shell>
  );
};

export default AdminLayout;

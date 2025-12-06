import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const Page = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  padding: 16px 10px 24px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    gap: 24px;
    padding: 24px 16px 32px;
  }
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 900;
  color: #2c5530;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7c6d;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 16px rgba(44,85,48,0.08);
  
  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 16px;
    gap: 12px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #fff;
  background: ${p => p.bg || '#2c5530'};
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }
`;

const StatInfo = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
  h4 { 
    margin: 0; 
    color: #2c5530; 
    font-size: 16px; 
    font-weight: 900;
    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
  span { 
    color: #6b7c6d; 
    font-size: 11px;
    @media (min-width: 768px) {
      font-size: 12px;
    }
  }
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 20px rgba(44,85,48,0.08);
  
  @media (min-width: 768px) {
    border-radius: 14px;
    padding: 16px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
  h3 { 
    margin: 0; 
    color: #2c5530; 
    font-size: 16px; 
    font-weight: 800;
    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
  a { 
    color: #2c5530; 
    text-decoration: none; 
    font-weight: 700; 
    display: inline-flex; 
    align-items: center; 
    gap: 6px;
    font-size: 13px;
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  @media (min-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
`;

const QuickLink = styled(Link)`
  border: 2px solid #e6eae7;
  border-radius: 10px;
  padding: 12px;
  text-decoration: none;
  color: #2c5530;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: #f5faf6; }
  
  @media (min-width: 768px) {
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    gap: 10px;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  li { 
    display: flex; 
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    padding: 10px 0; 
    border-bottom: 1px dashed #e6eae7;
    @media (min-width: 600px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 0;
    }
  }
  li:last-child { border-bottom: none; }
  .meta { 
    color: #6b7c6d; 
    font-size: 11px;
    @media (min-width: 768px) {
      font-size: 12px;
    }
  }
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer toutes les commandes
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Récupérer tous les utilisateurs
        const usersSnap = await getDocs(collection(db, 'users'));
        
        // Calculer les statistiques
        const totalOrders = orders.length;
        const totalUsers = usersSnap.docs.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        
        // Les 5 dernières commandes
        const recentOrders = orders
          .sort((a, b) => {
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
          })
          .slice(0, 5);

        setStats({
          totalOrders,
          totalUsers,
          totalRevenue,
          pendingOrders,
          recentOrders
        });
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Page>
        <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
      </Page>
    );
  }

  return (
    <Page>
      <Heading>
        <div>
          <Title>Tableau de bord</Title>
          <Subtitle>Vue d'ensemble de l'administration</Subtitle>
        </div>
      </Heading>

      <Stats>
        <StatCard>
          <StatIcon bg="#2c5530"><FiShoppingBag size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.totalOrders}</h4>
            <span>Commandes totales</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#27ae60"><FiUsers size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.totalUsers}</h4>
            <span>Utilisateurs</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#f39c12"><FiDollarSign size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.totalRevenue.toFixed(0)} €</h4>
            <span>Revenu total</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#e74c3c"><FiPackage size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.pendingOrders}</h4>
            <span>Commandes en cours</span>
          </StatInfo>
        </StatCard>
      </Stats>

      <Panel>
        <PanelHeader>
          <h3>Actions rapides</h3>
        </PanelHeader>
        <QuickGrid>
          <QuickLink to="/orders"><FiShoppingBag /> Gérer les commandes</QuickLink>
          <QuickLink to="/users"><FiUsers /> Gérer les utilisateurs</QuickLink>
          <QuickLink to="/carts"><FiPackage /> Voir les paniers</QuickLink>
          <QuickLink to="/images"><FiTrendingUp /> Images de la Home</QuickLink>
        </QuickGrid>
      </Panel>

      <Panel>
        <PanelHeader>
          <h3>Commandes récentes</h3>
          <Link to="/orders">Voir tout <FiArrowRight /></Link>
        </PanelHeader>
        {stats.recentOrders.length === 0 ? (
          <p style={{ color: '#6b7c6d', padding: '20px 0' }}>Aucune commande pour le moment</p>
        ) : (
          <List>
            {stats.recentOrders.map(order => (
              <li key={order.id}>
                <div>
                  <strong>Commande #{order.id.slice(-8)}</strong>
                  <span className="meta" style={{ display: 'block', marginTop: '4px' }}>
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName} - {order.total?.toFixed(2)} €
                  </span>
                </div>
                <span className="meta">
                  {order.createdAt 
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                    : 'N/A'
                  }
                </span>
              </li>
            ))}
          </List>
        )}
      </Panel>
    </Page>
  );
};

export default AdminDashboard;

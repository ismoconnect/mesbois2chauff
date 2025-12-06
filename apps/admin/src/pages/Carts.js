import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiShoppingCart, FiPackage, FiCalendar, FiEye, FiTrash2 } from 'react-icons/fi';

const Page = styled.div`
  max-width: 1200px;
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
  
  @media (max-width: 767px) {
    overflow-x: hidden;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
  font-size: 22px;
  font-weight: 800;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  color: #6b7c6d;
  font-size: 12px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;


const StatsBar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (min-width: 768px) {
    border-radius: 12px;
    padding: 20px;
    gap: 14px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${p => p.bg || '#f5f7f6'};
  color: ${p => p.color || '#2c5530'};
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
`;

const StatInfo = styled.div`
  min-width: 0;
  h4 { 
    margin: 0; 
    font-size: 20px; 
    font-weight: 800; 
    color: #2c5530;
    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
  span { 
    font-size: 12px; 
    color: #6b7c6d;
    @media (min-width: 768px) {
      font-size: 13px;
    }
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  
  @media (min-width: 768px) {
    border-radius: 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  
  th, td {
    padding: 14px;
    text-align: left;
    
    @media (min-width: 768px) {
      padding: 18px;
    }
  }
  
  thead {
    background: #f5f7f6;
    
    th {
      font-weight: 700;
      color: #2c5530;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      
      @media (min-width: 768px) {
        font-size: 13px;
      }
    }
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
    
    &:hover {
      background: #f9faf9;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    font-size: 13px;
    color: #1f2d1f;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 8px;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 11px;
  transition: background 0.2s;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
  }
  
  &:hover {
    background: #1e3a22;
  }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  font-weight: 600;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
  }
  
  &:hover {
    background: #e74c3c;
    color: #fff;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: #eaf4ee;
  color: #2c5530;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7c6d;
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: #2c5530;
  }
`;

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    withItems: 0,
    totalItems: 0
  });

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'carts');
      const qr = query(col, orderBy('updatedAt', 'desc'));
      const snap = await getDocs(qr);
      const cartsList = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Trier les paniers par UID (id) pour les regrouper par utilisateur
      const sortedByUser = [...cartsList].sort((a, b) => {
        const ua = (a.id || '').toString();
        const ub = (b.id || '').toString();
        return ua.localeCompare(ub);
      });
      
      setCarts(sortedByUser);
      
      // Calculer stats
      const withItems = cartsList.filter(c => c.items?.length > 0).length;
      const totalItems = cartsList.reduce((sum, c) => sum + (c.items?.length || 0), 0);
      
      setStats({
        total: cartsList.length,
        withItems,
        totalItems
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleDelete = async (cartId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce panier ?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'carts', cartId));
      fetchCarts();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Pas de filtre de recherche côté UI, on affiche tous les paniers
  const filteredCarts = carts;

  return (
    <Page>
      <Header>
        <div>
          <Title>Gestion des Paniers</Title>
          <Subtitle>{carts.length} panier{carts.length > 1 ? 's' : ''} actif{carts.length > 1 ? 's' : ''}</Subtitle>
        </div>
      </Header>

      <StatsBar>
        <StatCard>
          <StatIcon bg="#eaf4ee" color="#2c5530"><FiShoppingCart size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.total}</h4>
            <span>Paniers totaux</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#d4edda" color="#155724"><FiPackage size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.withItems}</h4>
            <span>Avec articles</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#fff3cd" color="#856404"><FiShoppingCart size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.totalItems}</h4>
            <span>Articles totaux</span>
          </StatInfo>
        </StatCard>
      </StatsBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Articles</th>
              <th>Dernière modification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</td></tr>
            ) : filteredCarts.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <EmptyState>
                    <FiShoppingCart />
                    <h3>Aucun panier trouvé</h3>
                    <p>Essayez de modifier votre recherche</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filteredCarts.map(cart => (
                <tr key={cart.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#2c5530' }}>
                      #{cart.id.slice(-8)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7c6d', marginTop: '4px' }}>
                      {cart.id}
                    </div>
                  </td>
                  <td>
                    <Badge>
                      <FiPackage size={14} />
                      {cart.items?.length || 0} article{(cart.items?.length || 0) > 1 ? 's' : ''}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiCalendar size={14} style={{ color: '#6b7c6d' }} />
                      {cart.updatedAt?.seconds
                        ? new Date(cart.updatedAt.seconds * 1000).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </div>
                  </td>
                  <td>
                    <Actions>
                      <ActionButton to={`/carts/${cart.id}`}>
                        <FiEye size={14} /> Voir
                      </ActionButton>
                      <DeleteButton onClick={() => handleDelete(cart.id)}>
                        <FiTrash2 size={14} /> Supprimer
                      </DeleteButton>
                    </Actions>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Page>
  );
};

export default Carts;

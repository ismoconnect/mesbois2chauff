import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiUsers, FiMail, FiCalendar, FiEye, FiTrash2, FiUserCheck, FiShoppingBag } from 'react-icons/fi';

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
  min-width: 650px;
  
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  
  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c5530, #1e3a22);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const UserDetails = styled.div`
  min-width: 0;
  overflow: hidden;
  div:first-child {
    font-weight: 600;
    color: #2c5530;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
  div:last-child {
    font-size: 11px;
    color: #6b7c6d;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (min-width: 768px) {
      font-size: 12px;
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
  background: #d4edda;
  color: #155724;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    padding: 4px 10px;
    font-size: 11px;
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

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    withOrders: 0
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Récupérer tous les utilisateurs
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Récupérer les commandes pour compter les utilisateurs avec commandes
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const uniqueUserIds = new Set(ordersSnap.docs.map(d => d.data().userId));
      
      setUsers(usersList);
      setStats({
        total: usersList.length,
        withOrders: uniqueUserIds.size
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Pas de filtre de recherche côté UI, on affiche tous les utilisateurs
  const filteredUsers = users;

  return (
    <Page>
      <Header>
        <div>
          <Title>Gestion des Utilisateurs</Title>
          <Subtitle>{users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}</Subtitle>
        </div>
      </Header>

      <StatsBar>
        <StatCard>
          <StatIcon bg="#eaf4ee" color="#2c5530"><FiUsers size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.total}</h4>
            <span>Total utilisateurs</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#d4edda" color="#155724"><FiUserCheck size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.withOrders}</h4>
            <span>Avec commandes</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#fff3cd" color="#856404"><FiShoppingBag size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.total - stats.withOrders}</h4>
            <span>Sans commande</span>
          </StatInfo>
        </StatCard>
      </StatsBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <EmptyState>
                    <FiUsers />
                    <h3>Aucun utilisateur trouvé</h3>
                    <p>Essayez de modifier votre recherche</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
                const displayName = user.displayName
                  ? user.displayName
                  : (user.firstName && user.lastName)
                    ? `${user.firstName} ${user.lastName}`
                    : (user.email?.split('@')[0] || 'Utilisateur');

                return (
                  <tr key={user.id}>
                    <td>
                      <UserInfo>
                        <Avatar>{initial}</Avatar>
                        <UserDetails>
                          <div>{displayName}</div>
                          {user.displayName && <div>{user.email}</div>}
                        </UserDetails>
                      </UserInfo>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiMail size={14} style={{ color: '#6b7c6d' }} />
                        {user.email || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiCalendar size={14} style={{ color: '#6b7c6d' }} />
                        {user.createdAt?.seconds 
                          ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
                          : user.initializedAt?.seconds
                          ? new Date(user.initializedAt.seconds * 1000).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td>
                      <Actions>
                        <ActionButton to={`/users/${user.id}`}>
                          <FiEye size={14} /> Voir
                        </ActionButton>
                        <DeleteButton onClick={() => handleDelete(user.id)}>
                          <FiTrash2 size={14} /> Supprimer
                        </DeleteButton>
                      </Actions>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Page>
  );
};

export default Users;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const Page = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
  word-break: break-word;
  max-width: 100%;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: grid; gap: 6px;
  label { font-weight: 700; color: #2c5530; font-size: 13px; }
  input { border: 2px solid #e0e0e0; border-radius: 8px; padding: 10px 12px; }
`;

const Actions = styled.div`
  margin-top: 12px; display: flex; gap: 10px;
`;

const Button = styled.button`
  background: #2c5530; color: #fff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 800; cursor: pointer;
`;

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
    padding: 10px 0;
  }
`;

const UserDetail = () => {
  const { uid } = useParams();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        setData(snap.exists() ? { id: uid, ...(snap.data()||{}) } : { id: uid });
      } finally { setLoading(false); }
    };
    run();
  }, [uid]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(list);
      } catch (e) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [uid]);

  const updateField = (k, v) => setData(s => ({ ...s, [k]: v }));

  const save = async () => {
    try {
      setSaving(true);
      const ref = doc(db, 'users', uid);
      const payload = {
        displayName: data?.displayName || '',
        phone: data?.phone || '',
        address: data?.address || '',
        city: data?.city || '',
        postalCode: data?.postalCode || '',
        country: data?.country || 'France'
      };
      await setDoc(ref, payload, { merge: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Page>Chargement…</Page>;
  if (!data) return <Page>Utilisateur introuvable</Page>;

  const deriveUserName = () => {
    if (data.displayName) return data.displayName;
    if (data.firstName || data.lastName) {
      return `${data.firstName || ''} ${data.lastName || ''}`.trim();
    }
    if (data.email) return data.email.split('@')[0];
    return data.id || 'Utilisateur';
  };

  const userName = deriveUserName();

  return (
    <Page>
      <Title>{userName}</Title>
      <Card>
        <h2 style={{ marginTop: 0, marginBottom: 12, color: '#2c5530' }}>Commandes de cet utilisateur</h2>
        {ordersLoading ? (
          <div>Chargement des commandes…</div>
        ) : orders.length === 0 ? (
          <div style={{ color: '#6b7c6d' }}>Aucune commande trouvée pour cet utilisateur.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {orders.map(order => (
              <OrderRow key={order.id}>
                <div style={{ fontWeight: 700, color: '#2c5530' }}>#{order.id.slice(-8)}</div>
                <div style={{ fontSize: 13, color: '#1f2d1f' }}>
                  {order.total?.toFixed(2) || '0.00'} €
                </div>
                <div style={{ fontSize: 12, color: '#6b7c6d' }}>
                  {order.createdAt?.seconds
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'Date inconnue'}
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  state={{ fromUser: uid }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: '#2c5530',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  Voir la commande
                </Link>
              </OrderRow>
            ))}
          </div>
        )}
      </Card>
    </Page>
  );
};

export default UserDetail;

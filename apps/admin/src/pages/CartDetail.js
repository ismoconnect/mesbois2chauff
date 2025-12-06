import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, deleteField } from 'firebase/firestore';

const Page = styled.div`display: grid; gap: 16px;`;
const Title = styled.h1`margin: 0; color: #2c5530;`;
const Card = styled.div`background:#fff;border:1px solid #e6eae7;border-radius:12px;padding:16px;`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; background:#fff; border:1px solid #e6eae7; border-radius:12px; overflow:hidden;
  th, td { padding: 10px; text-align:left; }
  thead { background:#f5f7f6; }
  tbody tr + tr td { border-top: 1px dashed #e6eae7; }
`;
const Actions = styled.div`display:flex; gap:10px;`;
const Button = styled.button`background:#2c5530;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-weight:800;cursor:pointer;`;
const Danger = styled(Button)`background:#e74c3c;`;

const CartDetail = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, 'carts', uid);
      const snap = await getDoc(ref);
      setCart(snap.exists() ? { id: uid, ...(snap.data()||{}) } : { id: uid, items: [] });
    };
    run();
  }, [uid]);

  const clearCart = async () => {
    if (!cart) return;
    setSaving(true);
    try {
      await setDoc(doc(db,'carts',uid), { items: [] }, { merge: true });
      setCart(c => ({ ...c, items: [] }));
    } finally { setSaving(false); }
  };

  if (!cart) return <Page>Chargement…</Page>;

  return (
    <Page>
      <Title>Panier de {uid}</Title>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Qté</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {(cart.items||[]).length === 0 ? (
              <tr><td colSpan="3">Panier vide</td></tr>
            ) : (cart.items||[]).map((it, idx) => (
              <tr key={idx}>
                <td>{it.name || it.productId || '-'}</td>
                <td>{it.quantity || 1}</td>
                <td>{it.price != null ? `${it.price} €` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Actions>
        <Button onClick={()=>navigate('/carts')}>Retour</Button>
        <Danger onClick={clearCart} disabled={saving || (cart.items||[]).length===0}>Vider le panier</Danger>
      </Actions>
    </Page>
  );
};

export default CartDetail;

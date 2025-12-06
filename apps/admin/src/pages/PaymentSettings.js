import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Field = ({ label, value, onChange, type = 'text', textarea, placeholder }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8, fontSize: '14px' }}>{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: 120,
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: 10,
          fontSize: '14px',
          lineHeight: '1.5',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#2c5530'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: 10,
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#2c5530'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      />
    )}
  </div>
);

export default function PaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '' });
  const [pp, setPp] = useState({ email: '', instructions: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [ribSnap, ppSnap] = await Promise.all([
          getDoc(doc(db, 'rib', 'default')),
          getDoc(doc(db, 'paypal', 'default')),
        ]);
        if (ribSnap.exists()) {
          const d = ribSnap.data() || {};
          setRib({ holder: d.holder || '', iban: d.iban || '', bic: d.bic || '', bank: d.bank || '' });
        }
        if (ppSnap.exists()) {
          const d = ppSnap.data() || {};
          setPp({ email: d.email || '', instructions: d.instructions || '' });
        }
      } catch (e) {
        setMessage(`Erreur de chargement: ${e?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await Promise.all([
        setDoc(doc(db, 'rib', 'default'), rib, { merge: true }),
        setDoc(doc(db, 'paypal', 'default'), pp, { merge: true }),
      ]);
      setMessage('Enregistré.');
    } catch (e) {
      setMessage(`Échec de l'enregistrement: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Chargement…</div>;

  return (
    <div style={{ padding: '20px 20px 80px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 8px', color: '#2c5530', fontSize: '24px' }}>Gestion des paiements</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Configurez les informations de paiement visibles par vos clients lors de la commande.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Carte RIB */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            border: '1px solid #f0f2f5'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f0f2f5',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2c5530' }} />
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: 700 }}>Virement Bancaire (RIB)</h2>
            </div>
            <div style={{ padding: '20px' }}>
              <Field label="Titulaire du compte" value={rib.holder} onChange={(v) => setRib({ ...rib, holder: v })} placeholder="Ex: SAS MesBois" />
              <Field label="Nom de la banque" value={rib.bank} onChange={(v) => setRib({ ...rib, bank: v })} placeholder="Ex: Crédit Agricole" />
              <Field label="IBAN" value={rib.iban} onChange={(v) => setRib({ ...rib, iban: v })} placeholder="FR76 ..." />
              <Field label="Code BIC / SWIFT" value={rib.bic} onChange={(v) => setRib({ ...rib, bic: v })} placeholder="AGRI..." />
            </div>
          </div>

          {/* Carte PayPal */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            border: '1px solid #f0f2f5'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f0f2f5',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#003087' }} />
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: 700 }}>PayPal</h2>
            </div>
            <div style={{ padding: '20px' }}>
              <Field label="Adresse email PayPal" value={pp.email} onChange={(v) => setPp({ ...pp, email: v })} placeholder="paiement@mesbois.com" />
              <Field
                label="Instructions pour le client"
                value={pp.instructions}
                onChange={(v) => setPp({ ...pp, instructions: v })}
                textarea
                placeholder="Ex: Merci d'indiquer votre numéro de commande en référence..."
              />
            </div>
          </div>
        </div>

        {/* Barre d'action flottante sur mobile, fixe en bas de page */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 16,
          zIndex: 50,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
          // Ajustement pour ne pas couvrir le contenu sur desktop si la sidebar est là, 
          // mais ici on simplifie pour le mobile-first
        }}>
          {message && (
            <span style={{
              color: message.startsWith('Échec') ? '#ef4444' : '#059669',
              fontWeight: 600,
              fontSize: '14px',
              marginRight: 'auto'
            }}>
              {message}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: saving ? '#9ca3af' : '#2c5530',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(44, 85, 48, 0.2)',
              transition: 'all 0.2s',
              minWidth: 140
            }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

        {/* Espace pour ne pas cacher le contenu sous la barre fixe */}
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}

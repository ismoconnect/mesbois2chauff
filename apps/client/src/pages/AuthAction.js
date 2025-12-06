import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset
} from 'firebase/auth';

const Container = styled.div`
  max-width: 520px;
  margin: 0 auto;
  padding: 40px 16px 60px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 10px;
`;

const Text = styled.p`
  color: #444;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  margin-bottom: 10px;
  &:focus { outline: none; border-color: #2c5530; }
`;

const Button = styled.button`
  width: 100%;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const Helper = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

export default function AuthAction() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [mode, setMode] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [lang, setLang] = useState('fr');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get('mode') || '';
    const oc = sp.get('oobCode') || '';
    const l = sp.get('lang') || 'fr';
    setMode(m);
    setOobCode(oc);
    setLang(l);

    if (!m || !oc) return;

    if (m === 'verifyEmail') {
      setStatus({ state: 'loading', message: 'Vérification en cours…' });
      applyActionCode(auth, oc)
        .then(() => {
          setStatus({ state: 'success', message: 'Votre adresse e‑mail a été vérifiée avec succès.' });
        })
        .catch((e) => {
          setStatus({ state: 'error', message: "Lien invalide ou expiré." });
        });
    } else if (m === 'resetPassword') {
      // Valider le code de réinitialisation d’abord
      setStatus({ state: 'loading', message: 'Vérification du lien…' });
      verifyPasswordResetCode(auth, oc)
        .then(() => setStatus({ state: 'ready-reset', message: '' }))
        .catch(() => setStatus({ state: 'error', message: "Lien invalide ou expiré." }));
    } else {
      setStatus({ state: 'error', message: "Action non reconnue." });
    }
  }, [auth, navigate]);

  const onSubmitReset = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setStatus({ state: 'error', message: 'Mot de passe trop court (min 6).' });
      return;
    }
    if (password !== password2) {
      setStatus({ state: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    try {
      setStatus({ state: 'loading', message: 'Mise à jour du mot de passe…' });
      await confirmPasswordReset(auth, oobCode, password);
      setStatus({ state: 'success', message: 'Mot de passe mis à jour. Redirection…' });
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (e) {
      setStatus({ state: 'error', message: 'Impossible de mettre à jour le mot de passe.' });
    }
  };

  return (
    <Container>
      <Card>
        {status.state === 'loading' && (
          <>
            <Title>Traitement…</Title>
            <Text>{status.message || 'Veuillez patienter.'}</Text>
          </>
        )}

        {status.state === 'success' && (
          <>
            <Title>Succès</Title>
            <Text>{status.message}</Text>
            <Button type="button" onClick={() => navigate('/login', { replace: true })} style={{ marginTop: 12 }}>
              Aller à la connexion
            </Button>
          </>
        )}

        {status.state === 'error' && (
          <>
            <Title>Erreur</Title>
            <Text>{status.message || 'Une erreur est survenue.'}</Text>
            <Helper>Vous pouvez demander un nouveau lien depuis la page de connexion.</Helper>
          </>
        )}

        {status.state === 'ready-reset' && (
          <>
            <Title>Réinitialiser votre mot de passe</Title>
            <form onSubmit={onSubmitReset}>
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
              <Button type="submit">Valider</Button>
            </form>
          </>
        )}
      </Card>
    </Container>
  );
}

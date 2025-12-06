import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Container = styled.div`
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
  overflow: hidden;
  overscroll-behavior: none;
  background: radial-gradient(1000px 500px at 10% -10%, #d9f0db 0%, transparent 60%),
              radial-gradient(800px 400px at 90% 110%, #e8f4ea 0%, transparent 60%),
              #f5f7f6;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 20px 60px rgba(44, 85, 48, 0.15);
  width: 100%;
  max-width: 480px;
  margin: 0 8px; /* évite que la carte colle aux bords */
`;

const Title = styled.h1`
  font-size: 26px;
  color: #2c5530;
  margin: 0 0 6px;
  font-weight: 900;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  color: #5e6e60;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;          /* espace label/champ un peu plus grand */
  margin-bottom: 14px;/* espace entre champs */
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 13px;
  color: #2c5530;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 10px 44px; /* espace pour l'icône gauche */
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
  &:focus { border-color: #2c5530; box-shadow: 0 0 0 4px rgba(44,85,48,.08); }
  &.error { border-color: #e74c3c; box-shadow: 0 0 0 4px rgba(231,76,60,.08); }
`;

const LeftIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #7a8a7c;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #2c5530;
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 16px;
`;

const Button = styled.button`
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  display: block;
  transition: transform .06s ease, background .2s ease;
  &:hover { background: #234725; }
  &:active { transform: translateY(1px); }
`;

const Helper = styled.p`
  font-size: 12px;
  color: #666;
`;

const Footer = styled.div`
  margin-top: 14px;
  font-size: 12px;
  color: #7a8a7c;
  text-align: center;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      try {
        await setDoc(
          doc(db, 'users', cred.user.uid),
          { email: cred.user.email || email.trim(), lastLoginAt: new Date() },
          { merge: true }
        );
      } catch {}
      // Check admin gate
      try {
        const ref = doc(db, 'admins', cred.user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        if (data && (data.enabled === undefined || data.enabled === true)) {
          navigate('/dashboard', { replace: true });
        } else {
          setError("Votre compte n'est pas autorisé pour l'administration");
        }
      } catch {
        setError('Vérification des droits impossible');
      }
    } catch (e) {
      setError('Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Connexion Admin</Title>
        {error ? <Helper style={{ color: '#e74c3c' }}>{error}</Helper> : <Subtitle>Accès réservé aux administrateurs habilités</Subtitle>}
        <Field>
          <Label>Email</Label>
          <InputGroup>
            <LeftIcon><FiMail size={18} /></LeftIcon>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className={error ? 'error' : ''}
              autoComplete="username"
              inputMode="email"
            />
          </InputGroup>
        </Field>
        <Field>
          <Label>Mot de passe</Label>
          <InputGroup>
            <LeftIcon><FiLock size={18} /></LeftIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={error ? 'error' : ''}
              autoComplete="current-password"
            />
            <PasswordToggle type="button" onClick={() => setShowPassword(s => !s)} aria-label="Afficher le mot de passe">
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </InputGroup>
        </Field>
        <Actions>
          <Button type="button" onClick={handleLogin} disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
        </Actions>
        <Footer>Besoin d’aide ? Contactez le propriétaire du projet pour activer votre compte admin.</Footer>
      </Card>
    </Container>
  );
};

export default AdminLogin;

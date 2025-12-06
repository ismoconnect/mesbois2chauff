import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Page = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 32px;
  box-sizing: border-box;
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
`;

const Title = styled.h1`
  margin: 0 0 4px 0;
  font-size: 22px;
  font-weight: 800;
  color: #2c5530;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7c6d;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  background: #2c5530;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ResultList = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 18px;
  font-size: 13px;
  color: #1f2d1f;
`;

const ErrorText = styled.pre`
  margin: 12px 0 0 0;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const FirestoreDebug = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const collectionsToCheck = ['orders', 'users', 'carts'];
      const out = {};

      for (const colName of collectionsToCheck) {
        try {
          const snap = await getDocs(collection(db, colName));
          out[colName] = {
            ok: true,
            count: snap.size,
          };
        } catch (colErr) {
          out[colName] = {
            ok: false,
            error: colErr?.message || String(colErr),
          };
        }
      }

      setResults(out);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Diagnostic Firestore</Title>
        <Subtitle>
          Cet écran teste l'accès aux collections <code>orders</code>, <code>users</code> et <code>carts</code>
          depuis l'application admin.
        </Subtitle>
        <Button onClick={runCheck} disabled={loading}>
          {loading ? 'Test en cours…' : 'Lancer le test Firestore'}
        </Button>

        {results && (
          <ResultList>
            {Object.entries(results).map(([name, info]) => (
              <li key={name}>
                <strong>{name}</strong> :{' '}
                {info.ok
                  ? `${info.count} documents trouvés`
                  : `ERREUR – ${info.error}`}
              </li>
            ))}
          </ResultList>
        )}

        {error && (
          <ErrorText>{error}</ErrorText>
        )}
      </Card>
    </Page>
  );
};

export default FirestoreDebug;

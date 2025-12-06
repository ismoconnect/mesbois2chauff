import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Page = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  padding: 16px 10px 24px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 24px 16px 32px;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 900;
  color: #2c5530;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  margin: 0 0 12px;
  color: #6b7c6d;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(44,85,48,0.06);
  display: grid;
  gap: 12px;
  margin: 0 2px;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #1f2d1f;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  min-height: 80px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    justify-content: center;

    > button {
      flex: 1 1 100%;
    }
  }
`;

const Button = styled.button`
  border-radius: 999px;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #2c5530;
  color: #fff;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const Helper = styled.p`
  margin: 0;
  font-size: 12px;
  color: #6b7c6d;
`;

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: '',
    supportEmail: '',
    supportPhone: '',
    legalCompanyName: '',
    legalCompanyForm: 'Société à responsabilité limitée au capital variable',
    legalSiren: '',
    legalSiret: '',
    legalRcs: '',
    legalVatNumber: '',
    legalAddress: '',
    legalDirector: '',
    legalSiteUrl: '',
    legalContactEmail: '',
    legalDpoEmail: '',
    hostName: '',
    hostAddress: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, 'settings', 'global');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setForm(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        // silencieux pour l'admin
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, 'settings', 'global');
      await setDoc(ref, form, { merge: true });
    } catch (e) {
      // on pourrait ajouter un toast ici si besoin
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <div style={{ padding: '32px 0', textAlign: 'center' }}>Chargement des paramètres…</div>
      </Page>
    );
  }

  return (
    <Page>
      <div>
        <Title>Paramètres du site</Title>
        <Subtitle>Gérez les informations globales utilisées sur le site client (nom, coordonnées, mentions légales).</Subtitle>
      </div>

      <Card>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#2c5530' }}>Identité du site</h3>
        <Field>
          <Label>Nom du site</Label>
          <Input
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
            placeholder="Ex : MesBois, Woodigo Store…"
          />
        </Field>
        <Field>
          <Label>Email de contact professionnel</Label>
          <Input
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            placeholder="contact@exemple.fr"
          />
        </Field>
        <Field>
          <Label>Numéro de téléphone</Label>
          <Input
            name="supportPhone"
            value={form.supportPhone}
            onChange={handleChange}
            placeholder="+33 ..."
          />
        </Field>
        <Helper>Ces informations peuvent être affichées dans le footer et sur la page Contact du site client.</Helper>
      </Card>

      <Card>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#2c5530' }}>Mentions légales</h3>
        <Field>
          <Label>Dénomination de la société</Label>
          <Input
            name="legalCompanyName"
            value={form.legalCompanyName}
            onChange={handleChange}
            placeholder="WOODIGO SARL, MesBois SAS…"
          />
        </Field>
        <Field>
          <Label>Forme juridique</Label>
          <Input
            name="legalCompanyForm"
            value={form.legalCompanyForm}
            onChange={handleChange}
            placeholder="Ex : Société à responsabilité limitée au capital variable"
          />
          <Helper>Texte affiché sous le nom de la société (type de société, capital, etc.).</Helper>
        </Field>
        <Field>
          <Label>SIREN</Label>
          <Input
            name="legalSiren"
            value={form.legalSiren}
            onChange={handleChange}
            placeholder="941 500 522"
          />
        </Field>
        <Field>
          <Label>SIRET</Label>
          <Input
            name="legalSiret"
            value={form.legalSiret}
            onChange={handleChange}
            placeholder="941 500 522 00011"
          />
        </Field>
        <Field>
          <Label>R.C.S.</Label>
          <Input
            name="legalRcs"
            value={form.legalRcs}
            onChange={handleChange}
            placeholder="Paris B 941 500 522"
          />
        </Field>
        <Field>
          <Label>Numéro de TVA intracommunautaire</Label>
          <Input
            name="legalVatNumber"
            value={form.legalVatNumber}
            onChange={handleChange}
            placeholder="FR94941500522"
          />
        </Field>
        <Field>
          <Label>Adresse complète</Label>
          <TextArea
            name="legalAddress"
            value={form.legalAddress}
            onChange={handleChange}
            placeholder="Adresse postale telle qu’affichée dans les mentions légales"
          />
        </Field>
        <Field>
          <Label>Directeur de la publication</Label>
          <Input
            name="legalDirector"
            value={form.legalDirector}
            onChange={handleChange}
            placeholder="Nom du directeur de la publication"
          />
        </Field>
        <Field>
          <Label>URL du site</Label>
          <Input
            name="legalSiteUrl"
            value={form.legalSiteUrl}
            onChange={handleChange}
            placeholder="https://www.monsite.fr"
          />
        </Field>
        <Field>
          <Label>Email de contact (mentions légales)</Label>
          <Input
            name="legalContactEmail"
            value={form.legalContactEmail}
            onChange={handleChange}
            placeholder="Email affiché dans les mentions légales"
          />
        </Field>
        <Field>
          <Label>Email DPO / RGPD</Label>
          <Input
            name="legalDpoEmail"
            value={form.legalDpoEmail}
            onChange={handleChange}
            placeholder="Adresse email pour les demandes liées aux données perso"
          />
        </Field>
        <Helper>Ces champs alimenteront automatiquement la page Mentions légales et la politique de confidentialité.</Helper>
      </Card>

      <Card>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#2c5530' }}>Hébergeur du site</h3>
        <Field>
          <Label>Nom de l’hébergeur</Label>
          <Input
            name="hostName"
            value={form.hostName}
            onChange={handleChange}
            placeholder="Ex : O2Switch"
          />
        </Field>
        <Field>
          <Label>Adresse de l’hébergeur</Label>
          <TextArea
            name="hostAddress"
            value={form.hostAddress}
            onChange={handleChange}
            placeholder="Chemin des Pardiaux, 63000 Clermont-Ferrand, France"
          />
        </Field>
        <Helper>Ces informations sont affichées dans la section « Hébergeur du site » des mentions légales.</Helper>
      </Card>

      <Actions>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer les paramètres'}
        </Button>
      </Actions>
    </Page>
  );
};

export default SiteSettings;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiImage, FiSave, FiArrowLeft, FiUpload, FiHome, FiPackage, FiEdit2, FiRefreshCw, FiPlus, FiTrash2 } from 'react-icons/fi';
import { debugImages } from '../debug-images';
import { initImages } from '../init-images';
import { initProducts } from '../init-products';
import { bulkImportProducts } from '../bulk-import-products';
import { checkProductCount } from '../check-product-count';
import { importCatalogueProducts } from '../import-catalogue-products';

const Container = styled.div`
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
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 2px solid #e6eae7;
  color: #2c5530;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background: #f5f7f6;
    border-color: #2c5530;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: #2c5530;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const PageSubtitle = styled.p`
  margin: 4px 0 0 0;
  color: #6b7c6d;
  font-size: 12px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e6eae7;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  margin: 0 2px;

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 24px;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  
  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const Label = styled.label`
  font-weight: 700;
  color: #2c5530;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 2px solid #e6eae7;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  
  @media (min-width: 768px) {
    font-size: 14px;
    border-radius: 10px;
  }
  
  &:focus {
    border-color: #2c5530;
  }
`;

const Preview = styled.div`
  height: 140px;
  border: 2px dashed #e6eae7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;
  position: relative;
  
  @media (min-width: 768px) {
    height: 160px;
    border-radius: 12px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7c6d;
  
  svg {
    font-size: 32px;
    opacity: 0.5;
  }
  
  span {
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e6eae7;

  @media (max-width: 767px) {
    justify-content: center;

    > button {
      flex: 1 1 100%;
    }
  }

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 24px;
    padding-top: 24px;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Secondary = styled(Button)`
  background: #fff;
  color: #2c5530;
  border: 2px solid #e6eae7;
  
  &:hover {
    background: #f5f7f6;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e6eae7;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  gap: 6px;
  background: none;
  border: none;
  padding: 10px 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.$active ? '#2c5530' : '#6b7c6d'};
  border-bottom: 3px solid ${p => p.$active ? '#2c5530' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal;
  text-align: center;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 12px 20px;
    font-size: 14px;
    flex: 0 0 auto;
    white-space: nowrap;
  }
  
  &:hover {
    color: #2c5530;
    background: #f5f7f6;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const ProductCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  align-items: center;
  
  @media (min-width: 768px) {
    padding: 16px;
    grid-template-columns: 100px 1fr auto;
    gap: 16px;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e6eae7;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  h3 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 700;
    color: #2c5530;
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
  
  p {
    margin: 0;
    font-size: 11px;
    color: #6b7c6d;
    
    @media (min-width: 768px) {
      font-size: 12px;
    }
  }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
  }
  
  &:hover {
    background: #1e3a22;
  }
`;

const ImageManager = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProducts, setSavingProducts] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [addingProducts, setAddingProducts] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [catalogueImporting, setCatalogueImporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [values, setValues] = useState({
    bois: '',
    accessoires: '',
    buches_densifiees: '',
    pellets: '',
    poeles: '',
    hero1: '',
    hero2: '',
    hero3: ''
  });

  useEffect(() => {
    loadAll();
    debugImages();
    checkProductCount();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Charger images home
      const homeRef = doc(db, 'settings', 'home');
      const homeSnap = await getDoc(homeRef);
      if (homeSnap.exists()) {
        const data = homeSnap.data() || {};
        const ci = data.categoryImages || {};
        setValues({
          bois: ci.bois || '',
          accessoires: ci.accessoires || '',
          buches_densifiees: ci.buches_densifiees || '',
          pellets: ci.pellets || '',
          poeles: ci.poeles || ''
        });
      }

      // Charger images centralisées des produits
      const productsImagesRef = doc(db, 'settings', 'productImages');
      const productsImagesSnap = await getDoc(productsImagesRef);
      if (productsImagesSnap.exists()) {
        const data = productsImagesSnap.data() || {};
        setProductImages(data.images || {});
      }

      // Charger produits
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsList = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(productsList);
    } catch (e) {
      console.error('Erreur chargement:', e);
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setValues(s => ({ ...s, [k]: v }));

  const updateProductImage = (productId, imageUrl) => {
    setProductImages(prev => ({
      ...prev,
      [productId]: imageUrl
    }));
  };

  const saveHome = async () => {
    try {
      setSaving(true);
      const ref = doc(db, 'settings', 'home');
      await setDoc(ref, { categoryImages: { ...values }, updatedAt: new Date() }, { merge: true });
      setSaving(false);
      alert('Images de la home enregistrées');
    } catch (e) {
      setSaving(false);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const importProductImagesFromDocuments = async () => {
    try {
      // Charger tous les produits et extraire leurs images
      const productsSnap = await getDocs(collection(db, 'products'));
      const imported = {};
      let count = 0;

      productsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.image) {
          imported[doc.id] = data.image;
          count++;
        }
      });

      if (count > 0) {
        setProductImages(imported);
        alert(`${count} image(s) importée(s) depuis les documents produits`);
      } else {
        alert('Aucune image trouvée dans les documents produits');
      }
    } catch (e) {
      console.error('Erreur import images:', e);
      alert('Erreur lors de l\'import des images');
    }
  };

  const saveProductImages = async () => {
    try {
      setSavingProducts(true);
      const ref = doc(db, 'settings', 'productImages');
      await setDoc(ref, { images: { ...productImages }, updatedAt: new Date(), cacheBuster: Date.now() }, { merge: true });

      // Mise à jour également dans les documents produits pour la cohérence
      for (const [productId, imageUrl] of Object.entries(productImages)) {
        try {
          await updateDoc(doc(db, 'products', productId), {
            image: imageUrl,
            updatedAt: new Date()
          });
        } catch (e) {
          console.warn(`Erreur mise à jour produit ${productId}:`, e);
        }
      }

      setSavingProducts(false);
      alert('Images des produits enregistrées');
      await loadAll();
    } catch (e) {
      setSavingProducts(false);
      console.error('Erreur lors de la sauvegarde:', e);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const repairBrokenImages = async () => {
    try {
      const confirmRepair = window.confirm('Vérifier toutes les URLs d\'images et remplacer les images cassées par un fallback ?');
      if (!confirmRepair) return;

      setSavingProducts(true);

      const updated = { ...productImages };

      const checkImage = (url) => new Promise((resolve) => {
        if (!url) return resolve(false);
        try {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        } catch (e) {
          resolve(false);
        }
      });

      let repairedCount = 0;

      for (const product of products) {
        const id = product.id;
        const current = updated[id] || product.image || '';
        const ok = await checkImage(current);
        if (!ok) {
          // choisir fallback: product.image (déjà testé), puis category image, puis picsum
          const fromField = product.image && product.image !== current ? product.image : null;
          let fallback = null;
          if (fromField) {
            const okField = await checkImage(fromField);
            if (okField) fallback = fromField;
          }

          if (!fallback) {
            // category image
            const catImg = values[product.category] || '';
            if (catImg) {
              const okCat = await checkImage(catImg);
              if (okCat) fallback = catImg;
            }
          }

          if (!fallback) {
            fallback = `https://picsum.photos/seed/${id}/600/400`;
          }

          updated[id] = fallback;
          repairedCount++;
        }
      }

      // Sauvegarder les modifications
      const ref = doc(db, 'settings', 'productImages');
      await setDoc(ref, { images: { ...updated }, updatedAt: new Date(), cacheBuster: Date.now() }, { merge: true });

      // Optionnel: mettre à jour les produits pour cohérence
      for (const [productId, imageUrl] of Object.entries(updated)) {
        try {
          await updateDoc(doc(db, 'products', productId), {
            image: imageUrl,
            updatedAt: new Date()
          });
        } catch (e) {
          console.warn(`Erreur mise à jour produit ${productId}:`, e);
        }
      }

      setProductImages(updated);
      setSavingProducts(false);
      alert(`${repairedCount} image(s) réparée(s) et sauvegardée(s)`);
      await loadAll();
    } catch (e) {
      setSavingProducts(false);
      console.error('Erreur réparation images:', e);
      alert('Erreur lors de la réparation des images');
    }
  };

  const initDefaultImages = async () => {
    try {
      setInitializing(true);
      const initialized = await initImages();
      if (initialized) {
        await loadAll();
        alert('Images par défaut initialisées avec succès !');
      } else {
        alert('Les images existent déjà.');
      }
    } catch (error) {
      alert('Erreur lors de l\'initialisation');
    } finally {
      setInitializing(false);
    }
  };

  const addDemoProducts = async () => {
    try {
      setAddingProducts(true);
      const added = await initProducts();
      if (added) {
        await loadAll();
        alert('5 produits de démonstration ajoutés avec succès !');
      } else {
        alert('Erreur lors de l\'ajout des produits');
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout des produits');
    } finally {
      setAddingProducts(false);
    }
  };

  const bulkImportAllProducts = async () => {
    try {
      setBulkImporting(true);
      const result = await bulkImportProducts();
      if (result.success) {
        await loadAll();
        alert(`${result.count} produits importés avec succès !`);
      } else {
        alert(result.message || 'Erreur lors de l\'import des produits');
      }
    } catch (error) {
      alert('Erreur lors de l\'import des produits');
    } finally {
      setBulkImporting(false);
    }
  };

  const cleanAllProducts = async () => {
    try {
      const confirmClean = window.confirm('Êtes-vous sûr de vouloir supprimer TOUS les produits ? Cette action est irréversible.');
      if (!confirmClean) return;

      setCleaning(true);
      const productsSnap = await getDocs(collection(db, 'products'));
      let deletedCount = 0;

      // Supprimer tous les produits
      for (const doc of productsSnap.docs) {
        await deleteDoc(doc.ref);
        deletedCount++;
      }

      await loadAll();
      alert(`${deletedCount} produits supprimés avec succès !`);
    } catch (error) {
      alert('Erreur lors de la suppression des produits');
    } finally {
      setCleaning(false);
    }
  };

  const importCatalogueToFirestore = async () => {
    try {
      setCatalogueImporting(true);
      const result = await importCatalogueProducts();
      if (result.success) {
        await loadAll();
        alert(`${result.count} produits du catalogue client importés avec succès !`);
      } else {
        alert(result.message || 'Erreur lors de l\'import du catalogue');
      }
    } catch (error) {
      alert('Erreur lors de l\'import du catalogue');
    } finally {
      setCatalogueImporting(false);
    }
  };

  if (loading) return (
    <Container>
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7c6d' }}>
        Chargement…
      </div>
    </Container>
  );

  const homeFields = [
    { key: 'bois', label: 'Bois de chauffage' },
    { key: 'accessoires', label: 'Accessoires' },
    { key: 'buches_densifiees', label: 'Bûches densifiées' },
    { key: 'pellets', label: 'Pellets' },
    { key: 'poeles', label: 'Poêles' },
    { key: 'hero1', label: '🖼️ Hero Image 1 (Grande - Gauche)' },
    { key: 'hero2', label: '🖼️ Hero Image 2 (Petite - Haut Droite)' },
    { key: 'hero3', label: '🖼️ Hero Image 3 (Petite - Bas Droite)' }
  ];

  return (
    <Container>
      <Header>
        <div style={{ flex: 1 }}>
          <Title>Gestion des images</Title>
          <PageSubtitle>Gérez les images de la page d'accueil et des produits</PageSubtitle>
        </div>
        <BackButton onClick={() => window.history.back()}>
          <FiArrowLeft size={16} /> Retour
        </BackButton>
      </Header>

      <Tabs>
        <Tab $active={activeTab === 'home'} onClick={() => setActiveTab('home')}>
          <FiHome size={18} /> Images Page d'accueil
        </Tab>
        <Tab $active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          <FiPackage size={18} /> Images Produits ({products.length})
        </Tab>
      </Tabs>

      {activeTab === 'home' && (
        <Card>
          <SectionTitle>
            <FiImage /> Catégories de la page d'accueil
          </SectionTitle>
          <Grid>
            {homeFields.map(f => (
              <Field key={f.key}>
                <Label>
                  <FiImage size={16} />
                  {f.label}
                </Label>
                <Input
                  value={values[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  placeholder="Collez l'URL de l'image ici..."
                />
                <Preview>
                  {values[f.key] ? (
                    <Img
                      src={values[f.key]}
                      alt={f.label}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-wood.jpg';
                      }}
                    />
                  ) : (
                    <EmptyPreview>
                      <FiUpload />
                      <span>Aucune image</span>
                    </EmptyPreview>
                  )}
                </Preview>
              </Field>
            ))}
          </Grid>
          <Actions>
            <Secondary type="button" onClick={() => window.history.back()}>
              <FiArrowLeft size={16} /> Annuler
            </Secondary>
            <Button type="button" onClick={initDefaultImages} disabled={initializing}>
              <FiRefreshCw size={16} />
              {initializing ? 'Initialisation…' : 'Init défaut'}
            </Button>
            <Button type="button" onClick={addDemoProducts} disabled={addingProducts}>
              <FiPlus size={16} />
              {addingProducts ? 'Ajout…' : 'Ajout produits'}
            </Button>
            <Button type="button" onClick={bulkImportAllProducts} disabled={bulkImporting}>
              <FiPackage size={16} />
              {bulkImporting ? 'Import…' : 'Import 40 produits'}
            </Button>
            <Button type="button" onClick={importCatalogueToFirestore} disabled={catalogueImporting}>
              <FiPackage size={16} />
              {catalogueImporting ? 'Import catalogue…' : 'Import catalogue (45)'}
            </Button>
            <Button type="button" onClick={cleanAllProducts} disabled={cleaning}>
              <FiTrash2 size={16} />
              {cleaning ? 'Nettoyage…' : 'Nettoyer produits'}
            </Button>
            <Button type="button" onClick={saveHome} disabled={saving}>
              <FiSave size={16} />
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </Actions>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card>
          <SectionTitle>
            <FiPackage /> Images des produits du catalogue
          </SectionTitle>
          <Grid>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7c6d' }}>
                Aucun produit trouvé
              </div>
            ) : (
              products.map(product => (
                <Field key={product.id}>
                  <Label>
                    <FiImage size={16} />
                    {product.name}
                  </Label>
                  <Input
                    value={productImages[product.id] || ''}
                    onChange={e => updateProductImage(product.id, e.target.value)}
                    placeholder="Collez l'URL de l'image ici..."
                  />
                  <Preview>
                    {productImages[product.id] ? (
                      <Img
                        src={productImages[product.id]}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-wood.jpg';
                        }}
                      />
                    ) : product.image ? (
                      <Img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-wood.jpg';
                        }}
                      />
                    ) : (
                      <EmptyPreview>
                        <FiUpload />
                        <span>Aucune image</span>
                      </EmptyPreview>
                    )}
                  </Preview>
                </Field>
              ))
            )}
          </Grid>
          <Actions>
            <Secondary type="button" onClick={() => window.history.back()}>
              <FiArrowLeft size={16} /> Annuler
            </Secondary>
            <Secondary type="button" onClick={importProductImagesFromDocuments} title="Importe automatiquement les URLs depuis les champs image des produits">
              <FiRefreshCw size={16} /> [DEBUG] Importer images
            </Secondary>
            <Secondary type="button" onClick={repairBrokenImages} title="Tester et remplacer les images cassées par un fallback">
              <FiEdit2 size={16} /> Réparer images cassées
            </Secondary>
            <Button type="button" onClick={saveProductImages} disabled={savingProducts}>
              <FiSave size={16} />
              {savingProducts ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </Actions>
        </Card>
      )}
    </Container>
  );
};

export default ImageManager;
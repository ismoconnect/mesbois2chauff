import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';
import { products as catalogueProducts } from './client-catalogue.js';

// Convert catalogue products to Firestore format
const convertCatalogueToFirestore = (catalogueProducts) => {
  return catalogueProducts.map((product, index) => {
    // Map categories
    const categoryMap = {
      'bois': 'bois',
      'accessoires': 'accessoires', 
      'buches-densifiees': 'buches-densifiees',
      'pellets': 'pellets',
      'poeles': 'poeles'
    };
    
    // Generate realistic images based on category
    const getImageForCategory = (category) => {
      const imageMap = {
        'bois': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
        'accessoires': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
        'buches-densifiees': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
        'pellets': 'https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop',
        'poeles': 'https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop'
      };
      return imageMap[category] || 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop';
    };
    
    // Generate type from name
    const generateType = (name, category) => {
      const nameLower = name.toLowerCase();
      
      // Special handling for different categories
      if (category === 'bois') {
        if (nameLower.includes('palette')) return 'palette';
        if (nameLower.includes('stère') || nameLower.includes('stere')) return 'stere';
        if (nameLower.includes('ballot')) return 'ballot';
        if (nameLower.includes('bûche') || nameLower.includes('buche')) return 'buches';
        return 'standard';
      }
      
      if (category === 'buches-densifiees') {
        if (nameLower.includes('palette')) return 'palette';
        if (nameLower.includes('briquet')) return 'briquettes';
        return 'standard';
      }
      
      if (category === 'pellets') {
        if (nameLower.includes('palette')) return 'palette';
        if (nameLower.includes('vrac')) return 'vrac';
        return 'sac';
      }
      
      if (category === 'poeles') {
        if (nameLower.includes('granulés') || nameLower.includes('pellets')) return 'pellets';
        return 'bois';
      }
      
      if (category === 'accessoires') {
        if (nameLower.includes('sac')) return 'sac';
        if (nameLower.includes('set')) return 'set';
        return 'accessoire';
      }
      
      return 'standard';
    };
    
    // Generate realistic price
    const generatePrice = (regularPrice, category) => {
      if (regularPrice) return regularPrice;
      
      const priceMap = {
        'bois': 80 + Math.random() * 200,
        'accessoires': 20 + Math.random() * 200,
        'buches-densifiees': 30 + Math.random() * 100,
        'pellets': 200 + Math.random() * 300,
        'poeles': 200 + Math.random() * 1500
      };
      
      return Math.round((priceMap[category] || 50) * 100) / 100;
    };
    
    // Generate realistic stock
    const generateStock = (category) => {
      const stockMap = {
        'bois': 10 + Math.floor(Math.random() * 50),
        'accessoires': 5 + Math.floor(Math.random() * 30),
        'buches-densifiees': 20 + Math.floor(Math.random() * 80),
        'pellets': 5 + Math.floor(Math.random() * 20),
        'poeles': 2 + Math.floor(Math.random() * 15)
      };
      return stockMap[category] || 10;
    };
    
    const category = categoryMap[product.main] || 'bois';
    
    return {
      name: product.name,
      category: category,
      price: generatePrice(product.price || product.regularPrice, category),
      stock: generateStock(category),
      description: `Produit de qualité premium dans la catégorie ${category}.`,
      image: getImageForCategory(category),
      type: generateType(product.name, category),
      vendor: product.vendor || 'Vendeur Premium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
};

export const importCatalogueProducts = async () => {
  try {
    // Check if products already exist
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.docs.length > 0) {
      const confirmImport = window.confirm(
        `Il y a déjà ${productsSnap.docs.length} produits dans la base. Voulez-vous vraiment importer les 45 produits du catalogue client ?`
      );
      if (!confirmImport) {
        return { success: false, message: 'Import annulé par l\'utilisateur' };
      }
    }
    
    // Convert catalogue products to Firestore format
    const firestoreProducts = convertCatalogueToFirestore(catalogueProducts);
    
    // Add products to Firestore
    let addedCount = 0;
    for (const product of firestoreProducts) {
      await addDoc(collection(db, 'products'), product);
      addedCount++;
    }
    
    return { success: true, count: addedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
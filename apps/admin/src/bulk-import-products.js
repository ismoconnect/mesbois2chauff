import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase/config';

// Liste complète des 45 produits avec leurs images
const productList = [
  // Bois de chauffage
  {
    name: "Bois de chêne séché 1m³",
    category: "bois",
    price: 85.00,
    stock: 50,
    description: "Bois de chêne séché naturellement, parfait pour cheminées et poêles à bois. Combustion longue et régulière.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "chene"
  },
  {
    name: "Bois de hêtre séché 1m³",
    category: "bois",
    price: 80.00,
    stock: 45,
    description: "Bois de hêtre de première qualité, séché pendant 2 ans. Idéal pour un chauffage efficace.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "hetre"
  },
  {
    name: "Bois de charme séché 1m³",
    category: "bois",
    price: 75.00,
    stock: 40,
    description: "Bois de charme dense et calorifique, parfait pour un chauffage intense.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "charme"
  },
  {
    name: "Bois de chêne 50cm stère",
    category: "bois",
    price: 65.00,
    stock: 35,
    description: "Bois de chêne coupé en bûches de 50cm, idéal pour poêles et inserts.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "chene-50cm"
  },
  {
    name: "Bois de hêtre 50cm stère",
    category: "bois",
    price: 60.00,
    stock: 30,
    description: "Bois de hêtre coupé en bûches de 50cm, séché à l'air libre.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "hetre-50cm"
  },
  {
    name: "Bois de frêne 1m³",
    category: "bois",
    price: 70.00,
    stock: 35,
    description: "Bois de frêne dur et résistant, excellent pouvoir calorifique.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "frene"
  },
  {
    name: "Bois mixte 1m³",
    category: "bois",
    price: 65.00,
    stock: 40,
    description: "Mélange de bois feuillus (chêne, hêtre, charme) pour un chauffage équilibré.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "mixte"
  },
  {
    name: "Bois de chêne fagot 1m³",
    category: "bois",
    price: 90.00,
    stock: 25,
    description: "Bois de chêne trié et ficelé en fagots pour un rangement optimal.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "chene-fagot"
  },

  // Bûches densifiées
  {
    name: "Bûches densifiées 10kg",
    category: "buches-densifiees",
    price: 32.00,
    stock: 100,
    description: "Bûches densifiées de 10kg, combustion longue et régulière. Facile à allumer.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "10kg"
  },
  {
    name: "Bûches densifiées 15kg",
    category: "buches-densifiees",
    price: 45.00,
    stock: 80,
    description: "Bûches densifiées de 15kg, idéales pour un chauffage intense toute la nuit.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "15kg"
  },
  {
    name: "Bûches densifiées 20kg",
    category: "buches-densifiees",
    price: 58.00,
    stock: 60,
    description: "Bûches densifiées de 20kg, puissance maximale pour les grands espaces.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "20kg"
  },
  {
    name: "Bûches densifiées premium 15kg",
    category: "buches-densifiees",
    price: 52.00,
    stock: 40,
    description: "Bûches densifiées premium sans écorce, combustion ultra propre.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "premium"
  },

  // Pellets
  {
    name: "Pellets de bois 15kg",
    category: "pellets",
    price: 32.00,
    stock: 200,
    description: "Pellets 100% bois dur, certifiés DIN Plus, idéaux pour poêles à granulés.",
    image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    type: "15kg"
  },
  {
    name: "Pellets de bois 20kg",
    category: "pellets",
    price: 40.00,
    stock: 150,
    description: "Pellets de bois 20kg avec teneur en humidité inférieure à 8%.",
    image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    type: "20kg"
  },
  {
    name: "Pellets de bois premium 15kg",
    category: "pellets",
    price: 38.00,
    stock: 100,
    description: "Pellets premium sans poussière, combustion optimale et cendres réduites.",
    image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    type: "premium"
  },
  {
    name: "Pellets de bois 1000kg",
    category: "pellets",
    price: 1800.00,
    stock: 10,
    description: "Lot de pellets de bois 1000kg pour une utilisation intensive toute la saison.",
    image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    type: "1000kg"
  },

  // Poêles
  {
    name: "Poêle à bois moderne 5kW",
    category: "poeles",
    price: 1200.00,
    stock: 8,
    description: "Poêle à bois design moderne avec double combustion et vitre céramique. Puissance 5kW.",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    type: "5kw"
  },
  {
    name: "Poêle à bois classique 7kW",
    category: "poeles",
    price: 1500.00,
    stock: 6,
    description: "Poêle à bois classique en fonte avec chambre de combustion optimisée. Puissance 7kW.",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    type: "7kw"
  },
  {
    name: "Poêle à bois hydro 10kW",
    category: "poeles",
    price: 2500.00,
    stock: 4,
    description: "Poêle à bois hydro avec échangeur eau chaude pour le chauffage central. Puissance 10kW.",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    type: "hydro"
  },
  {
    name: "Insert cheminée bois 4kW",
    category: "poeles",
    price: 900.00,
    stock: 12,
    description: "Insert cheminée bois pour transformer votre cheminée existante. Puissance 4kW.",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    type: "insert"
  },

  // Accessoires
  {
    name: "Pelle à cendres professionnelle",
    category: "accessoires",
    price: 25.00,
    stock: 30,
    description: "Pelle à cendres en acier inoxydable avec manche en bois de hêtre.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "pelle"
  },
  {
    name: "Soufflet en cuir traditionnel",
    category: "accessoires",
    price: 35.00,
    stock: 20,
    description: "Soufflet en cuir véritable pour attiser le feu de manière traditionnelle.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "soufflet"
  },
  {
    name: "Pincette à bûches inox",
    category: "accessoires",
    price: 22.00,
    stock: 25,
    description: "Pincette à bûches en acier inoxydable avec pointes effilées.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "pincette"
  },
  {
    name: "Chenillet à bois 3m",
    category: "accessoires",
    price: 45.00,
    stock: 15,
    description: "Chenillet à bois en acier galvanisé de 3 mètres de longueur.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "chenillet"
  },
  {
    name: "Bûcher en bois recyclé",
    category: "accessoires",
    price: 85.00,
    stock: 10,
    description: "Bûcher en bois recyclé avec rangement pour bûches et accessoires.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "bucher"
  },
  {
    name: "Hache de bûcheron professionnelle",
    category: "accessoires",
    price: 65.00,
    stock: 12,
    description: "Hache de bûcheron en acier trempé avec manche en hickory.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "hache"
  },
  {
    name: "Scie à bûches égoïne",
    category: "accessoires",
    price: 42.00,
    stock: 18,
    description: "Scie à bûches égoïne avec lame en acier au tungstène.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "scie"
  },
  {
    name: "Billes à feu instantané",
    category: "accessoires",
    price: 12.00,
    stock: 50,
    description: "Billes à feu instantané pour allumer rapidement votre feu.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "billes-feu"
  },
  {
    name: "Grille de ramonage professionnelle",
    category: "accessoires",
    price: 38.00,
    stock: 15,
    description: "Grille de ramonage en acier inoxydable pour cheminées et poêles.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "grille"
  },
  {
    name: "Cendrier en fonte décoratif",
    category: "accessoires",
    price: 55.00,
    stock: 8,
    description: "Cendrier en fonte décoratif avec motif feuille d'érable.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "cendrier"
  },

  // Produits supplémentaires pour atteindre 45
  {
    name: "Bois de chêne premium 1m³",
    category: "bois",
    price: 95.00,
    stock: 30,
    description: "Bois de chêne premium sélectionné, séché pendant 3 ans pour une qualité optimale.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "chene-premium"
  },
  {
    name: "Bois de hêtre fagot 1m³",
    category: "bois",
    price: 85.00,
    stock: 25,
    description: "Bois de hêtre trié et ficelé en fagots pour un rangement optimal.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "hetre-fagot"
  },
  {
    name: "Bûches densifiées 25kg",
    category: "buches-densifiees",
    price: 70.00,
    stock: 50,
    description: "Bûches densifiées de 25kg, idéales pour un chauffage intensif sur plusieurs jours.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "25kg"
  },
  {
    name: "Pellets de bois écologiques 15kg",
    category: "pellets",
    price: 35.00,
    stock: 90,
    description: "Pellets 100% bois dur issus de forêts gérées durablement.",
    image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
    type: "ecologique"
  },
  {
    name: "Poêle à bois compact 3kW",
    category: "poeles",
    price: 800.00,
    stock: 15,
    description: "Poêle à bois compact idéal pour les petites pièces. Puissance 3kW.",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
    type: "compact"
  },
  {
    name: "Kit d'entretien poêle complet",
    category: "accessoires",
    price: 75.00,
    stock: 20,
    description: "Kit complet d'entretien pour poêles comprenant brosse, cendrier et produit nettoyant.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "kit-entretien"
  },
  {
    name: "Couverture anti-feu professionnelle",
    category: "accessoires",
    price: 48.00,
    stock: 25,
    description: "Couverture anti-feu en verre minéral pour la sécurité de votre cheminée.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "couverture"
  },
  {
    name: "Thermomètre poêle numérique",
    category: "accessoires",
    price: 28.00,
    stock: 30,
    description: "Thermomètre numérique pour surveiller la température de votre poêle en temps réel.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "thermometre"
  },
  {
    name: "Grille de ventilation poêle",
    category: "accessoires",
    price: 32.00,
    stock: 20,
    description: "Grille de ventilation en acier inoxydable pour optimiser la circulation d'air.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "grille-ventilation"
  },
  {
    name: "Support à bûches en fonte",
    category: "accessoires",
    price: 65.00,
    stock: 12,
    description: "Support à bûches en fonte décoratif avec motif feuillage.",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
    type: "support-buches"
  }
];

export const bulkImportProducts = async () => {
  try {
    // Vérifier s'il y a déjà des produits
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.docs.length > 0) {
      const confirmImport = window.confirm(
        `Il y a déjà ${productsSnap.docs.length} produits dans la base. Voulez-vous vraiment ajouter ${productList.length} produits supplémentaires ?`
      );
      if (!confirmImport) {
        return { success: false, message: 'Import annulé par l\'utilisateur' };
      }
    }

    // Ajouter les produits
    let addedCount = 0;
    for (const product of productList) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      addedCount++;
    }

    console.log(`✅ ${addedCount} produits ajoutés avec succès`);
    return { success: true, count: addedCount };
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des produits:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour vérifier les doublons
export const checkDuplicateProducts = async () => {
  try {
    const duplicates = [];
    for (const product of productList) {
      const q = query(
        collection(db, 'products'),
        where('name', '==', product.name),
        where('category', '==', product.category)
      );
      const snapshot = await getDocs(q);
      if (snapshot.docs.length > 0) {
        duplicates.push({
          name: product.name,
          category: product.category,
          existingIds: snapshot.docs.map(doc => doc.id)
        });
      }
    }
    return duplicates;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des doublons:', error);
    return [];
  }
};
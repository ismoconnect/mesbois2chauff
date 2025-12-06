import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/config';

export const initProducts = async () => {
  try {
    // Produits de démonstration
    const demoProducts = [
      {
        name: "Bois de chêne séché 1m³",
        category: "bois",
        price: 85.00,
        stock: 50,
        description: "Bois de chêne séché naturellement, parfait pour cheminées et poêles à bois.",
        image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Bûches densifiées 15kg",
        category: "buches-densifiees",
        price: 45.00,
        stock: 30,
        description: "Bûches densifiées de haute qualité, combustion longue et régulière.",
        image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Pellets de bois premium 15kg",
        category: "pellets",
        price: 32.00,
        stock: 100,
        description: "Pellets 100% bois dur, certifiés DIN Plus, idéaux pour poêles à granulés.",
        image: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Poêle à bois moderne",
        category: "poeles",
        price: 1200.00,
        stock: 5,
        description: "Poêle à bois design moderne avec double combustion et vitre céramique.",
        image: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Pelle à cendres professionnelle",
        category: "accessoires",
        price: 25.00,
        stock: 20,
        description: "Pelle à cendres en acier inoxydable avec manche en bois de hêtre.",
        image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Ajouter les produits
    for (const product of demoProducts) {
      await addDoc(collection(db, 'products'), product);
    }

    return true;
  } catch (error) {
    return false;
  }
};
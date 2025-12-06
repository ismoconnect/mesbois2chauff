/**
 * Retourne l'URL de l'image pour une catégorie de produit donnée.
 * @param {string} category - Le nom de la catégorie (par exemple, 'bois', 'pellets').
 * @returns {string} L'URL de l'image correspondante.
 */
export const getCategoryImage = (category) => {
  const categoryImageMap = {
    'bois': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
    'pellets': 'https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop',
    'buches-densifiees': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
    'poeles': 'https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop',
    'accessoires': 'https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop',
    // Ajoutez d'autres catégories ici si nécessaire
  };

  // Retourne l'image de la catégorie ou une image par défaut si la catégorie n'est pas trouvée.
  return categoryImageMap[category] || 'https://picsum.photos/seed/mesbois-category-fallback/1600/900';
};
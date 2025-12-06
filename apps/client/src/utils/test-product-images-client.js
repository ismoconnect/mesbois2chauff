/**
 * Script de diagnostic avancé pour productImages
 * À exécuter dans la console du navigateur (F12 > Console)
 * sur la page /products?debugImages=1
 */

window.testProductImages = async function() {
  console.clear();
  console.log('%c🚀 DIAGNOSTIC COMPLET DES IMAGES PRODUITS', 'background: #2c5530; color: white; font-size: 16px; padding: 8px;');
  console.log('');

  // Test 1: Vérifier que Firebase est chargé
  console.log('%c1️⃣  Vérification de Firebase', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  if (typeof window.firebase === 'undefined') {
    console.error('❌ Firebase n\'est pas chargé!');
    return;
  }
  console.log('✅ Firebase chargé');

  // Test 2: Vérifier que Firestore est initialisé
  console.log('%c2️⃣  Vérification de Firestore', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  try {
    // Essayer d'accéder à la base de données
    const testRef = window.firebase?.firestore?.collection?.('test');
    if (testRef) {
      console.log('✅ Firestore est accessible');
    }
  } catch (e) {
    console.warn('⚠️  Firestore peut ne pas être accessible:', e.message);
  }

  // Test 3: Tester onSnapshot directement
  console.log('%c3️⃣  Test onSnapshot sur settings/productImages', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  try {
    // Utiliser fetch API pour tester la connectivité Firestore
    const response = await fetch('/__/functions/testFirestore');
    console.log('Test de connectivité:', response?.status);
  } catch (e) {
    console.log('Test de connectivité échoué (normal si pas de endpoint), détails:', e.message);
  }

  // Test 4: Chercher le hook useProductImages dans React DevTools
  console.log('%c4️⃣  Recherche du hook useProductImages', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  console.log('Cherchez le hook dans React DevTools (F12 > Components > ProductCard/Products)');
  console.log('Vérifiez que le state productImages contient les IDs des produits');

  // Test 5: Vérifier les images chargées dans le DOM
  console.log('%c5️⃣  Vérification des images dans le DOM', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  const images = document.querySelectorAll('img[src*="cloudinary"], img[src*="unsplash"], img[src*="picsum"]');
  console.log(`  • ${images.length} images trouvées`);
  if (images.length > 0) {
    const sampleUrl = images[0]?.src;
    console.log(`  • Exemple d'URL: ${sampleUrl?.substring(0, 80)}...`);
    console.log('  ✅ Les images sont chargées dans le DOM');
  } else {
    console.log('  ❌ Aucune image trouvée dans le DOM');
  }

  // Test 6: Vérifier les logs de debug
  console.log('%c6️⃣  Logs de débogage attendus', 'background: #4a90e2; color: white; padding: 4px; font-weight: bold;');
  console.log('Cherchez dans les logs ci-dessus:');
  console.log('  • "🔍 useProductImages: Initialisation du listener..."');
  console.log('  • "productImages onSnapshot fired: true"');
  console.log('  • "✅ getDoc fallback réussi, images chargées:"');
  console.log('  • "🖼️  useProductImages hook state:"');

  // Test 7: Résumé
  console.log('%c📊 RÉSUMÉ', 'background: #2c5530; color: white; font-size: 14px; padding: 8px; font-weight: bold;');
  console.log(`URL actuelle: ${window.location.href}`);
  console.log(`Paramètre debugImages: ${new URLSearchParams(window.location.search).get('debugImages')}`);
  console.log('');
  console.log('%cProchaines étapes:', 'font-weight: bold;');
  console.log('1. Ouvre React DevTools (F12 > Components)');
  console.log('2. Cherche le composant ProductCard');
  console.log('3. Vérifie que le hook useProductImages retourne un objet non-vide');
  console.log('4. Vérifie que imageUrl est correctement construit');
  console.log('');
};

// Auto-run si on est sur /products?debugImages=1
if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugImages') === '1') {
  console.log('🔍 Script de diagnostic disponible. Exécute window.testProductImages() dans la console.');
  setTimeout(() => window.testProductImages(), 1000);
}

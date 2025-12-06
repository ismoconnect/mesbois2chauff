// Compteur pour vérifier les produits
const productList = [
  // Bois de chauffage (8 produits)
  "Bois de chêne séché 1m³",
  "Bois de hêtre séché 1m³", 
  "Bois de charme séché 1m³",
  "Bois de chêne 50cm stère",
  "Bois de hêtre 50cm stère",
  "Bois de frêne 1m³",
  "Bois mixte 1m³",
  "Bois de chêne fagot 1m³",
  
  // Bûches densifiées (4 produits)
  "Bûches densifiées 10kg",
  "Bûches densifiées 15kg",
  "Bûches densifiées 20kg", 
  "Bûches densifiées premium 15kg",
  
  // Pellets (4 produits)
  "Pellets de bois 15kg",
  "Pellets de bois 20kg",
  "Pellets de bois premium 15kg",
  "Pellets de bois 1000kg",
  
  // Poêles (4 produits)
  "Poêle à bois moderne 5kW",
  "Poêle à bois classique 7kW",
  "Poêle à bois hydro 10kW",
  "Insert cheminée bois 4kW",
  
  // Accessoires (10 produits)
  "Pelle à cendres professionnelle",
  "Soufflet en cuir traditionnel",
  "Pincette à bûches inox",
  "Chenillet à bois 3m",
  "Bûcher en bois recyclé",
  "Hache de bûcheron professionnelle",
  "Scie à bûches égoïne",
  "Billes à feu instantané",
  "Grille de ramonage professionnelle",
  "Cendrier en fonte décoratif",
  
  // Produits supplémentaires (10 produits)
  "Bois de chêne premium 1m³",
  "Bois de hêtre fagot 1m³",
  "Bûches densifiées 25kg",
  "Pellets de bois écologiques 15kg",
  "Poêle à bois compact 3kW",
  "Kit d'entretien poêle complet",
  "Couverture anti-feu professionnelle",
  "Thermomètre poêle numérique",
  "Grille de ventilation poêle",
  "Support à bûches en fonte"
];

// Vérifier les doublons (silencieux)
const duplicates = productList.filter((item, index) => productList.indexOf(item) !== index);
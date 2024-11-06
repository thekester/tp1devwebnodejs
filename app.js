// app.js
const express = require('express');
const path = require('path');

const app = express();

// Configuration de Pug comme moteur de templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques
app.use('/code', express.static(path.join(__dirname, 'public', 'code')));
app.use('/style', express.static(path.join(__dirname, 'public', 'style'))); // Ajouté pour servir les fichiers CSS

// Middleware pour parser les requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données des produits (avec certains produits en rupture de stock)
const produits = [
  { id: 1, nom: 'Smartphone Alpha', annee: 2023, prix: 699.99, stock: 25, numeroSerie: 'SN123456' },
  { id: 2, nom: 'Ordinateur Portable Beta', annee: 2024, prix: 1299.99, stock: 15, numeroSerie: 'SN234567' },
  { id: 3, nom: 'Tablette Gamma', annee: 2022, prix: 399.99, stock: 0, numeroSerie: 'SN345678' }, // En rupture de stock
  { id: 4, nom: 'Montre Connectée Delta', annee: 2023, prix: 199.99, stock: 60, numeroSerie: 'SN456789' },
  { id: 5, nom: 'Casque Audio Epsilon', annee: 2024, prix: 149.99, stock: 0, numeroSerie: 'SN567890' }, // En rupture de stock
  { id: 6, nom: 'Clavier Zeta', annee: 2023, prix: 89.99, stock: 10, numeroSerie: 'SN678901' },
  { id: 7, nom: 'Souris Eta', annee: 2022, prix: 49.99, stock: 5, numeroSerie: 'SN789012' }
];

// Route principale pour afficher la liste des produits disponibles
app.get('/', (req, res) => {
  // Filtrer les produits avec stock >= 1
  const produitsDisponibles = produits.filter(produit => produit.stock >= 1);
  
  res.render('index', { 
    title: 'Liste des Produits Disponibles', 
    produits: produitsDisponibles 
  });
});

// Route pour afficher les détails d'un produit spécifique
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const produit = produits.find(p => p.id === productId);
  
  if (produit) {
    res.render('product', { 
      title: produit.nom, 
      produit: produit 
    });
  } else {
    // Rendre le template 404
    res.status(404).render('404');
  }
});

// Nouvelle Route pour gérer les achats
app.post('/buy/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const produit = produits.find(p => p.id === productId);

  if (produit) {
    if (produit.stock > 0) {
      produit.stock -= 1;
      res.json({ success: true, message: 'Succès !', nouveauStock: produit.stock });
    } else {
      res.json({ success: false, message: 'Produit en rupture de stock.' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Produit non trouvé.' });
  }
});

// Route pour gérer une requête AJAX (exemple pour saluer un produit, à adapter selon besoins)
app.get('/bonjour/:nom', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'Bonjour ' + req.params.nom + '!' }));
});

// Route 404 pour les autres chemins non définis
app.use((req, res) => {
  res.status(404).render('404');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5121;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
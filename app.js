// app.js
const express = require('express');
const path = require('path');

const app = express();

// Configuration de Pug comme moteur de templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques (comme jQuery)
app.use('/code', express.static(path.join(__dirname, 'public', 'code')));

// Données des produits (pour l'instant définies en dur)
const produits = [
  { nom: 'Smartphone Alpha', annee: 2023, prix: 699.99, stock: 25, numeroSerie: 'SN123456' },
  { nom: 'Ordinateur Portable Beta', annee: 2024, prix: 1299.99, stock: 15, numeroSerie: 'SN234567' },
  { nom: 'Tablette Gamma', annee: 2022, prix: 399.99, stock: 40, numeroSerie: 'SN345678' },
  { nom: 'Montre Connectée Delta', annee: 2023, prix: 199.99, stock: 60, numeroSerie: 'SN456789' },
  { nom: 'Casque Audio Epsilon', annee: 2024, prix: 149.99, stock: 30, numeroSerie: 'SN567890' }
];

// Route principale pour afficher la liste des produits
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Liste des Produits', 
    produits: produits 
  });
});

// Route pour gérer une requête AJAX
app.get('/bonjour/:nom', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'Bonjour ' + req.params.nom + '!' }));
});

// Démarrage du serveur
const PORT = process.env.PORT || 5121;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

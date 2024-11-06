const express = require('express');
const path = require('path');

const app = express();

// Configuration de Pug comme moteur de templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques (comme jQuery)
app.use('/code', express.static(path.join(__dirname, 'public', 'code')));

// Route principale
app.get('/', (req, res) => {
  res.render('temp_exemple', { 
    title: 'Bonjour', 
    noms: ['Pauline', 'Jean', 'Jacques'] 
  });
});

// Route pour gérer la requête AJAX
app.get('/bonjour/:name', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'Bonjour ' + req.params.name + '!' }));
});

// Démarrage du serveur
const PORT = process.env.PORT || 5121;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

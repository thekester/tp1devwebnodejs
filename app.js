// app.js
require('dotenv').config(); // Charger les variables d'environnement depuis .env

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3

const app = express();

// Configuration de Pug comme moteur de templates
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques
app.use('/code', express.static(path.join(__dirname, 'public', 'code')));
app.use('/style', express.static(path.join(__dirname, 'public', 'style'))); // Serve CSS files
app.use('/images', express.static(path.join(__dirname, 'public', 'images'))); // Serve images


// Middleware pour parser les requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données SQLite

const dbPath = path.join('./bdd', 'tavenel.db');
console.log(`Chemin de la base de données: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite.');
  }
});

// Initialisation de la base de données avec les tables nécessaires
db.serialize(() => {
  // Création de la table 'products' si elle n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      annee INTEGER,
      prix REAL,
      stock INTEGER,
      numeroSerie TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table products:', err.message);
    } else {
      console.log('Table products prête.');
      // Optionnel: Insérer des produits si la table est vide
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
          console.error('Erreur lors de la vérification des produits:', err.message);
        } else if (row.count === 0) {
          const insert = 'INSERT INTO products (nom, annee, prix, stock, numeroSerie) VALUES (?, ?, ?, ?, ?)';
          const products = [
            ['Smartphone Alpha', 2023, 699.99, 25, 'SN123456'],
            ['Ordinateur Portable Beta', 2024, 1299.99, 15, 'SN234567'],
            ['Tablette Gamma', 2022, 399.99, 0, 'SN345678'], // En rupture de stock
            ['Montre Connectée Delta', 2023, 199.99, 60, 'SN456789'],
            ['Casque Audio Epsilon', 2024, 149.99, 0, 'SN567890'], // En rupture de stock
            ['Clavier Zeta', 2023, 89.99, 10, 'SN678901'],
            ['Souris Eta', 2022, 49.99, 5, 'SN789012']
          ];
          products.forEach((product) => {
            db.run(insert, product, (err) => {
              if (err) {
                console.error('Erreur lors de l\'insertion d\'un produit:', err.message);
              }
            });
          });
          console.log('Produits insérés dans la table products.');
        }
      });
    }
  });

  // Création de la table 'transactions' si elle n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      message TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table transactions:', err.message);
    } else {
      console.log('Table transactions prête.');
    }
  });
});

// Gestion de l'arrêt du serveur pour fermer la connexion à la base de données
// https://stackoverflow.com/questions/46908853/process-onsigint-multiple-termination-signals

// Fonction de gestion des signaux
/**
 * 
 * @param {NodeJS.SignalsListener} signal
 */
function signalHandler(signal) {
  console.log(`\nReçu le signal ${signal}. Fermeture de la connexion à la base de données.`);
  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données:', err.message);
      process.exit(1);
    } else {
      console.log('Connexion à la base de données fermée.');
      process.exit(0);
    }
  });
}

// Liste des signaux à gérer
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

// Attacher le gestionnaire de signaux à chaque signal
signals.forEach(signal => {
  process.on(signal, signalHandler);
});

// Route principale pour afficher la liste des produits disponibles
app.get('/', (req, res) => {
  const query = 'SELECT * FROM products WHERE stock >= 1';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits:', err.message);
      res.status(500).send('Erreur du serveur');
    } else {
      res.render('index', { 
        title: 'Liste des Produits Disponibles', 
        produits: rows 
      });
    }
  });
});

// Route pour afficher les détails d'un produit spécifique
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  
  // Validation de l'ID du produit
  if (isNaN(productId) || productId < 1) {
    return res.status(400).render('400', { message: 'ID de produit invalide.' });
  }

  const query = 'SELECT * FROM products WHERE id = ?';
  
  db.get(query, [productId], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du produit:', err.message);
      res.status(500).send('Erreur du serveur');
    } else if (row) {
      res.render('product', { 
        title: row.nom, 
        produit: row 
      });
    } else {
      // Rendre le template 404
      res.status(404).render('404');
    }
  });
});

// Route pour gérer les achats
app.post('/buy/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  
  // Validation de l'ID du produit
  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ success: false, message: 'ID de produit invalide.' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Vérifier le stock actuel du produit
    const selectQuery = 'SELECT * FROM products WHERE id = ?';
    db.get(selectQuery, [productId], (err, produit) => {
      if (err) {
        db.run('ROLLBACK');
        console.error('Erreur lors de la récupération du produit:', err.message);
        return res.status(500).json({ success: false, message: 'Erreur du serveur.' });
      }

      if (!produit) {
        db.run('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
      }

      if (produit.stock < 1) {
        db.run('ROLLBACK');
        return res.json({ success: false, message: 'Produit en rupture de stock.' });
      }

      // Décrémenter le stock
      const updateQuery = 'UPDATE products SET stock = stock - 1 WHERE id = ?';
      db.run(updateQuery, [productId], function(err) {
        if (err) {
          db.run('ROLLBACK');
          console.error('Erreur lors de la mise à jour du stock:', err.message);
          return res.status(500).json({ success: false, message: 'Erreur du serveur.' });
        }

        // Enregistrer la transaction avec un message enrichi
        const insertTransaction = 'INSERT INTO transactions (product_id, message) VALUES (?, ?)';
        const message = `Achat de "${produit.nom}" au prix de ${produit.prix}€ effectué.`;
        db.run(insertTransaction, [productId, message], function(err) {
          if (err) {
            db.run('ROLLBACK');
            console.error('Erreur lors de l\'insertion de la transaction:', err.message);
            return res.status(500).json({ success: false, message: 'Erreur du serveur.' });
          }

          // Valider la transaction
          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              console.error('Erreur lors de la validation de la transaction:', err.message);
              return res.status(500).json({ success: false, message: 'Erreur du serveur.' });
            }

            res.json({ success: true, message: 'Achat réussi !', nouveauStock: produit.stock - 1 });
          });
        });
      });
    });
  });
});


// Nouvelle Route pour afficher la liste de tous les achats effectués
app.get('/achats', (req, res) => {
  const query = `
    SELECT 
      transactions.id AS transaction_id,
      transactions.date,
      transactions.message,
      products.nom AS produit_nom,
      products.prix AS produit_prix,
      products.numeroSerie AS produit_numeroSerie
    FROM 
      transactions
    JOIN 
      products 
    ON 
      transactions.product_id = products.id
    ORDER BY 
      transactions.date DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des achats:', err.message);
      res.status(500).send('Erreur du serveur');
    } else {
      res.render('achats', { 
        title: 'Liste des Achats Effectués', 
        achats: rows 
      });
    }
  });
});


// Nouvelle Route pour l'administration : création de nouveaux produits
app.get('/admin', (req, res) => {
  res.render('admin', { 
    title: 'Administration - Ajouter un Nouveau Produit' 
  });
});

app.post('/admin', (req, res) => {
  const { nom, annee, prix, stock, numeroSerie } = req.body;

  // Validation des champs
  if (!nom || !annee || !prix || !stock || !numeroSerie) {
    return res.status(400).render('admin', { 
      title: 'Administration - Ajouter un Nouveau Produit',
      error: 'Tous les champs sont obligatoires.',
      nom, annee, prix, stock, numeroSerie
    });
  }

  const anneeInt = parseInt(annee, 10);
  const prixFloat = parseFloat(prix);
  const stockInt = parseInt(stock, 10);

  if (isNaN(anneeInt) || isNaN(prixFloat) || isNaN(stockInt)) {
    return res.status(400).render('admin', { 
      title: 'Administration - Ajouter un Nouveau Produit',
      error: 'L\'année, le prix et le stock doivent être des nombres valides.',
      nom, annee, prix, stock, numeroSerie
    });
  }

  const insertQuery = 'INSERT INTO products (nom, annee, prix, stock, numeroSerie) VALUES (?, ?, ?, ?, ?)';

  db.run(insertQuery, [nom, anneeInt, prixFloat, stockInt, numeroSerie], function(err) {
    if (err) {
      console.error('Erreur lors de l\'insertion du nouveau produit:', err.message);
      return res.status(500).render('admin', { 
        title: 'Administration - Ajouter un Nouveau Produit',
        error: 'Erreur lors de la création du produit. Veuillez réessayer.',
        nom, annee, prix, stock, numeroSerie
      });
    }

    // Rediriger vers la page admin avec un message de succès
    res.render('admin', { 
      title: 'Administration - Ajouter un Nouveau Produit',
      success: `Produit "${nom}" ajouté avec succès !`,
      nom: '', 
      annee: '', 
      prix: '', 
      stock: '', 
      numeroSerie: '' 
    });
  });
});

// Route pour gérer une requête AJAX (exemple pour saluer un produit, à adapter selon besoins)
app.get('/bonjour/:nom', (req, res) => {
  const nom = req.params.nom.trim();

  if (!nom) {
    return res.status(400).json({ message: 'Nom invalide.' });
  }

  res.json({ message: `Bonjour ${nom} !` });
});

// Route 404 pour les autres chemins non définis
app.use((req, res) => {
  res.status(404).render('404');
});

// Route 400 pour les requêtes invalides
app.use((err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).render('400', { message: err.message });
  } else {
    next(err);
  }
});

// Démarrage du serveur avec port configurable via variable d'environnement
const PORT = process.env.PORT || 5121;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

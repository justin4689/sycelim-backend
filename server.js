// Connexion à Turso (Drizzle ORM)
const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');
const schema = require('./drizzle/schema.js');


// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Remplacé par Drizzle/Turso (voir plus bas)

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route d'accueil (préfixée par /api)
app.get('/api', (req, res) => {
  res.send('Welcome to Sycelim Delivery');
});

// Routes API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/deliveries', require('./routes/delivery.routes'));

const db = require('./config/database');

// On démarre le serveur directement (migrations déjà faites via Drizzle Kit)
app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
});

// Vous pouvez exporter db pour l'utiliser dans vos routes/services
module.exports = { app, db };

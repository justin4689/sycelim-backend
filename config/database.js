// config/database.js
const { createClient } = require('@libsql/client');
const { drizzle } = require('drizzle-orm/libsql');
const schema = require('../drizzle/schema');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN // optionnel, selon ta config Turso
});

const db = drizzle(client, { schema });

module.exports = db;
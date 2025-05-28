// drizzle.config.js
module.exports = {
  schema: './drizzle/schema.js', // Chemin du schéma à créer
  out: './drizzle/migrations',   // Où stocker les migrations
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
};

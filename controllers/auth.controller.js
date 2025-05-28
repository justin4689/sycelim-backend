// Contrôleur d'authentification
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { users } = require('../drizzle/schema');
const { v4: uuidv4 } = require('uuid');
const { eq } = require('drizzle-orm');

module.exports = {
  // À compléter : logique de connexion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
      }
      // Chercher l'utilisateur
      const usersFound = await db.select().from(users).where(eq(users.email, email));
      if (usersFound.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
      }
      const user = usersFound[0];
      // Vérifier le mot de passe
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
      }
      // Générer le token
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      // Retourner les infos utilisateur sans le mot de passe
      const { password: _, ...userInfo } = user;
      res.json({ token, user: userInfo ,message: 'Connexion réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Logique d'inscription
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role } = req.body;
      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
      }
      // Vérifier si l'utilisateur existe déjà
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insertion
      await db.insert(users).values({
        id: uuidv4(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
      res.status(201).json({ message: 'Inscription réussie.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
};

// Contrôleur de livraison
const db = require('../config/database');
const { deliveries, users } = require('../drizzle/schema');
const { v4: uuidv4 } = require('uuid');
const { eq } = require('drizzle-orm');

module.exports = {
  // Création d'une livraison
  createDelivery: async (req, res) => {
    try {
      const { customerName, address  } = req.body;
      if (!customerName || !address) {
        return res.status(400).json({ message: 'Champs requis manquants.' });
      }
      const assignedTo = req.user.id;
      const newDelivery = {
        id: uuidv4(),
        customerName,
        address,
        assignedTo,
        // status et createdAt sont gérés par défaut
      };
      await db.insert(deliveries).values(newDelivery);
      res.status(201).json({ message: 'Livraison créée', delivery: newDelivery });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
  // Récupération des livraisons du livreur connecté
  getMyDeliveries: async (req, res) => {
    try {
      const myDeliveries = await db.select().from(deliveries).where(eq(deliveries.assignedTo, req.user.id));
      const deliveriesWithFirstname = await Promise.all(
        myDeliveries.map(async (delivery) => {
          let livreurFirstname = null;
          if (delivery.assignedTo) {
            const livreur = await db.select().from(users).where(eq(users.id, delivery.assignedTo));
            if (livreur && livreur.length > 0) {
              livreurFirstname = livreur[0].firstName;
            }
          }
          return { ...delivery, livreurFirstname };
        })
      );
      res.json(deliveriesWithFirstname);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

// Récupération de toutes les livraisons
  getDeliveries: async (req, res) => {
    try {
      const allDeliveries = await db.select().from(deliveries);
      // Pour chaque livraison, récupérer le prénom du livreur
      const deliveriesWithFirstname = await Promise.all(
        allDeliveries.map(async (delivery) => {
          let livreurFirstname = null;
          if (delivery.assignedTo) {
            const livreur = await db.select().from(users).where(eq(users.id, delivery.assignedTo));
            if (livreur && livreur.length > 0) {
              livreurFirstname = livreur[0].firstName;
            }
          }
          return { ...delivery, livreurFirstname };
        })
      );
      res.json(deliveriesWithFirstname);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Supprimer une livraison par id
  deleteDelivery: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.delete(deliveries).where(eq(deliveries.id, id));
      if (deleted.changes === 0) {
        return res.status(404).json({ message: 'Livraison non trouvée.' });
      }
      res.json({ message: 'Livraison supprimée.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Changer le statut d'une livraison
  updateDeliveryStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Nouveau statut requis.' });
      }
      const updated = await db.update(deliveries).set({ status }).where(eq(deliveries.id, id));
      if (updated.changes === 0) {
        return res.status(404).json({ message: 'Livraison non trouvée.' });
      }
      res.json({ message: 'Statut mis à jour.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
};
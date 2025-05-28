// Routes de livraison
const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

const auth = require('../middlewares/auth');
router.post('/', auth, deliveryController.createDelivery);
router.get('/', deliveryController.getDeliveries);
// Livraisons du livreur connecté
router.get('/mine', auth, deliveryController.getMyDeliveries);

// Supprimer une livraison
router.delete('/:id', auth, deliveryController.deleteDelivery);
// Changer le statut d'une livraison
router.patch('/:id/status', auth, deliveryController.updateDeliveryStatus);

module.exports = router;

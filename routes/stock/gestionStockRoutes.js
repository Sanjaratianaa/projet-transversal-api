const express = require('express');
const router = express.Router();
const gestionStockController = require('../../controllers/stock/gestionStockController');

router.post('/', gestionStockController.createGestionStock);
router.get('/', gestionStockController.getAllGestionStocks);
router.get('/mouvement/:id', gestionStockController.getGestionStockById);
router.get('/stocks', gestionStockController.getStocks);
router.put('/:id', gestionStockController.updateGestionStock);
router.delete('/:id', gestionStockController.deleteGestionStock);

module.exports = router;
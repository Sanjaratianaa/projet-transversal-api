const express = require('express');
const router = express.Router();
const voitureController = require('../controllers/voitureController');

router.post('/', voitureController.createVoiture);
router.get('/', voitureController.getAllVoitures);
router.get('/client', voitureController.getAllVoituresByClient);
router.get('/one/:id', voitureController.getVoitureById);
router.put('/:id', voitureController.updateVoiture);
router.delete('/:id', voitureController.deleteVoiture);

module.exports = router;
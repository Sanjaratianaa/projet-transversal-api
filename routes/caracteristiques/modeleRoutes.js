const express = require('express');
const router = express.Router();
const modeleController = require('../../controllers/caracteristiques/modeleController');

router.post('/', modeleController.createModele);
router.get('/', modeleController.getAllModeles);
router.get('/active', modeleController.getAllModelesActives);
router.get('/:id', modeleController.getModeleById);
router.put('/:id', modeleController.updateModele);
router.delete('/:id', modeleController.deleteModele);

module.exports = router;
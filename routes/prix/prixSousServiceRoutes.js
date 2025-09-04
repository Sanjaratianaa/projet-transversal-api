const express = require('express');
const router = express.Router();
const prixSousServiceController = require('../../controllers/prix/prixSousServiceController');

router.post('/', prixSousServiceController.createPrixSousService);
router.get('/', prixSousServiceController.getAllPrixSousServices);
router.get('/:id', prixSousServiceController.getPrixSousServiceById);
router.put('/:id', prixSousServiceController.updatePrixSousService);
router.delete('/:id', prixSousServiceController.deletePrixSousService);

module.exports = router;
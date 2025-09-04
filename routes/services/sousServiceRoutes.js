const express = require('express');
const router = express.Router();
const sousServiceController = require('../../controllers/services/sousServiceController');

router.post('/', sousServiceController.createSousService);
router.get('/', sousServiceController.getAllSousServices);
router.get('/active', sousServiceController.getAllSousServicesActives);
router.get('/:id', sousServiceController.getSousServiceById);
router.put('/:id', sousServiceController.updateSousService);
router.delete('/:id', sousServiceController.deleteSousService);

module.exports = router;
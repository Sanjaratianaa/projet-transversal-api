const express = require('express');
const router = express.Router();
const demandeCongesController = require('../controllers/demandeCongeController');

router.post('/', demandeCongesController.createDemandeConges);
router.get('/', demandeCongesController.getAllDemandeConges);
router.get('/:id', demandeCongesController.getDemandeCongesById);
router.put('/:id', demandeCongesController.updateDemandeConges);
router.delete('/:id', demandeCongesController.deleteDemandeConges);

module.exports = router;
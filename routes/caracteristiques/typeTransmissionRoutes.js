const express = require('express');
const router = express.Router();
const typeTransmissionController = require('../../controllers/caracteristiques/typeTransmissionController');

router.post('/', typeTransmissionController.createTypeTransmission);
router.get('/', typeTransmissionController.getAllTypeTransmissions);
router.get('/active', typeTransmissionController.getAllTypeTransmissionsActives);
router.get('/:id', typeTransmissionController.getTypeTransmissionById);
router.put('/:id', typeTransmissionController.updateTypeTransmission);
router.delete('/:id', typeTransmissionController.deleteTypeTransmission);

module.exports = router;
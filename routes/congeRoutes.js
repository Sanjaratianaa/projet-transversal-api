const express = require('express');
const router = express.Router();
const congeController = require('../controllers/utilisateur/congeController');

router.get('/parMecanicien', congeController.getListCongeByMecanicien);
router.get('/parEtat/:etat', congeController.getListCongeByEtat);
router.get('/:id', congeController.getCongeById);
router.get('/', congeController.getAllConge);
router.post('/', congeController.createConge);
router.put('/repondre/:id', congeController.modifierConge);
router.put('/:id', congeController.updateConge);

module.exports = router;
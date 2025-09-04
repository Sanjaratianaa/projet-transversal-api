const express = require('express');
const router = express.Router();
const specialiteController = require('../../controllers/utilisateur/specialiteController');

router.post('/', specialiteController.createSpecialite);
router.get('/', specialiteController.getAllSpecialites);
router.get('/active', specialiteController.getAllSpecialitesActives);
router.get('/:id', specialiteController.getSpecialiteById);
router.get('/mecanicien/:idSousService', specialiteController.getAllSpecialitesActivesBySousService);
router.put('/:id', specialiteController.updateSpecialite);
router.delete('/:id', specialiteController.deleteSpecialite);

module.exports = router;
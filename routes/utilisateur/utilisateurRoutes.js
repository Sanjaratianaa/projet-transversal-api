const express = require('express');
const router = express.Router();
const utilisateurController = require('../../controllers/utilisateur/utilisateurController');

router.post('/', utilisateurController.createUser);
router.get('/', utilisateurController.getAllUsers);

// by role
router.get('/active-utilisateurs-by-role', utilisateurController.getActiveUsersByRole);
router.get('/utilisateurs-by-role', utilisateurController.getAllUsersByRole);

router.get('/:id', utilisateurController.getUserById);
router.put('/:id', utilisateurController.updateUser);
router.delete('/:id', utilisateurController.deleteUser);

module.exports = router;
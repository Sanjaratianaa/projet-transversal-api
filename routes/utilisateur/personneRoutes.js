const express = require('express');
const router = express.Router();
const personneController = require('../../controllers/utilisateur/personneController');

// Create a new person
router.post('/', personneController.createPersonne);

// Get all people
router.get('/', personneController.getAllPersonnes);

// Get a person by ID
router.get('/:id', personneController.getPersonneById);

// Update a person
router.put('/:id', personneController.updatePersonne);

// Delete a person
router.delete('/:id', personneController.deletePersonne);

module.exports = router;
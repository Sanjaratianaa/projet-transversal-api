const express = require('express');
const router = express.Router();
const prixPieceController = require('../../controllers/prix/prixPieceController');

router.post('/', prixPieceController.createPrixPiece);
router.get('/', prixPieceController.getAllPrixPieces);
router.get('/:id', prixPieceController.getPrixPieceById);
router.put('/:id', prixPieceController.updatePrixPiece);
router.delete('/:id', prixPieceController.deletePrixPiece);

module.exports = router;
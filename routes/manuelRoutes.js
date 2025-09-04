const express = require('express');
const router = express.Router();
const manuelController = require('../controllers/manuelController');

router.post('/', manuelController.createManuel);
router.get('/', manuelController.getAllManuels);
router.get('/:id', manuelController.getManuelById);
router.put('/:id', manuelController.updateManuel);
router.delete('/:id', manuelController.deleteManuel);

module.exports = router;
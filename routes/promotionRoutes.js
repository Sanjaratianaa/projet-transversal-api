const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotionById);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
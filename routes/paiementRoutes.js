const express = require("express");
const router = express.Router();
const paiementController = require("../controllers/paiementController");

router.post("/", paiementController.createPaiement);
router.get("/", paiementController.getAllPaiements);
router.get("/:id", paiementController.getPaiementById);
router.put("/:id", paiementController.updatePaiement);
router.delete("/:id", paiementController.deletePaiement);

module.exports = router;

const express = require("express");
const router = express.Router();

const roleRoutes = require("./utilisateur/roleRoutes");
const personneRoutes = require("./utilisateur/personneRoutes");
const utilisateurRoutes = require("./utilisateur/utilisateurRoutes");
const authenticationRoutes = require("./utilisateur/authentificationRoutes");

const categorieRoutes = require("./caracteristiques/categorieRoutes");
const marqueRoutes = require("./caracteristiques/marqueRoutes");
const modeleRoutes = require("./caracteristiques/modeleRoutes");
const pieceRoutes = require("./caracteristiques/pieceRoutes");
const typeTransmissionRoutes = require("./caracteristiques/typeTransmissionRoutes");

const prixPieceRoutes = require("./prix/prixPieceRoutes");
const prixSousServiceRoutes = require("./prix/prixSousServiceRoutes");

const serviceRoutes = require("./services/serviceRoutes");
const sousServiceRoutes = require("./services/sousServiceRoutes");

const manuelRoutes = require("./manuelRoutes");
const promotionRoutes = require("./promotionRoutes");
const congeRoutes = require("./congeRoutes");
const voitureRoutes = require("./voitureRoutes");
const rendezVousRoutes = require("./rendezVousRoutes");
const gestionStockRoutes = require("./stock/gestionStockRoutes");
const specialiteRoutes = require("./utilisateur/specialiteRoutes");

const paiementRoutes = require("./paiementRoutes");

const secretKey = "M1-project-MEAN";
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

router.use("/role", roleRoutes);
router.use("/personne", personneRoutes);

router.use("/utilisateur", utilisateurRoutes);

router.use("/auth", authenticationRoutes);

router.use((req, res, next) => {
    if (
        req.path.startsWith("/role") ||
        req.path.startsWith("/personne") ||
        req.path.startsWith("/auth")
    ) {
        return next();
    }
    authenticateToken(req, res, next);
});

// caracteritiques
router.use("/categories", categorieRoutes);
router.use("/marques", marqueRoutes);
router.use("/modeles", modeleRoutes);
router.use("/pieces", pieceRoutes);
router.use("/transmissions", typeTransmissionRoutes);

// prix
router.use("/prixPieces", prixPieceRoutes);
router.use("/prixSousServices", prixSousServiceRoutes);

// services
router.use("/services", serviceRoutes);
router.use("/sousServices", sousServiceRoutes);

router.use("/manuels", manuelRoutes);
router.use("/promotions", promotionRoutes);
router.use("/conges", congeRoutes);
router.use("/voitures", voitureRoutes);
router.use("/rendezVous", rendezVousRoutes);
router.use("/stocks", gestionStockRoutes);
router.use("/specialites", specialiteRoutes);

router.use("/paiements", paiementRoutes);

module.exports = router;

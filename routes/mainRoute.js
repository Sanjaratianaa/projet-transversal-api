const express = require("express");
const router = express.Router();

const roleRoutes = require("./utilisateur/roleRoutes");
const personneRoutes = require("./utilisateur/personneRoutes");
const utilisateurRoutes = require("./utilisateur/utilisateurRoutes");
const authenticationRoutes = require("./utilisateur/authentificationRoutes");

const secretKey = "M1-transversal-project";
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

module.exports = router;

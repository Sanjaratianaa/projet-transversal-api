
import express from "express";
import authenticationRoutes from "./utilisateur/authentificationRoutes";
import categorieRoutes from "./categorie/categorieRoute";
import factureRoutes from "./factures/facturesRoute";
import fichierRoutes from "./factures/fichierRoute";
import objectifsRoutes from "./objectif/objectifRoute";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const router = express.Router();
const secretKey = "M1-transversal-project";

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};


router.use("/auth", authenticationRoutes);
router.use("/categorie", categorieRoutes);
router.use("/factures", factureRoutes);
router.use("/uploads", express.static("uploads"));
router.use("/factures/fichiers", fichierRoutes);
router.use("/objectifs", objectifsRoutes);

router.use((req, res, next) => {
    if (
        req.path.startsWith("/auth")
    ) {
        return next();
    }
    authenticateToken(req, res, next);
});

export default router;
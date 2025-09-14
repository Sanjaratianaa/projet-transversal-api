
import express from "express";
import authenticationRoutes from "./utilisateur/authentificationRoutes";
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

router.use((req, res, next) => {
    if (
        req.path.startsWith("/auth")
    ) {
        return next();
    }
    authenticateToken(req, res, next);
});

export default router;

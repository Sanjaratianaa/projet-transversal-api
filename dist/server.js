"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mainRoute_1 = __importDefault(require("./routes/mainRoute"));
const syncRoutes_1 = __importDefault(require("./routes/syncRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: [
        "https://m1garagefrontend-dkaw--4200--33edf5bb.local-credentialless.webcontainer.io",
        "http://localhost:4200",
        "http://localhost:3000",
        "http://localhost:8100",
        "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api", mainRoute_1.default);
app.use("/api", syncRoutes_1.default);
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRoutes from './routes/mainRoute';
import syncRoutes from './routes/syncRoutes';

dotenv.config();

const app = express();
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

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", mainRoutes);
app.use("/api", syncRoutes);

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
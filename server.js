const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    "https://m1garagefrontend-dkaw--4200--33edf5bb.local-credentialless.webcontainer.io",
    "http://localhost:4200", // Add others if needed
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes
const mainRoutes = require("./routes/mainRoute");

app.use("/api", mainRoutes);

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

const mongoose = require("mongoose");

const PaiementSchema = new mongoose.Schema(
    {
        rendezVous: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RendezVous",
            required: true,
        },
        mecanicien: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Personne",
            required: true,
        },
        montant: {
            type: Number,
            required: true,
        },
        datePaiement: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Paiement", PaiementSchema);

const Paiement = require("../models/Paiement");

// Create a new Paiement
exports.createPaiement = async (req, res) => {
    try {
        const paiement = new Paiement(req.body);
        await paiement.save();
        res.status(201).json(paiement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Paiements
exports.getAllPaiements = async (req, res) => {
    try {
        const promotions = await Paiement.find()
            .populate("rendezVous")
            .populate("mecanicien");
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Paiement by ID
exports.getPaiementById = async (req, res) => {
    try {
        const paiement = await Paiement.findById(req.params.id)
            .populate("rendezVous")
            .populate("mecanicien");
        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }
        res.json(paiement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Paiement
exports.updatePaiement = async (req, res) => {
    try {
        const paiement = await Paiement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        )
            .populate("rendezVous")
            .populate("mecanicien");

        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }

        res.json(paiement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Paiement
exports.deletePaiement = async (req, res) => {
    try {
        const paiement = await Paiement.findByIdAndDelete(req.params.id);
        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }
        res.json({ message: "Paiement deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

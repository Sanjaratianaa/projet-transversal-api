const mongoose = require('mongoose');
const PrixPiece = require('../../models/prix/PrixPiece');

// Create a new PrixPiece
exports.createPrixPiece = async (req, res) => {
    try {
        const prixStockData = {
            ...req.body,
            manager: req.user.id,
        };

        if (prixStockData.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck = new Date(prixStockData.date); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today)
            throw new Error(`Date applicatif invalide. La date doit être supérieure ou égale à la date du jour.`);

        const prixPieceSave = new PrixPiece(prixStockData);
        await prixPieceSave.save();

        const prixPiece = await PrixPiece.findById(prixPieceSave.id)
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        res.status(201).json(prixPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all PrixPieces
exports.getAllPrixPieces = async (req, res) => {
    try {
        const prixPieces = await PrixPiece.find()
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(prixPieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a PrixPiece by ID
exports.getPrixPieceById = async (req, res) => {
    try {
        const prixPiece = await PrixPiece.findById(req.params.id)
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }
        res.json(prixPiece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PrixPiece
exports.updatePrixPiece = async (req, res) => {
    try {
        if (req.body.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck = new Date(req.body.date); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        // if (dateToCheck < today)
        //     throw new Error(`Date applicatif invalide. La date doit être supérieure ou égale à la date du jour.`);

        const prixPiece = await PrixPiece.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }

        res.json(prixPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a PrixPiece
exports.deletePrixPiece = async (req, res) => {
    try {
        const prixPiece = await PrixPiece.findByIdAndDelete(req.params.id);
        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }
        res.json({ message: 'PrixPiece deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPrixPiece = async function getPrixPiece(piece, marquePiece, marqueVoiture = null, modeleVoiture = null, typeTransmission = null) {
    const today = new Date(); // Date du jour

    // Construire la requête dynamique
    const query = {
        "marquePiece": marquePiece.toUpperCase(),
        "piece": new mongoose.Types.ObjectId(piece),
        "date": { $lte: today }
    };

    // Si marqueVoiture n'est pas null, ajouter la condition sur marqueVoiture
    if (marqueVoiture !== null) {
        query["marqueVoiture"] = new mongoose.Types.ObjectId(marqueVoiture);
    } else {
        // Si marqueVoiture est null, on recherche où marqueVoiture est aussi null
        query["marqueVoiture"] = null;
    }

    // Si modeleVoiture est spécifié, l'ajouter à la requête
    if (modeleVoiture !== null) {
        query["modeleVoiture"] = new mongoose.Types.ObjectId(modeleVoiture);
    } else {
        query["modeleVoiture"] = null;
    }

    // Si typeTransmission est spécifié, l'ajouter à la requête
    if (typeTransmission !== null) {
        query["typeTransmission"] = new mongoose.Types.ObjectId(typeTransmission);
    } else
        query["typeTransmission"] = null;

    // Effectuer la recherche dans la collection "prix"
    const prix = await PrixPiece.findOne(query)
        .sort({ date: -1, dateEnregistrement: -1 }) // Trier par date DESC puis dateEnregistrement DESC
        .limit(1)
        .lean(); // On utilise limit(1) pour n'obtenir qu'une seule ligne

    return prix ? prix.prixUnitaire : 0;
}
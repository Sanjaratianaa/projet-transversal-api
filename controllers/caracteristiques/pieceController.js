const Piece = require('../../models/caracteristiques/Piece');

// Create a new piece
exports.createPiece = async (req, res) => {
    try {
        const pieceData = {
            ...req.body,
            manager: req.user.id,
        };
        const pieceSave = new Piece(pieceData);
        await pieceSave.save();
        const piece = await Piece.findById(pieceSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(piece);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `La piece "${req.body.libelle}" existe déjà. Veuillez choisir un autre nom de piece.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};


// Get all pieces
exports.getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find()
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pieces actives
exports.getAllPiecesActives = async (req, res) => {
    try {
        const pieces = await Piece.find({etat: "Active"})
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a piece by ID
exports.getPieceById = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        res.json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a piece
exports.updatePiece = async (req, res) => {
    try {
        const piece = await Piece.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        res.json(piece);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `La piece "${req.body.libelle}" existe déjà. Veuillez choisir un autre nom de piece.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a piece
exports.deletePiece = async (req, res) => {
    try {
        const piece = await Piece.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Piecer comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id  // Qui a supprimé ?
            },
            { new: true }
        )
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        res.json(piece);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
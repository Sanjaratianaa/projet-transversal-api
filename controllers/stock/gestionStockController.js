const mongoose = require('mongoose');
const GestionStock = require('../../models/stock/GestionStock');
const Stock = require('../../models/stock/Stock');
const PrixPieceController = require('../prix/prixPieceController'); 

// Create a new GestionStock entry
exports.createGestionStock = async (req, res) => {
    try {
        const gestionStockData = {
            ...req.body,
            manager: req.user.id,
        };

        if (gestionStockData.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        if (gestionStockData.entree < 0 || gestionStockData.sortie < 0)
            throw new Error(`Quantité invalide. Le quantité doit etre superieur à zero.`);
        
        if(gestionStockData.sortie > 0) {
            const reste = await getResteStock(gestionStockData.piece, gestionStockData.marquePiece, gestionStockData.marqueVoiture, gestionStockData.modeleVoiture, gestionStockData.typeTransmission);
            console.log(reste);
            if(Number(reste) < gestionStockData.sortie) {
                throw new Error(`Sortie des stocks invalide. Le reste en stocks est ${reste}.`);
            }
        }

        const gestionStockSave = new GestionStock(gestionStockData);
        await gestionStockSave.save();
        const gestionStock = await GestionStock.findById(gestionStockSave.id)
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
        res.status(201).json(gestionStock);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get all GestionStock entries
exports.getAllGestionStocks = async (req, res) => {
    try {
        const gestionStocks = await GestionStock.find()
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
        res.json(gestionStocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a GestionStock entry by ID
exports.getGestionStockById = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findById(req.params.id)
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
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json(gestionStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a GestionStock entry
exports.updateGestionStock = async (req, res) => {
    try {
        if (req.body.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        if (req.body.entree < 0 || req.body.sortie < 0)
            throw new Error(`Quantité invalide. Le prix doit etre superieur à zero.`);

        const gestionStock = await GestionStock.findByIdAndUpdate(
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
            })

        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }

        res.json(gestionStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a GestionStock entry
exports.deleteGestionStock = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findByIdAndDelete(req.params.id);
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json({ message: 'GestionStock entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStocks = async (req, res) => {
    try {
        // Récupérer tous les documents de la vue 'stocks'
        const stocks = await Stock.find().lean();
        for(let stock of stocks) {
            const prix = await PrixPieceController.getPrixPiece(stock.piece._id, stock.marquePiece, stock?.marqueVoiture ? stock.marqueVoiture._id : null, stock?.modeleVoiture ? stock.modeleVoiture._id : null, stock?.typeTransmission ? stock.typeTransmission._id : null);
            stock.prixUnitaire = prix;
        }
        res.json(stocks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: error.message });
    }
};

async function getResteStock(piece, marquePiece, marqueVoiture = null, modeleVoiture = null, typeTransmission = null) {
    try {
        // Construire la requête dynamique
        const query = {
            "marquePiece": marquePiece.toUpperCase(), 
            "piece._id": new mongoose.Types.ObjectId(piece)
        };

        // Si marqueVoiture n'est pas null, ajouter la condition sur marqueVoiture
        if (marqueVoiture !== null) {
            query["marqueVoiture._id"] = new mongoose.Types.ObjectId(marqueVoiture);
        } else {
            // Si marqueVoiture est null, on recherche où marqueVoiture est aussi null
            query["marqueVoiture"] = null;
        }

        // Si modeleVoiture est spécifié, l'ajouter à la requête
        if (modeleVoiture !== null) {
            query["modeleVoiture._id"] = new mongoose.Types.ObjectId(modeleVoiture);
        } else {
            query["modeleVoiture"] = null;
        }

        // Si typeTransmission est spécifié, l'ajouter à la requête
        if (typeTransmission !== null) {
            query["typeTransmission._id"] = new mongoose.Types.ObjectId(typeTransmission);
        } else
            query["typeTransmission"] = null;

        // Effectuer la recherche dans la collection "stocks"
        const stocks = await Stock.find(query).limit(1); // On utilise limit(1) pour n'obtenir qu'une seule ligne
        // Si aucun stock n'est trouvé
        if (stocks.length === 0) {
            return 0;
        }
        // Retourner le résultat de la première ligne
        return stocks[0].reste;
    } catch (err) {
        console.error("Erreur lors de la récupération des stocks:", err);
        throw new Error('Erreur lors de la récupération des stocks');
    }
}

module.exports = {
    createGestionStock: exports.createGestionStock,
    getAllGestionStocks: exports.getAllGestionStocks,
    getGestionStockById: exports.getGestionStockById,
    updateGestionStock: exports.updateGestionStock,
    deleteGestionStock: exports.deleteGestionStock,
    getStocks: exports.getStocks,
    getResteStock: getResteStock,  // Pas besoin de `exports.` ici car `getResteStock` est une fonction définie normalement
};

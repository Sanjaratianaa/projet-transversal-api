const mongoose = require('mongoose');

const GestionStockSchema = new mongoose.Schema({
    piece: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Piece', 
        required: true 
    },
    marquePiece: { 
        type: String, 
        required: false 
    },
    marqueVoiture: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Marque', 
        required: false 
    },
    modeleVoiture: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Modele', 
        required: false 
    },
    typeTransmission: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TypeTransmission', 
        required: false 
    },
    entree: { 
        type: Number, 
        default: 0,
        required: true 
    },
    sortie: { 
        type: Number, 
        default: 0,
        required: true 
    },
    prixUnitaire: { 
        type: Number, 
        required: true 
    },
    dateHeure: { 
        type: Date, default: Date.now, 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('GestionStock', GestionStockSchema);

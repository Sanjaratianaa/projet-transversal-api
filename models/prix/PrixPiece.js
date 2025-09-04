const mongoose = require('mongoose');

const PrixPieceSchema = new mongoose.Schema({
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
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    date: { 
        type: Date, default: Date.now, 
        required: true 
    },
    prixUnitaire: { 
        type: Number, 
        default: 0, 
        required: true 
    },
    dateEnregistrement: { 
        type: Date, 
        default: Date.now, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('PrixPiece', PrixPieceSchema);

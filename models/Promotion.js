const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    sousService: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SousService', 
        required: true 
    },
    dateDebut: { 
        type: Date, 
        required: true 
    },
    dateFin: { 
        type: Date, 
        required: true 
    },
    remise: { 
        type: Number, 
        required: true 
    }, // Pourcentage ou montant de la remise
    dateEnregistrement: {
        type: Date,
        default: Date.now
    },
    etat: { 
        type: String, 
        required: true ,
        default: 'Active'
    } // Par exemple "actif", "inactif"
}, { timestamps: true });

module.exports = mongoose.model('Promotion', PromotionSchema);

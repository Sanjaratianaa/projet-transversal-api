const mongoose = require('mongoose');

const DemandeCongesSchema = new mongoose.Schema({
    mecanicien: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    dateHeureDebut: { 
        type: Date, 
        required: true 
    },
    dateHeureFin: { 
        type: Date, 
        required: true 
    },
    raisonConge: { 
        type: String, 
        required: true 
    },
    commentaire: { 
        type: String },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    etat: { 
        type: String, 
        required: true 
    } // e.g. "en attente", "approuvé", "refusé"
}, { timestamps: true });

module.exports = mongoose.model('DemandeConges', DemandeCongesSchema);

const mongoose = require('mongoose');

const CongeSchema = new mongoose.Schema({
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne',
        required: true
    },
    raison: {
        type: String,
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
    dateHeureDemande: {
        type: Date,
        default: Date.now,
        required: true
    },
    remarque: {
        type: String
    },
    validateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne'
    },
    etat: {
        type: String,
        enum: ['en attente', 'validé', 'rejeté', 'annulé'],
        default: 'en attente'
    }
}, { timestamps: true });

module.exports = mongoose.model('Conge', CongeSchema);

const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne'
    },
    voiture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voiture'
    },
    services: [
        {
            sousSpecialite: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SousService',
            },
            raison: {
                type: String,
            },
            mecanicien: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Personne',
            },
            quantiteEstimee: {
                type: Number,
            },
            heureDebut: {
                type: Date,
            },
            heureFin: {
                type: Date,
            },
            quantiteFinale: {
                type: Number,
            },
            prixUnitaire: {
                type: Number,
            },
            prixTotal: {
                type: Number,
            },
            remise: {
                type: Number,
                default: 0
            },
            commentaire: {
                type: String
            },
            note: {
                type: Number
            },
            avis: {
                type: String
            },
            status: {
                type: String,
                enum: ['en cours', 'en attente', 'suspendue', 'terminé'],
            }
        }
    ],
    dateHeureDemande: {
        type: Date,
        default: Date.now
    },
    dateRendezVous: {
        type: Date
    },
    heureDebut: {
        type: Date
    },
    heureFin: {
        type: Date
    },
    piecesAchetees: [
        {
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
            quantite: {
                type: Number,
            },
            prixUnitaire: {
                type: Number,
            },
            prixTotal: {
                type: Number,
            },
            remise: {
                type: Number,
            },
            commentaire: {
                type: String
            }
        }
    ],
    remarque: {
        type: String
    },
    validateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personne'
    },
    etat: {
        type: String,
        enum: ['en attente', 'validé', 'rejeté', 'annulé', 'terminé'],
        default: 'en attente'
    }
}, { timestamps: true });

module.exports = mongoose.model('RendezVous', RendezVousSchema);

const mongoose = require('mongoose');

const SousServiceSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    libelle: {
        type: String,
        unique: true,
        required: true
    },
    duree: {
        type: Number,
        required: true
    },
    dateEnregistrement: {
        type: Date,
        default: Date.now,
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    dateSuppression: {
        type: Date
    },
    managerSuppression: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },
    etat: {
        type: String,
        default: "Active",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SousService', SousServiceSchema);

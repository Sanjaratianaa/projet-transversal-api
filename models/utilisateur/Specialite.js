const mongoose = require('mongoose');

const SousServiceSchema = new mongoose.Schema({
    mecanicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    sousService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SousService',
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

module.exports = mongoose.model('Specialite', SousServiceSchema);

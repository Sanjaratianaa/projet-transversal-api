const mongoose = require('mongoose');

const PersonneSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true 
    },
    prenom: { 
        type: String, 
        required: true 
    },
    dateDeNaissance: { 
        type: Date, 
        required: true 
    },
    lieuDeNaissance: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: String, 
        enum: ['Homme', 'Femme', 'Autre'], 
        required: true 
    },
    etat: { 
        type: String, 
        default: 'Active',
        required: true 
    },
    numeroTelephone: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    dateSuppression: { 
        type: Date 
    }
}, { timestamps: true });

module.exports = mongoose.model('Personne', PersonneSchema);

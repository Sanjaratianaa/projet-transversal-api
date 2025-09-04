const mongoose = require('mongoose');

const ManuelSchema = new mongoose.Schema({
    sousSpecialite: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SousSpecialite', 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    documentation: { 
        type: String, 
        required: true 
    },
    etat: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Manuel', ManuelSchema);

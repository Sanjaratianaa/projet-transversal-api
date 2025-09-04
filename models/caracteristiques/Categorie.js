const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
    libelle: { 
        type: String, 
        unique: true,
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

module.exports = mongoose.model('Categorie', CategorieSchema);

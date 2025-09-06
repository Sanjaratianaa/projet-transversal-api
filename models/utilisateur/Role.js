const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    libelle: { 
        type: String, 
        required: true 
    },
    Etat: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    personne: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Personne', 
        required: true 
    },
    motDePasse: { 
        type: String, 
        required: true 
    },
    matricule: { 
        type: String
    },
    dateInscription: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    idRole: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true 
    },
    etat: { 
        type: String, 
        default: 'Active',
        required: true 
    },
    dateEnregistrement: { 
        type: Date,
        default: Date.now,
        required: true 
    },
    dateSuppression: { 
        type: Date 
    },
}, { timestamps: true });

UtilisateurSchema.index({ matricule: 1 }, { unique: true, sparse: true });

UtilisateurSchema.pre('save', async function(next) {
    try {
        if (this.isNew && !this.matricule) {
            // Wait for role to be populated if needed
            await this.populate('idRole');
            
            if (!this.idRole) {
                throw new Error('Role is required to generate matricule');
            }
            
            const roleLibelle = this.idRole.libelle || 'USR';
            const count = await this.constructor.countDocuments();
            const prefix = roleLibelle.substring(0, 3).toUpperCase();
            this.matricule = `${prefix}${(count + 1).toString().padStart(4, '0')}`;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
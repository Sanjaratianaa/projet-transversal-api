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
    dateEmbauche: { 
        type: Date 
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

async function getNextSequenceValue(role) {
    const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
        { _id: `matricule_${role}` },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
    );

    console.log('Counter result:', counter);

    return counter?.seq ?? 1;
}

UtilisateurSchema.pre('save', async function (next) {
    const Role = mongoose.model('Role');
    try {
        const role = await Role.findById(this.idRole);
        const lowercaseLibelle = role.libelle.toLowerCase(); 

        if (lowercaseLibelle === 'mecanicien' || lowercaseLibelle === 'mécanicien' || lowercaseLibelle === 'manager' || lowercaseLibelle === 'client') {
            if (!this.matricule) {
                let prefix;
                if (lowercaseLibelle === 'mecanicien' || lowercaseLibelle === 'mécanicien') {
                    prefix = 'MEC';
                } else if (lowercaseLibelle === 'client') {
                    prefix = 'CLI'
                } else {
                    prefix = 'MNG';
                }

                const sequence = await getNextSequenceValue(role.libelle);
                this.matricule = `${prefix}${String(sequence).padStart(3, '0')}`;
            }
        }
        next();
    } catch (error) {
        console.error('Error generating matricule:', error);
        return next(error);
    }
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
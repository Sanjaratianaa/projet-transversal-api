const mongoose = require('mongoose');

const VoitureSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Utilisateur', 
    required: true 
  },
  marque: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Marque', 
    required: true 
  },
  modele: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Modele', 
    required: true 
  },
  categorie: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categorie', 
    required: true 
  },
  typeTransmission: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TypeTransmission', 
    required: true 
  },
  annee: { 
    type: Number, 
    required: true 
  },
  numeroImmatriculation: { 
    type: String, 
    required: true, 
    unique: true 
  },
  kilometrage: { 
    type: Number, 
    required: true 
  },
  puissanceMoteur: { 
    type: Number, 
    required: true 
  },
  cylindree: { 
    type: Number, 
    required: true 
  },
  capaciteReservoir: { 
    type: Number, 
    required: true 
  },
  pressionPneusRecommande: { 
    type: String, 
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
  etat: { 
    type: String, 
    default: 'Active',
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Voiture', VoitureSchema);
const mongoose = require('mongoose');

// Définir un schéma pour la vue 'stocks'
const stockSchema = new mongoose.Schema(
  {
    piece: { type: mongoose.Schema.Types.ObjectId, ref: 'Piece' },
    marquePiece: { type: String },
    marqueVoiture: { type: mongoose.Schema.Types.ObjectId, ref: 'Marque' },
    modeleVoiture: { type: mongoose.Schema.Types.ObjectId, ref: 'Modele' },
    typeTransmission: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeTransmission' },
    entree: { type: Number },
    sortie: { type: Number },
    reste: { type: Number },
  },
  { collection: 'stocks' } // La vue 'stocks' est définie dans la base de données
);

// Créer un modèle pour la vue 'stocks'
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;

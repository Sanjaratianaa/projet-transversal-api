const { query } = require('express');
const Voiture = require('../models/Voiture');

// Create a new Voiture
exports.createVoiture = async (req, res) => {
    try {
        const voitureData = {
            ...req.body,
            client: req.user.id,
        };

        if(req.body.kilometrage < 0)
            throw new Error("Kilometrage indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.puissanceMoteur < 0)
            throw new Error("Puissance Moteur indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.cylindree < 0)
            throw new Error("Cylindrée indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.capaciteReservoir < 0)
            throw new Error("Capacite de réservoir indalide. La valeur doit etre supérieur ou égale à zéro.")

        const voitureSave = new Voiture(voitureData);
        await voitureSave.save();

        const voiture = await Voiture.findById(voitureSave._id)
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');   
        
        console.log(voiture);

        res.status(201).json(voiture);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le numero matricule "${req.body.numeroImmatriculation}" existe déjà. Veuillez vérifier.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all Voitures
exports.getAllVoitures = async (req, res) => {
    try {
        const voitures = await Voiture.find()
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');
        res.json(voitures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllVoituresByClient = async (req, res) => {
    try {
        var query = {};
        if(req.user.role.libelle == "client")
            query = {client : req.user.id};
        else 
            query = {etat: "Active"};
        const voitures = await Voiture.find(query)
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');
        res.json(voitures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Voiture by ID
exports.getVoitureById = async (req, res) => {
    try {
        const voiture = await Voiture.findById(req.params.id)
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');
        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }
        res.json(voiture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Voiture
exports.updateVoiture = async (req, res) => {
    try {
        if(req.body.kilometrage < 0)
            throw new Error("Kilometrage indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.puissanceMoteur < 0)
            throw new Error("Puissance Moteur indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.cylindree < 0)
            throw new Error("Cylindrée indalide. La valeur doit etre supérieur ou égale à zéro.")

        if(req.body.capaciteReservoir < 0)
            throw new Error("Capacite de réservoir indalide. La valeur doit etre supérieur ou égale à zéro.")
        
        const voiture = await Voiture.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');

        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }

        res.json(voiture);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le numero matricule "${req.body.numeroImmatriculation}" existe déjà. Veuillez vérifier.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a Voiture
exports.deleteVoiture = async (req, res) => {
    try {
        const voiture = await Voiture.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Modeler comme supprimé
                dateSuppression: new Date()  // Enregistrer la date
            },
            { new: true }
        )
            .populate({
                path: 'client',  // Peupler le client
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');

        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }
        res.json(voiture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
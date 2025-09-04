const Marque = require('../../models/caracteristiques/Marque');

// Create a new marque
exports.createMarque = async (req, res) => {
    try {
        const marqueData = {
            ...req.body,
            manager: req.user.id, 
        };
        const marqueSave = new Marque(marqueData);
        await marqueSave.save();
        const marque = await Marque.findById(marqueSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(marque);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le marque "${req.body.libelle}" existe déjà. Veuillez choisir un autre marque.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all marques
exports.getAllMarques = async (req, res) => {
    try {
        const marques = await Marque.find()
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(marques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all marques actives
exports.getAllMarquesActives = async (req, res) => {
    try {
        const marques = await Marque.find({etat: "Active"})
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(marques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a marque by ID
exports.getMarqueById = async (req, res) => {
    try {
        const marque = await Marque.findById(req.params.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }
        res.json(marque);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a marque
exports.updateMarque = async (req, res) => {
    try {
        const marque = await Marque.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }

        res.json(marque);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le marque "${req.body.libelle}" existe déjà. Veuillez choisir un autre marque.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

exports.deleteMarque = async (req, res) => {
    try {
        const marque = await Marque.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Marquer comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id // Qui a supprimé ?
            },
            { new: true }
        )
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }

        res.json(marque);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

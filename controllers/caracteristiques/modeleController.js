const Modele = require('../../models/caracteristiques/Modele');

// Create a new modele
exports.createModele = async (req, res) => {
    try {
        const modeleData = {
            ...req.body,
            manager: req.user.id,
        };
        const modeleSave = new Modele(modeleData);
        await modeleSave.save();
        const modele = await Modele.findById(modeleSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(modele);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le modele "${req.body.libelle}" existe déjà. Veuillez choisir un autre marque.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all modeles
exports.getAllModeles = async (req, res) => {
    try {
        const modeles = await Modele.find()
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
        res.json(modeles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all modeles actives
exports.getAllModelesActives = async (req, res) => {
    try {
        const modeles = await Modele.find({etat: "Active"})
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(modeles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a modele by ID
exports.getModeleById = async (req, res) => {
    try {
        const modele = await Modele.findById(req.params.id)
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
        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }
        res.json(modele);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a modele
exports.updateModele = async (req, res) => {
    try {
        const modele = await Modele.findByIdAndUpdate(
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

        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }

        res.json(modele);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le modele "${req.body.libelle}" existe déjà. Veuillez choisir un autre marque.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a modele
exports.deleteModele = async (req, res) => {
    try {
        const modele = await Modele.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Modeler comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id,  // Qui a supprimé ?
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

        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }

        res.json(modele);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

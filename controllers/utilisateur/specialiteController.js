const Specialite = require('../../models/utilisateur/Specialite');

// Create a new Specialite
exports.createSpecialite = async (req, res) => {
    try {
        const specialiteData = {
            ...req.body,
            manager: req.user.id,
        };

        const specialiteExist = await Specialite.findOne({ mecanicien: specialiteData.mecanicien, sousService: specialiteData.sousService, etat: 'Active' });
        if(specialiteExist)
            throw new Error("Ajout invalide : Ce mécanicien possède déjà cette spécialité.");

        const specialiteSave = new Specialite(specialiteData);
        await specialiteSave.save();
        const specialite = await Specialite.findById(specialiteSave.id)
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        res.status(201).json(specialite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllSpecialites = async (req, res) => {
    try {
        // Récupérer tous les sous-services
        const specialites = await Specialite.find()
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            });

        res.json(specialites);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// Get all Specialites Actives
exports.getAllSpecialitesActives = async (req, res) => {
    try {
        const specialites = await Specialite.find({ etat: "Active" })
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(specialites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Specialite by ID
exports.getSpecialiteById = async (req, res) => {
    try {
        const specialite = await Specialite.findById(req.params.id)
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            });
        if (!specialite) {
            return res.status(404).json({ message: 'Specialite not found' });
        }
        res.json(specialite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Specialite
exports.updateSpecialite = async (req, res) => {
    try {
        const today = new Date(); // Date du jour

        const specialiteExist = await Specialite.findOne({ _id: { $ne: req.body._id }, mecanicien: req.body.mecanicien, sousService: req.body.sousService, etat: 'Active' });
        console.log(specialiteExist);
        if(specialiteExist)
            throw new Error("Ajout invalide : Ce mécanicien possède déjà cette spécialité.");

        const specialite = await Specialite.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            });

        if (!specialite) {
            return res.status(404).json({ message: 'Specialite not found' });
        }

        res.json(specialite);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a Specialite
exports.deleteSpecialite = async (req, res) => {
    try {
        const service = await Specialite.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Servicer comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id  // Qui a supprimé ?
            },
            { new: true }
        )
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get all Specialites Actives by sousService
exports.getAllSpecialitesActivesBySousService = async (req, res) => {
    try {

        const specialites = await Specialite.find({ etat: "Active", sousService: req.params.idSousService })
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler la personne
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'mecanicien',  // Peupler le mecanicien
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(specialites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

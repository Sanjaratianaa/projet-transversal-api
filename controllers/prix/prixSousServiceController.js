const PrixSousService = require('../../models/prix/PrixSousService');

// Create a new PrixSousService
exports.createPrixSousService = async (req, res) => {
    try {
        const prixSousServiceData = {
            ...req.body,
            manager: req.user.id,
        };

        if (prixSousServiceData.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck = new Date(prixSousServiceData.date); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today) 
            throw new Error(`Date applicatif invalide. La date doit être supérieure ou égale à la date du jour.`);

        const prixSousServiceSave = new PrixSousService(prixSousServiceData);
        await prixSousServiceSave.save();
        const prixSousService = await PrixSousService.findById(prixSousServiceSave.id)
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler le service
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(prixSousService);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get all PrixSousServices
exports.getAllPrixSousServices = async (req, res) => {
    try {
        const prixSousServices = await PrixSousService.find()
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler le service
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.json(prixSousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a PrixSousService by ID
exports.getPrixSousServiceById = async (req, res) => {
    try {
        const prixSousService = await PrixSousService.findById(req.params.id)
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler le service
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }
        res.json(prixSousService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PrixSousService
exports.updatePrixSousService = async (req, res) => {
    try {
        if (req.body.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck = new Date(req.body.date); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today) 
            throw new Error(`Date applicatif invalide. La date doit être supérieure ou égale à la date du jour.`);
        const prixSousService = await PrixSousService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'sousService',  // Peupler le sousService
                populate: {
                    path: 'service',  // Peupler le service
                    model: 'Service'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })

        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }

        res.json(prixSousService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a PrixSousService
exports.deletePrixSousService = async (req, res) => {
    try {
        const prixSousService = await PrixSousService.findByIdAndDelete(req.params.id);
        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }
        res.json({ message: 'PrixSousService deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
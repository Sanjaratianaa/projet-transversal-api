const SousService = require('../../models/services/SousService');
const PrixSousService = require('../../models/prix/PrixSousService');
const PromotionController = require('../promotionController');

// Create a new SousService
exports.createSousService = async (req, res) => {
    try {
        const sousServiceData = {
            ...req.body,
            manager: req.user.id,
        };

        if (req.body.duree < 0)
            throw new Error("Durée invalide. La durée doit etre supérieur à 0mn");

        const sousServiceSave = new SousService(sousServiceData);
        await sousServiceSave.save();
        const sousService = await SousService.findById(sousServiceSave.id)
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .lean();
        sousService.prixUnitaire = 0;
        sousService.remise = 0;

        res.status(201).json(sousService);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le sous service "${req.body.libelle}" existe déjà. Veuillez choisir un autre sous service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

exports.getAllSousServices = async (req, res) => {
    try {
        const today = new Date(); // Date du jour

        // Récupérer tous les sous-services
        const sousServices = await SousService.find()
            .populate('service')
            .populate({
                path: 'manager',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            })
            .lean(); // Convertit en objets JS purs pour modification

        // Récupérer le prix le plus récent pour chaque sous-service
        for (let sousService of sousServices) {
            const prix = await PrixSousService.findOne({
                sousService: sousService._id,
                date: { $lte: today } // Date d'application inférieure ou égale à aujourd'hui
            })
                .sort({ date: -1, dateEnregistrement: -1 }) // Trier par date DESC puis dateEnregistrement DESC
                .limit(1)
                .lean();

            const remise = await PromotionController.getPromotionDuJour(sousService._id);
            sousService.prixUnitaire = prix ? prix.prixUnitaire : 0; // Ajouter le prix s'il existe
            sousService.remise = remise; 
        }

        res.json(sousServices);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// Get all SousServices Actives
exports.getAllSousServicesActives = async (req, res) => {
    try {
        const today = new Date(); // Date du jour
        const sousServices = await SousService.find({ etat: "Active" })
            .populate('service')
            .populate({
                path: 'manager',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            })
            .populate({
                path: 'managerSuppression',
                populate: {
                    path: 'personne',
                    model: 'Personne'
                }
            })
            .lean(); // Convertit en objets JS purs pour modification

        // Récupérer le prix le plus récent pour chaque sous-service
        for (let sousService of sousServices) {
            const prix = await PrixSousService.findOne({
                sousService: sousService._id,
                date: { $lte: today } // Date d'application inférieure ou égale à aujourd'hui
            })
                .sort({ date: -1, dateEnregistrement: -1 }) // Trier par date DESC puis dateEnregistrement DESC
                .limit(1)
                .lean();

            const remise = await PromotionController.getPromotionDuJour(sousService._id);

            sousService.prixUnitaire = prix ? prix.prixUnitaire : 0; // Ajouter le prix s'il existe
            sousService.remise = remise;
        }

        res.json(sousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a SousService by ID
exports.getSousServiceById = async (req, res) => {
    try {
        const sousService = await SousService.findById(req.params.id)
            .populate('service')
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
        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }
        res.json(sousService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a SousService
exports.updateSousService = async (req, res) => {
    try {
        const today = new Date(); // Date du jour

        const sousService = await SousService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('service')
            .populate('manager')
            .populate('managerSuppression')
            .lean();

        const prix = await PrixSousService.findOne({
            sousService: sousService._id,
            date: { $lte: today } // Date d'application inférieure ou égale à aujourd'hui
        })
            .sort({ date: -1, dateEnregistrement: -1 }) // Trier par date DESC puis dateEnregistrement DESC
            .lean();

        const remise = await PromotionController.getPromotionDuJour(sousService._id);

        sousService.prixUnitaire = prix ? prix.prixUnitaire : 0; // Ajouter le prix s'il existe
        sousService.remise = remise;

        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }

        res.json(sousService);
    } catch (error) {
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le sous service "${req.body.libelle}" existe déjà. Veuillez choisir un autre sous service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a SousService
exports.deleteSousService = async (req, res) => {
    try {
        const service = await SousService.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Servicer comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id  // Qui a supprimé ?
            },
            { new: true }
        )
            .populate('service')
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

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const Promotion = require('../models/Promotion');

// Create a new Promotion
createPromotion = async (req, res) => {
    try {
        const promotionData = {
            ...req.body,
            manager: req.user.id,
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateDebut = new Date(promotionData.dateDebut); // Conversion en Date
        const dateFin = new Date(promotionData.dateFin); // Conversion en Date

        console.log(dateDebut + " < ? " + today);

        if (dateDebut < today)
            throw new Error(`Date debut applicatif invalide. La date debut doit être supérieure ou égale à la date du jour.`);

        if (dateFin < today)
            throw new Error(`Date fin applicatif invalide. La date fin doit être supérieure ou égale à la date du jour.`);

        if (dateFin < dateDebut)
            throw new Error(`Date debut applicatif invalide. La date debut doit être inférieur ou égale à la date fin.`);

        const promotionSave = new Promotion(promotionData);
        await promotionSave.save();
        const promotion = await Promotion.findById(promotionSave.id)
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
            });
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Promotions
getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find()
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
            });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Promotion by ID
getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
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
            });
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Promotion
updatePromotion = async (req, res) => {
    try {
        const promotionData = {
            ...req.body,
        };

        const _promotion = await Promotion.findById(req.params.id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateDebut = new Date(promotionData.dateDebut); // Conversion en Date
        const dateFin = new Date(promotionData.dateFin); // Conversion en Date

        console.log(dateDebut + " < ? " + today);

        if (_promotion.dateDebut.getTime() != dateDebut.getTime() && dateDebut < today)
            throw new Error(`Date debut applicatif invalide. La date debut doit être supérieure ou égale à la date du jour.`);

        if (dateFin < today)
            throw new Error(`Date fin applicatif invalide. La date fin doit être supérieure ou égale à la date du jour.`);

        if (dateFin < dateDebut)
            throw new Error(`Date debut applicatif invalide. La date debut doit être inférieur ou égale à la date fin.`);


        const promotion = await Promotion.findByIdAndUpdate(
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
            });

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Promotion
deletePromotion = async (req, res) => {
    try {

        const promotion = await Promotion.findByIdAndUpdate(
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
            });

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function getTodayUTC() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

const getPromotionDuJour = async (idSousService, date = null) => {
    try {
        const today = date ? new Date(date) : getTodayUTC();
        
        const query = {
            sousService: idSousService,
            etat: "Active",
            dateDebut: { $lte: today },
            dateFin: { $gte: today }
        }

        const promotion = await Promotion.findOne(query)
        .sort({ dateEnregistrement: -1 });

        return promotion ? promotion.remise : 0;
    } catch (error) {
        console.error("Erreur dans getPromotionDuJour:", error);
        return 0;
    }
};

module.exports = {
    createPromotion,
    getAllPromotions, 
    getPromotionById, 
    updatePromotion,
    deletePromotion,
    getPromotionDuJour
};

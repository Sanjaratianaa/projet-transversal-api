const TypeTransmission = require('../../models/caracteristiques/TypeTransmission');


// Create a new typeTransmission
exports.createTypeTransmission = async (req, res) => {
    try {
        const typeTransmissionData = {
            ...req.body,
            manager: req.user.id,
        };
        const typeTransmissionSave = new TypeTransmission(typeTransmissionData);
        await typeTransmissionSave.save();
        const typeTransmission = await TypeTransmission.findById(typeTransmissionSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(typeTransmission);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le type de transmission "${req.body.libelle}" existe déjà. Veuillez choisir un autre typeTransmission.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all typeTransmissions
exports.getAllTypeTransmissions = async (req, res) => {
    try {
        const typeTransmissions = await TypeTransmission.find()
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
        res.json(typeTransmissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTypeTransmissionsActives = async (req, res) => {
    try {
        const typeTransmissions = await TypeTransmission.find({etat: "Active"})
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(typeTransmissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a typeTransmission by ID
exports.getTypeTransmissionById = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findById(req.params.id)
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
        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }
        res.json(typeTransmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a typeTransmission
exports.updateTypeTransmission = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findByIdAndUpdate(
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

        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }

        res.json(typeTransmission);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le type de transmission "${req.body.libelle}" existe déjà. Veuillez choisir un autre typeTransmission.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

exports.deleteTypeTransmission = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // TypeTransmissionr comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: req.user.id  // Qui a supprimé ?
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

        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }

        res.json(typeTransmission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

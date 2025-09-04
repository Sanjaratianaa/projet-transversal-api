const Service = require('../../models/services/Service');

// Create a new service
exports.createService = async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            manager: req.user.id,
        };
        const serviceSave = new Service(serviceData);
        await serviceSave.save();
        const service = await Service.findById(serviceSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le service "${req.body.libelle}" existe déjà. Veuillez choisir un autre service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
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
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
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
        res.status(500).json({ message: error.message });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
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

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le service "${req.body.libelle}" existe déjà. Veuillez choisir un autre service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Servicer comme supprimé
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

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// liste des services actives:
exports.getAllServicesActives = async (req, res) => {
    try {
        const services = await Service.find({ etat: "Active" }) // Filtrer les services actifs
            .populate({
                path: 'manager',  
                populate: {
                    path: 'personne',  
                    model: 'Personne'  
                }
            });

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


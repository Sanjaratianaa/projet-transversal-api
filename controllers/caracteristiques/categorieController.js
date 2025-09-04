const Categorie = require('../../models/caracteristiques/Categorie');

// Create a new category
exports.createCategorie = async (req, res) => {
    try {
        const categorieData = {
            ...req.body,
            manager: req.user.id,
        };
        const categorieSave = new Categorie(categorieData);
        await categorieSave.save();
        const categorie = await Categorie.findById(categorieSave.id)
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(categorie);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le categorie "${req.body.libelle}" existe déjà. Veuillez choisir un autre categorie.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.find()
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
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a category by ID
exports.getCategorieById = async (req, res) => {
    try {
        const categorie = await Categorie.findById(req.params.id)
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
        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category
exports.updateCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(
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

        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }

        res.json(categorie);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le categorie "${req.body.libelle}" existe déjà. Veuillez choisir un autre categorie.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a category
exports.deleteCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Categorier comme supprimé
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

        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }

        res.json(categorie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategoriesActives = async (req, res) => {
    try {
        const categories = await Categorie.find({etat: "Active"})
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

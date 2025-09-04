const Personne = require('../../models/utilisateur/Personne');

// Create a new person
exports.createPersonne = async (req, res) => {
    try {
        const personne = new Personne(req.body);
        await personne.save();
        res.status(201).json(personne);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all people
exports.getAllPersonnes = async (req, res) => {
    try {
        const personnes = await Personne.find();
        res.json(personnes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a person by ID
exports.getPersonneById = async (req, res) => {
    try {
        const personne = await Personne.findById(req.params.id);
        if (!personne) {
            return res.status(404).json({ message: 'Personne not found' });
        }
        res.json(personne);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a person
exports.updatePersonne = async (req, res) => {
    try {
        const personne = await Personne.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!personne) {
            return res.status(404).json({ message: 'Personne not found' });
        }
        res.json(personne);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a person
exports.deletePersonne = async (req, res) => {
    try {
        const personne = await Personne.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Marquer comme supprimé
                dateSuppression: new Date()
            }, 
            { new: true }
        );
        if (!personne) {
            return res.status(404).json({ message: 'Personne not found' });
        }
        res.json({ message: 'Personne deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePersonne = async (req, res) => {
    try {
        const personne = await Personne.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',
                dateSuppression: new Date()
            },
            { new: true }
        );

        if (!personne) {
            return res.status(404).json({ message: 'Personne not found' });
        }

        await Utilisateur.updateMany(
            { personne: personne._id },
            {
                etat: 'Inactive',
                dateSuppression: new Date()
            }
        );

        res.json(personne);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
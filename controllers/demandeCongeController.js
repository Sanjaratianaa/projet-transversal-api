const DemandeConges = require('../models/DemandeConges');

// Create a new DemandeConges
exports.createDemandeConges = async (req, res) => {
    try {
        const demandeConges = new DemandeConges(req.body);
        await demandeConges.save();
        res.status(201).json(demandeConges);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all DemandeConges
exports.getAllDemandeConges = async (req, res) => {
    try {
        const demandeCongesList = await DemandeConges.find()
            .populate('mecanicien')
            .populate('manager');
        res.json(demandeCongesList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a DemandeConges by ID
exports.getDemandeCongesById = async (req, res) => {
    try {
        const demandeConges = await DemandeConges.findById(req.params.id)
            .populate('mecanicien')
            .populate('manager');
        if (!demandeConges) {
            return res.status(404).json({ message: 'DemandeConges not found' });
        }
        res.json(demandeConges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a DemandeConges
exports.updateDemandeConges = async (req, res) => {
    try {
        const demandeConges = await DemandeConges.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('mecanicien')
        .populate('manager');

        if (!demandeConges) {
            return res.status(404).json({ message: 'DemandeConges not found' });
        }

        res.json(demandeConges);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a DemandeConges
exports.deleteDemandeConges = async (req, res) => {
    try {
        const demandeConges = await DemandeConges.findByIdAndDelete(req.params.id);
        if (!demandeConges) {
            return res.status(404).json({ message: 'DemandeConges not found' });
        }
        res.json({ message: 'DemandeConges deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
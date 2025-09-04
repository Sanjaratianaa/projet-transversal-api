const Manuel = require('../models/Manuel');

// Create a new Manuel
exports.createManuel = async (req, res) => {
    try {
        const manuel = new Manuel(req.body);
        await manuel.save();
        res.status(201).json(manuel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Manuels
exports.getAllManuels = async (req, res) => {
    try {
        const manuels = await Manuel.find()
            .populate('sousSpecialite')
            .populate('manager');
        res.json(manuels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Manuel by ID
exports.getManuelById = async (req, res) => {
    try {
        const manuel = await Manuel.findById(req.params.id)
            .populate('sousSpecialite')
            .populate('manager');
        if (!manuel) {
            return res.status(404).json({ message: 'Manuel not found' });
        }
        res.json(manuel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Manuel
exports.updateManuel = async (req, res) => {
    try {
        const manuel = await Manuel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('sousSpecialite')
        .populate('manager');

        if (!manuel) {
            return res.status(404).json({ message: 'Manuel not found' });
        }

        res.json(manuel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Manuel
exports.deleteManuel = async (req, res) => {
    try {
        const manuel = await Manuel.findByIdAndDelete(req.params.id);
        if (!manuel) {
            return res.status(404).json({ message: 'Manuel not found' });
        }
        res.json({ message: 'Manuel deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
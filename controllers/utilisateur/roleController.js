const Role = require('../../models/utilisateur/Role');

const RoleController = {
    createRole: async (req, res) => {
        try {
            const { libelle, Etat, ...rest } = req.body;

            const existingRole = await Role.findOne({
                libelle: { $regex: new RegExp(libelle, 'i') }
            });

            if (existingRole) {
                return res.status(400).json({ message: 'Role already exists' });
            }

            const role = new Role({
                libelle,
                Etat: Etat || 'Actif',
                ...rest
            });
            
            await role.save();
            res.status(201).json(role);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllRoles: async (req, res) => {
        try {
            const roles = await Role.find();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRoleById: async (req, res) => {
        try {
            const role = await Role.findById(req.params.id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            res.json(role);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRoleBy: async (req, res) => {
        try {
            const { libelle } = req.body;

            const role = await Role.findOne({ 
                libelle: { $regex: new RegExp(libelle, 'i') } 
            });

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRoleByLibelleDirect: async (libelle) => {
        try {
            const role = await Role.findOne({ 
                libelle: { $regex: new RegExp(libelle, 'i') } 
            });
            
            if (!role) {
                throw new Error('Role not found');
            }
            
            return role;
        } catch (error) {
            throw error;
        }
    },

    updateRole: async (req, res) => {
        try {
            const role = await Role.findByIdAndUpdate(
                req.params.id,
                req.body, 
                { new: true, runValidators: true }
            );
            
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            res.json(role);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteRole: async (req, res) => {
        try {
            const role = await Role.findByIdAndUpdate(
                req.params.id,
                { Etat: 'Inactive' },
                { new: true }
            );

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.json(role);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = RoleController;
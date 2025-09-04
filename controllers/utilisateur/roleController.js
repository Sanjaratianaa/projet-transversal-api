const Role = require('../../models/utilisateur/Role');

exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRoleBy = async (req, res) => {
    try {
      const libelle = req.body.libelle;

      const role = await Role.findOne({ libelle: { $regex: new RegExp(libelle, 'i') } });
  
      if (!role) {
        res.status(404).json({ message: 'Role not found' });
        return;
      }
  
      res.status(200).json(role);
    } catch (error) {
      console.error("Error in getRoleBy:", error);
      res.status(500).json({ message: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive'
            },
            { new: true }
        );

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
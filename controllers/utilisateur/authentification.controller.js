const AuthenticationService = require('../../services/authentification.service');

const AuthenticationController = {
    login: async (req, res) => {
        const {email, password} = req.body;

        const result = await AuthenticationService.authenticateUser(email, password);

        if (result.success) {
            res.json({token: result.token, user: result.user});
        } else {
            res.status(401).json({message: result.message});
        }
    },

    register: async (req, res) => {
        const result = await AuthenticationService.register(req, res);

        if (result.success) {
            res.status(201).json({message: result.message, data: result.data});
        } else {
            res.status(500).json({message: result.message, data: result.data});
        }
    },

    verifyToken: (req, res) => {
        const token = req.body.token;

        const result = AuthenticationService.verifyToken(token);

        if (result.success) {
            res.status(201).json({success: true, user: result.user});
        } else {
            res.status(500).json({success: false, message: result.message});
        }
    },

    changePassword: async (req, res) => {

        const email = req.body.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        const result = await AuthenticationService.changePassword(email, oldPassword, newPassword, confirmPassword);

        if (result.success) {
            res.status(201).json({message: result.message, data: result.data});
        } else {
            res.status(500).json({message: result.message, data: result.data});
        }
    }
};

module.exports = AuthenticationController;
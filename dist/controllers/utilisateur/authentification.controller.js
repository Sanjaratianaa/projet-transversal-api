"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const authentification_service_1 = require("../../services/authentification.service");
exports.AuthenticationController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        const result = await authentification_service_1.AuthenticationService.authenticateUser(email, password);
        if (result.success) {
            res.json({ token: result.token, user: result.user });
        }
        else {
            res.status(401).json({ message: result.message });
        }
    },
    register: async (req, res) => {
        console.log(req.body);
        const result = await authentification_service_1.AuthenticationService.register(req.body);
        if (result.success) {
            res.status(201).json({ message: result.message, data: result.data });
        }
        else {
            res.status(500).json({ message: result.message, data: result.data });
        }
    },
    verifyToken: (req, res) => {
        const token = req.body.token;
        const result = authentification_service_1.AuthenticationService.verifyToken(token);
        if (result.success) {
            res.status(201).json({ success: true, user: result.user });
        }
        else {
            res.status(500).json({ success: false, message: result.message });
        }
    },
    changePassword: async (req, res) => {
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const result = await authentification_service_1.AuthenticationService.changePassword(email, oldPassword, newPassword, confirmPassword);
        if (result.success) {
            res.status(201).json({ message: result.message, data: result.data });
        }
        else {
            res.status(500).json({ message: result.message, data: result.data });
        }
    }
};

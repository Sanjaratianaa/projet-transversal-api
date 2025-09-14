"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const secretKey = 'M1-transversal-project';
exports.AuthenticationService = {
    authenticateUser: async (email, password) => {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { email },
                include: { roles: { include: { role: true } } }
            });
            if (!user || user.statut !== 'Active') {
                return {
                    success: false,
                    message: 'Email incorrect',
                    errorCode: 'INVALID_CREDENTIALS'
                };
            }
            const passwordMatch = await bcrypt_1.default.compare(password, user.motDePasse);
            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Mot de passe incorrect',
                    errorCode: 'INVALID_CREDENTIALS'
                };
            }
            const payload = {
                id: user.id,
                username: (user.nom || '') + ' ' + (user.prenoms || ''),
                email: user.email,
                dateCreation: user.dateCreation,
                roles: user.roles.map((r) => r.role.libelle),
            };
            const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1h' });
            return {
                success: true,
                message: 'Connexion réussie',
                token,
                user: payload
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Erreur serveur',
                errorCode: 'SERVER_ERROR'
            };
        }
    },
    verifyToken: (token) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            return {
                success: true,
                message: 'Token valide',
                user: decoded
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Token invalide ou expiré',
                errorCode: 'INVALID_TOKEN'
            };
        }
    },
    hashPassword: async (password) => {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
            return {
                success: true,
                hashedPassword
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Erreur lors du hachage du mot de passe',
                errorCode: 'HASH_ERROR'
            };
        }
    },
    register: async (data) => {
        try {
            const { nom, prenoms, email, motDePasse, statut, roleLibelle } = data;
            const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
            if (existingUser) {
                return {
                    success: false,
                    message: `Un compte avec l'email ${email} existe déjà`,
                    errorCode: 'DUPLICATE_EMAIL'
                };
            }
            // Récupérer ou créer le rôle
            let role = await prisma.role.findFirst({ where: { libelle: roleLibelle } });
            if (!role) {
                role = await prisma.role.create({ data: { libelle: roleLibelle, etat: 'Actif' } });
            }
            // Hacher le mot de passe
            const hashedPassword = await bcrypt_1.default.hash(motDePasse, 10);
            // Créer l'utilisateur
            const user = await prisma.utilisateur.create({
                data: {
                    nom,
                    prenoms,
                    email,
                    motDePasse: hashedPassword,
                    statut: statut || 'Active',
                    dateCreation: new Date(),
                    roles: {
                        create: [{ roleId: role.id }]
                    }
                },
                include: { roles: { include: { role: true } } }
            });
            return {
                success: true,
                message: 'Utilisateur créé avec succès',
                data: user
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Erreur lors de la création',
                errorCode: 'SERVER_ERROR'
            };
        }
    },
    changePassword: async (email, oldPassword, newPassword, confirmPassword) => {
        try {
            if (!email || !oldPassword || !newPassword || !confirmPassword) {
                return {
                    success: false,
                    message: 'Tous les champs sont obligatoires',
                    errorCode: 'VALIDATION_ERROR'
                };
            }
            if (newPassword !== confirmPassword) {
                return {
                    success: false,
                    message: 'Le nouveau mot de passe et la confirmation ne correspondent pas',
                    errorCode: 'PASSWORD_MISMATCH'
                };
            }
            if (newPassword.length < 6) {
                return {
                    success: false,
                    message: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
                    errorCode: 'PASSWORD_TOO_SHORT'
                };
            }
            const user = await prisma.utilisateur.findUnique({ where: { email } });
            if (!user) {
                return {
                    success: false,
                    message: 'Utilisateur introuvable',
                    errorCode: 'USER_NOT_FOUND'
                };
            }
            const passwordMatch = await bcrypt_1.default.compare(oldPassword, user.motDePasse);
            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Ancien mot de passe incorrect',
                    errorCode: 'INVALID_OLD_PASSWORD'
                };
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await prisma.utilisateur.update({
                where: { email },
                data: { motDePasse: hashedPassword }
            });
            return {
                success: true,
                message: 'Mot de passe modifié avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Erreur lors du changement de mot de passe',
                errorCode: 'SERVER_ERROR'
            };
        }
    }
};

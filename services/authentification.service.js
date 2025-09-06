const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Utilisateur = require('../models/utilisateur/Utilisateur');
const Personne = require('../models/utilisateur/Personne');
const Role = require('../models/utilisateur/Role');

const secretKey = 'M1-project-MEAN';

const AuthenticationService = {
    authenticateUser: async (email, password) => {
        try {
            const personne = await Personne.findOne({ email: email, etat: 'Active' });

            if (!personne) {
                return { 
                    success: false, 
                    message: 'Email ou mot de passe incorrect',
                    errorCode: 'INVALID_CREDENTIALS' 
                };
            }

            const user = await Utilisateur.findOne({ personne: personne._id })
                .populate('personne')
                .populate('idRole');

            if (!user) {
                return { 
                    success: false, 
                    message: 'Email ou mot de passe incorrect',
                    errorCode: 'INVALID_CREDENTIALS' 
                };
            }

            const passwordMatch = await bcrypt.compare(password, user.motDePasse);

            if (!passwordMatch) {
                return { 
                    success: false, 
                    message: 'Email ou mot de passe incorrect',
                    errorCode: 'INVALID_CREDENTIALS' 
                };
            }

            const payload = {
                id: user._id,                 
                username: `${user.personne.nom} ${user.personne.prenom}`,
                email: user.personne.email, 
                matricule: user.matricule || null, 
                role: user.idRole,
                idPersonne: user.personne._id
            };

            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            return { 
                success: true, 
                message: 'Connexion réussie',
                token: token,
                user: payload
            };
        } catch (error) {
            console.error('Authentication error:', error);
            const formattedError = formatErrorMessage(error);
            return { 
                success: false, 
                message: formattedError.message,
                errorCode: formattedError.code
            };
        }
    },

    verifyToken: (token) => {
        try {
            const decoded = jwt.verify(token, secretKey);
            return { 
                success: true, 
                message: 'Token valide',
                user: decoded 
            };
        } catch (error) {
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
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return { 
                success: true, 
                hashedPassword: hashedPassword 
            };
        } catch (error) {
            return { 
                success: false, 
                message: 'Erreur lors du hachage du mot de passe',
                errorCode: 'HASH_ERROR' 
            };
        }
    },

    register: async (req, res) => {
        const session = await mongoose.startSession();
        
        try {
            session.startTransaction();
            
            // 1. Extract and validate input data
            const {
                nom, prenom, dateDeNaissance, lieuDeNaissance, genre,
                etat, numeroTelephone, email, motDePasse, idRole
            } = req.body;

            // 2. Validate required fields
            const validationError = validateRegistrationData({
                nom, prenom, email, motDePasse, idRole
            });
            if (validationError) {
                throw new Error(validationError);
            }

            // 3. Check if email already exists
            const existingPersonne = await Personne.findOne({ email }).session(session);
            if (existingPersonne) {
                throw new Error(`DUPLICATE_EMAIL: Un compte avec l'email ${email} existe déjà`);
            }

            // 4. Get or create Role by libelle
            const role = await getRoleByLibelle(idRole, session);

            // 5. Create Personne record within transaction
            const personne = new Personne({
                nom: nom.trim(),
                prenom: prenom.trim(), 
                dateDeNaissance, 
                lieuDeNaissance,
                genre, 
                etat: etat || 'Active', 
                numeroTelephone, 
                email: email.toLowerCase().trim()
            });
            const createdPersonne = await personne.save({ session });

            // 6. Generate matricule with role prefix
            const rolePrefix = role.libelle.substring(0, 3).toUpperCase();
            const count = await Utilisateur.countDocuments().session(session);
            const matricule = `${rolePrefix}${(count + 1).toString().padStart(4, '0')}`;

            // 7. Create Utilisateur record within transaction
            const utilisateur = new Utilisateur({
                personne: createdPersonne._id,
                idRole: role._id,
                etat: etat || 'Active',
                matricule: matricule
            });

            // 8. Hash and set password
            const finalPassword = motDePasse || matricule;
            utilisateur.motDePasse = await bcrypt.hash(finalPassword, 10);
            
            const createdUtilisateur = await utilisateur.save({ session });

            // 9. Commit transaction
            await session.commitTransaction();

            // 10. Return populated user data (outside transaction)
            const populatedUser = await Utilisateur.findById(createdUtilisateur._id)
                .populate({ path: 'personne', model: 'Personne' })
                .populate('idRole');

            return { 
                success: true, 
                message: "Utilisateur créé avec succès", 
                data: populatedUser,
                matricule: matricule
            };

        } catch (error) {
            // Rollback transaction on any error
            await session.abortTransaction();
            console.error('Error registering user:', error);
            
            const userFriendlyError = formatErrorMessage(error);
            
            return { 
                success: false, 
                message: userFriendlyError.message,
                errorCode: userFriendlyError.code,
                details: userFriendlyError.details
            };
        } finally {
            session.endSession();
        }
    },

    changePassword: async (email, oldPassword, newPassword, confirmPassword) => {
        try {
            // Implementation remains the same...
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

            const personne = await Personne.findOne({ email: email, etat: 'Active' });
            if (!personne) {
                return { 
                    success: false, 
                    message: 'Utilisateur introuvable',
                    errorCode: 'USER_NOT_FOUND'
                };
            }

            const user = await Utilisateur.findOne({ personne: personne._id })
                .populate('personne')
                .populate('idRole');

            if (!user) {
                return { 
                    success: false, 
                    message: 'Utilisateur introuvable',
                    errorCode: 'USER_NOT_FOUND'
                };
            }

            const passwordMatch = await bcrypt.compare(oldPassword, user.motDePasse);
            if (!passwordMatch) {
                return { 
                    success: false, 
                    message: 'Ancien mot de passe incorrect',
                    errorCode: 'INVALID_OLD_PASSWORD'
                };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.motDePasse = hashedPassword;
            await user.save();

            return { 
                success: true, 
                message: "Mot de passe modifié avec succès"
            };
        } catch (error) {
            console.error('Change password error:', error);
            const formattedError = formatErrorMessage(error);
            return { 
                success: false, 
                message: formattedError.message,
                errorCode: formattedError.code
            };
        }
    }
};

// Helper functions
function validateRegistrationData({ nom, prenom, email, motDePasse, idRole }) {
    if (!nom || nom.trim() === '') {
        return 'VALIDATION_ERROR: Le nom est obligatoire';
    }
    if (!prenom || prenom.trim() === '') {
        return 'VALIDATION_ERROR: Le prénom est obligatoire';
    }
    if (!email || email.trim() === '') {
        return 'VALIDATION_ERROR: L\'email est obligatoire';
    }
    if (!isValidEmail(email)) {
        return 'VALIDATION_ERROR: Format d\'email invalide';
    }
    if (!idRole || idRole.trim() === '') {
        return 'VALIDATION_ERROR: Le rôle est obligatoire';
    }
    if (motDePasse && motDePasse.length < 6) {
        return 'VALIDATION_ERROR: Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatErrorMessage(error) {
    const message = error.message || 'Erreur inconnue';

    if (message.includes('DUPLICATE_EMAIL:')) {
        return {
            code: 'DUPLICATE_EMAIL',
            message: message.replace('DUPLICATE_EMAIL: ', ''),
            details: 'Veuillez utiliser un autre email ou vous connecter si vous avez déjà un compte'
        };
    }

    if (message.includes('VALIDATION_ERROR:')) {
        return {
            code: 'VALIDATION_ERROR',
            message: message.replace('VALIDATION_ERROR: ', ''),
            details: 'Veuillez vérifier les informations saisies'
        };
    }

    if (message.includes('E11000 duplicate key')) {
        const field = extractDuplicateField(message);
        return {
            code: 'DUPLICATE_FIELD',
            message: `Ce ${field} est déjà utilisé`,
            details: 'Veuillez choisir une autre valeur'
        };
    }

    return {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur inattendue s\'est produite',
        details: 'Veuillez contacter l\'administrateur si le problème persiste'
    };
}

function extractDuplicateField(message) {
    if (message.includes('email_1')) return 'email';
    if (message.includes('numeroTelephone_1')) return 'numéro de téléphone';
    if (message.includes('matricule_1')) return 'matricule';
    return 'champ';
}

async function getRoleByLibelle(roleLibelle, session) {
    try {
        const role = await Role.findOne({ 
            libelle: { $regex: new RegExp(roleLibelle, 'i') } 
        }).session(session);
        
        if (role) {
            return role;
        }
        
        console.log(`Role '${roleLibelle}' not found. Creating default role.`);
        
        const newRole = new Role({
            libelle: roleLibelle,
            Etat: 'Actif'
        });
        
        return await newRole.save({ session });
        
    } catch (error) {
        throw new Error(`ROLE_ERROR: Impossible de créer ou récupérer le rôle ${roleLibelle}`);
    }
}

module.exports = AuthenticationService;
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = 'M1-transversal-project';

export const AuthenticationService = {
  authenticateUser: async (email: string, password: string) => {
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

      const passwordMatch = await bcrypt.compare(password, user.motDePasse);
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
        roles: user.roles.map((r: any) => r.role.libelle),
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      return {
        success: true,
        message: 'Connexion réussie',
        token,
        user: payload
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur serveur',
        errorCode: 'SERVER_ERROR'
      };
    }
  },

  verifyToken: (token: string) => {
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

  hashPassword: async (password: string) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return {
        success: true,
        hashedPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du hachage du mot de passe',
        errorCode: 'HASH_ERROR'
      };
    }
  },

  register: async (data: any) => {
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
      const hashedPassword = await bcrypt.hash(motDePasse, 10);
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
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la création',
        errorCode: 'SERVER_ERROR'
      };
    }
  },

  changePassword: async (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
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
      const passwordMatch = await bcrypt.compare(oldPassword, user.motDePasse);
      if (!passwordMatch) {
        return {
          success: false,
          message: 'Ancien mot de passe incorrect',
          errorCode: 'INVALID_OLD_PASSWORD'
        };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.utilisateur.update({
        where: { email },
        data: { motDePasse: hashedPassword }
      });
      return {
        success: true,
        message: 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du changement de mot de passe',
        errorCode: 'SERVER_ERROR'
      };
    }
  }
};

import { Router } from 'express';
import { AuthenticationController } from '../../controllers/utilisateur/authentification.controller';

const router = Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.post('/verify-token', AuthenticationController.verifyToken);
router.post('/change-password', AuthenticationController.changePassword);

export default router;
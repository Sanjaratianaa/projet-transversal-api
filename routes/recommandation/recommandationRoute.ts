import { Router } from 'express';
import { getAllRecommandationsController, createRecommandationController } from '../../controllers/recommandation/recommandation.controller';

const router = Router();

router.get('/recommandations', getAllRecommandationsController);
router.post('/recommandations', createRecommandationController);

export default router;

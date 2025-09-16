import { Router } from 'express';
import { getAllObjectifsController, createObjectifController } from '../../controllers/objectif/objectif.controller';

const router = Router();

router.get('/objectifs', getAllObjectifsController);
router.post('/objectifs', createObjectifController);

export default router;

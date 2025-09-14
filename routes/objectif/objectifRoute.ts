import { Router } from 'express';
import { getAllObjectifsController } from '../../controllers/objectif/objectif.controller';

const router = Router();

router.get('/objectifs', getAllObjectifsController);

export default router;

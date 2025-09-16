import { Router } from 'express';
import { getAllCategories, getDepenseCategories, getRevenuCategories } from '../../controllers/categorie/categorie.controller';

const router = Router();

// Catégorie routes
router.get('/categories', getAllCategories);
router.get('/categories/depense', getDepenseCategories);
router.get('/categories/revenu', getRevenuCategories);

export default router;
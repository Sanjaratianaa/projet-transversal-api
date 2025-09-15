import { Router } from 'express';
import {
  getAllFacturesController,
  getFactureByIdController,
  getFacturesByUserController,
  createFactureController,
  updateFactureController,
  deleteFactureController,
  getFacturesByFournisseurController,
  getFacturesByTypeController,
  getFacturesByStatutController,
  getFacturesByMoyenPaiementController,
  getFacturesByDateRangeController,
  getFacturesByMontantRangeController,
  getTotalMontantByUserController,
  getMontantByFournisseurController,
  getMontantByTypeController,
  getFacturesEnRetardController,
  getFacturesAVenirController,
  createFactureFromOCRController,
  createFactureWithFileController
} from '../../controllers/factures/factures.controller';

const router = Router();

// ============= CRUD ROUTES =============

// Factures routes
router.get('/factures', getAllFacturesController);
router.get('/factures/:id', getFactureByIdController);
router.post('/factures', createFactureController);
router.put('/factures/:id', updateFactureController);
router.delete('/factures/:id', deleteFactureController);

// ============= USER SPECIFIC ROUTES =============

// Factures d'un utilisateur
router.get('/users/:userId/factures', getFacturesByUserController);

// ============= FILTERING ROUTES =============

// Filtrage par fournisseur
router.get('/factures/fournisseur/:fournisseur', getFacturesByFournisseurController);

// Filtrage par type
router.get('/factures/type/:type', getFacturesByTypeController);

// Filtrage par statut
router.get('/factures/statut/:statut', getFacturesByStatutController);

// Filtrage par moyen de paiement
router.get('/factures/paiement/:moyenPaiement', getFacturesByMoyenPaiementController);

// Filtrage par plage de dates (query params: ?startDate=2025-01-01&endDate=2025-12-31)
router.get('/factures/filter/dates', getFacturesByDateRangeController);

// Filtrage par plage de montants (query params: ?minMontant=100&maxMontant=500)
router.get('/factures/filter/montants', getFacturesByMontantRangeController);

// ============= STATISTICS ROUTES =============

// Montant total des factures d'un utilisateur
router.get('/users/:userId/factures/total', getTotalMontantByUserController);

// Montant par fournisseur pour un utilisateur
router.get('/users/:userId/factures/stats/fournisseurs', getMontantByFournisseurController);

// Montant par type pour un utilisateur
router.get('/users/:userId/factures/stats/types', getMontantByTypeController);

// Factures en retard (query param optionnel: ?userId=1)
router.get('/factures/retard', getFacturesEnRetardController);

// Factures à venir (query params optionnels: ?days=7&userId=1)
router.get('/factures/avenir', getFacturesAVenirController);

// ============= OCR ROUTES =============

// Créer une facture depuis OCR
router.post('/factures/ocr', createFactureFromOCRController);

// Créer une facture avec fichier attaché
router.post('/factures/with-file', createFactureWithFileController);

export default router;
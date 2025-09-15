// routes/simulation.routes.ts
import { Router } from 'express';
import {
  getAllSimulationsController,
  getSimulationsByUserController,
  getSimulationByIdController,
  createSimulationController,
  updateSimulationController,
  deleteSimulationController,
  getSimulationStatsController,
  calculateSimulationController
} from '../../controllers/pret/simulation.controller';

const router = Router();

// Routes des simulations de prêt
// GET - Récupérer toutes les simulations
router.get('/simulations', getAllSimulationsController);

// GET - Récupérer les simulations d'un utilisateur spécifique
router.get('/simulations/user/:userId', getSimulationsByUserController);

// GET - Récupérer une simulation par ID
router.get('/simulations/:id', getSimulationByIdController);

// POST - Créer une nouvelle simulation
router.post('/simulations', createSimulationController);

// PUT - Mettre à jour une simulation existante
router.put('/simulations/:id', updateSimulationController);

// DELETE - Supprimer une simulation
router.delete('/simulations/:id', deleteSimulationController);

// GET - Statistiques des simulations (globales ou par utilisateur)
router.get('/simulations/stats/:userId?', getSimulationStatsController);

// POST - Calculs en temps réel sans sauvegarde
router.post('/simulations/calculate', calculateSimulationController);

export default router;
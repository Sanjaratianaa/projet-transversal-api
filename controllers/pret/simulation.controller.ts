// controllers/simulation/simulation.controller.ts
import { Request, Response } from 'express';
import {
  getAllSimulations,
  getSimulationsByUser,
  getSimulationById,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  getSimulationStats,
  calculateSalarySimulation,
  calculateCapacitySimulation,
  calculateTableSimulation,
  SimulationData
} from '../../services/simulation.service';

// GET /api/simulations - Récupérer toutes les simulations
export const getAllSimulationsController = async (req: Request, res: Response) => {
  try {
    const simulations = await getAllSimulations();
    res.json({ data: simulations });
  } catch (error) {
    console.error('Erreur lors de la récupération des simulations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des simulations.' });
  }
};

// GET /api/simulations/user/:userId - Récupérer les simulations d'un utilisateur
export const getSimulationsByUserController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide.' });
    }

    const simulations = await getSimulationsByUser(userId);
    res.json({ data: simulations });
  } catch (error) {
    console.error('Erreur lors de la récupération des simulations utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des simulations utilisateur.' });
  }
};

// GET /api/simulations/:id - Récupérer une simulation par ID
export const getSimulationByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de simulation invalide.' });
    }

    const simulation = await getSimulationById(id);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation non trouvée.' });
    }

    res.json({ data: simulation });
  } catch (error) {
    console.error('Erreur lors de la récupération de la simulation:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la simulation.' });
  }
};

// POST /api/simulations - Créer une nouvelle simulation
export const createSimulationController = async (req: Request, res: Response) => {
  try {
    const {
      id_user,
      salaire_net,
      duree_salaire,
      taux_salaire,
      capacite_emprunt,
      duree_emprunt,
      taux_emprunt,
      nom_simulation
    } = req.body;

    // Validation des champs requis
    const requiredFields = [
      'id_user', 'salaire_net', 'duree_salaire', 'taux_salaire',
      'capacite_emprunt', 'duree_emprunt', 'taux_emprunt'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Champs manquants: ${missingFields.join(', ')}`
      });
    }

    // Validation des types
    if (
      isNaN(Number(id_user)) ||
      isNaN(Number(salaire_net)) ||
      isNaN(Number(duree_salaire)) ||
      isNaN(Number(taux_salaire)) ||
      isNaN(Number(capacite_emprunt)) ||
      isNaN(Number(duree_emprunt)) ||
      isNaN(Number(taux_emprunt))
    ) {
      return res.status(400).json({
        error: 'Tous les champs numériques doivent être des nombres valides.'
      });
    }

    const simulationData: SimulationData = {
      salaire_net: Number(salaire_net),
      duree_salaire: Number(duree_salaire),
      taux_salaire: Number(taux_salaire),
      capacite_emprunt: Number(capacite_emprunt),
      duree_emprunt: Number(duree_emprunt),
      taux_emprunt: Number(taux_emprunt),
      nom_simulation
    };

    const simulation = await createSimulation(Number(id_user), simulationData);
    res.status(201).json({
      success: true,
      data: simulation,
      message: 'Simulation créée avec succès.'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la simulation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la simulation.' });
  }
};

// PUT /api/simulations/:id - Mettre à jour une simulation
export const updateSimulationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de simulation invalide.' });
    }

    // Vérifier que la simulation existe
    const existingSimulation = await getSimulationById(id);
    if (!existingSimulation) {
      return res.status(404).json({ error: 'Simulation non trouvée.' });
    }

    const updatedSimulation = await updateSimulation(id, req.body);
    res.json({
      success: true,
      data: updatedSimulation,
      message: 'Simulation mise à jour avec succès.'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la simulation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la simulation.' });
  }
};

// DELETE /api/simulations/:id - Supprimer une simulation
export const deleteSimulationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de simulation invalide.' });
    }

    // Vérifier que la simulation existe
    const existingSimulation = await getSimulationById(id);
    if (!existingSimulation) {
      return res.status(404).json({ error: 'Simulation non trouvée.' });
    }

    await deleteSimulation(id);
    res.json({
      success: true,
      message: 'Simulation supprimée avec succès.'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la simulation:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la simulation.' });
  }
};

// GET /api/simulations/stats/:userId? - Statistiques des simulations
export const getSimulationStatsController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId) : undefined;
    
    if (userId !== undefined && isNaN(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide.' });
    }

    const stats = await getSimulationStats(userId);
    res.json({ data: stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
  }
};

// POST /api/simulations/calculate - Calculs en temps réel (sans sauvegarde)
export const calculateSimulationController = async (req: Request, res: Response) => {
  try {
    const { type, ...data } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Le type de calcul est requis.' });
    }

    let result = {};

    switch (type) {
      case 'salary':
        const { salaire_net, duree_salaire, taux_salaire } = data;
        if (!salaire_net || !duree_salaire || !taux_salaire) {
          return res.status(400).json({
            error: 'Données manquantes pour le calcul salaire: salaire_net, duree_salaire, taux_salaire'
          });
        }
        result = calculateSalarySimulation(
          Number(salaire_net),
          Number(duree_salaire),
          Number(taux_salaire)
        );
        break;

      case 'capacity':
        const { capacite_emprunt, duree_emprunt, taux_emprunt } = data;
        if (!capacite_emprunt || !duree_emprunt || !taux_emprunt) {
          return res.status(400).json({
            error: 'Données manquantes pour le calcul capacité: capacite_emprunt, duree_emprunt, taux_emprunt'
          });
        }
        result = calculateCapacitySimulation(
          Number(capacite_emprunt),
          Number(duree_emprunt),
          Number(taux_emprunt)
        );
        break;

      case 'table':
        const { table_emprunt, table_duree, table_taux, table_taux_fd_ht } = data;
        if (!table_emprunt || !table_duree || !table_taux || table_taux_fd_ht === undefined) {
          return res.status(400).json({
            error: 'Données manquantes pour le calcul tableau: table_emprunt, table_duree, table_taux, table_taux_fd_ht'
          });
        }
        result = calculateTableSimulation(
          Number(table_emprunt),
          Number(table_duree),
          Number(table_taux),
          Number(table_taux_fd_ht)
        );
        break;

      default:
        return res.status(400).json({
          error: 'Type de calcul invalide. Types disponibles: salary, capacity, table'
        });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Erreur lors du calcul:', error);
    res.status(500).json({ error: 'Erreur lors du calcul.' });
  }
};
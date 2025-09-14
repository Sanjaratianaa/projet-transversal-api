import { Request, Response } from 'express';
import { getAllRecommandations, createRecommandation } from '../../services/recommandation.service';

export const getAllRecommandationsController = async (req: Request, res: Response) => {
  try {
    const recommandations = await getAllRecommandations();
    res.json({ data: recommandations });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des recommandations.' });
  }
};

export const createRecommandationController = async (req: Request, res: Response) => {
  try {
    const { id_user, description, type } = req.body;
    // Prisma attend probablement utilisateurId, pas id_user
    const recommandation = await createRecommandation({ utilisateurId: id_user, description, type });
    res.status(201).json({ data: recommandation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la recommandation.' });
  }
};

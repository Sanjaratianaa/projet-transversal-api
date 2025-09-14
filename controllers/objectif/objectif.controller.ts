import { Request, Response } from 'express';
import { getAllObjectifs } from '../../services/objectif.service';

export const getAllObjectifsController = async (req: Request, res: Response) => {
  try {
    const objectifs = await getAllObjectifs();
    res.json({ data: objectifs });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des objectifs.' });
  }
};

import { Request, Response } from 'express';
import { getAllCategory, getAllCategoryDepense, getAllCategoryRevenu } from '../../services/categorie.service';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategory();
  res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
};

export const getDepenseCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoryDepense();
  res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories de dépense.' });
  }
};

export const getRevenuCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoryRevenu();
  res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories de revenu.' });
  }
};

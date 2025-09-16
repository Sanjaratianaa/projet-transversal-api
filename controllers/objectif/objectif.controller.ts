import { Request, Response } from 'express';
import { getAllObjectifs , createObjectif} from '../../services/objectif.service';

export const getAllObjectifsController = async (req: Request, res: Response) => {
  try {
    const objectifs = await getAllObjectifs();
    res.json({ data: objectifs });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des objectifs.' });
  }
};

export const createObjectifController = async (req: Request, res: Response) => {
  try {
    const { utilisateurId, libelle, montantTotal, dateDebut, dateFin, statut } = req.body;
    if (!utilisateurId || !libelle || !montantTotal) {
      return res.status(400).json({ error: 'Utilisateur, nom et montant total requis.' });
    }

    const objectif = await createObjectif({
      utilisateurId,
      libelle,
      montantTotal,
      dateDebut: dateDebut ? new Date(dateDebut) : undefined,
      dateFin: dateFin ? new Date(dateFin) : undefined,
      statut: statut || 'En cours',
    });

    res.status(201).json({ data: objectif });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'objectif.' });
  }
};
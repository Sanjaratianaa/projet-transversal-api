import { Request, Response } from 'express';
import { createFichier, deleteFichier, getFichiersByFacture } from '../../services/fichier.service';

export const uploadFichiersController = async (req: Request, res: Response) => {
  try {
    const factureId = parseInt(req.body.factureId);
    if (!factureId || !req.file) {
      return res.status(400).json({ error: 'Facture ID et fichier requis' });
    }

    const fichier = await createFichier({
      factureId,
      cheminFichier: req.file.path,
      typeMime: req.file.mimetype
    });

    res.status(201).json({ data: [fichier] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
  }
};

export const getFichiersByFactureController = async (req: Request, res: Response) => {
  const factureId = parseInt(req.params.factureId);
  const fichiers = await getFichiersByFacture(factureId);
  res.json({ data: fichiers });
};

export const deleteFichierController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await deleteFichier(id);
  res.json({ message: 'Fichier supprimé' });
};

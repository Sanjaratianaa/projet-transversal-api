import { Request, Response } from 'express';
import {
  getAllFactures,
  getFactureById,
  getFacturesByUser,
  createFacture,
  updateFacture,
  deleteFacture,
  getFacturesByFournisseur,
  getFacturesByType,
  getFacturesByStatut,
  getFacturesByMoyenPaiement,
  getFacturesByDateRange,
  getFacturesByMontantRange,
  getTotalMontantByUser,
  getMontantByFournisseur,
  getMontantByType,
  getFacturesEnRetard,
  getFacturesAVenir,
  createFactureFromOCR,
  createFactureWithFile
} from '../../services/factures.service';

// ============= CRUD CONTROLLERS =============

// Obtenir toutes les factures
export const getAllFacturesController = async (req: Request, res: Response) => {
  try {
    const factures = await getAllFactures();
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures.' });
  }
};

// Obtenir une facture par ID
export const getFactureByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const facture = await getFactureById(parseInt(id));
    
    if (!facture) {
      return res.status(404).json({ error: 'Facture non trouvée.' });
    }
    
    res.json({ data: facture });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la facture.' });
  }
};

// Obtenir les factures d'un utilisateur
export const getFacturesByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const factures = await getFacturesByUser(parseInt(userId));
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures de l\'utilisateur.' });
  }
};

// Créer une nouvelle facture
export const createFactureController = async (req: Request, res: Response) => {
  try {
    const factureData = req.body;
    
    // Validation des données requises
    const required = ['utilisateurId', 'fournisseur', 'typeFacture', 'montant', 'dateEmission', 'dateEcheance', 'statut', 'moyenPaiement'];
    const missing = required.filter(field => !factureData[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: `Champs manquants: ${missing.join(', ')}` 
      });
    }

    // Conversion des dates
    factureData.dateEmission = new Date(factureData.dateEmission);
    factureData.dateEcheance = new Date(factureData.dateEcheance);
    factureData.montant = parseFloat(factureData.montant);

    const newFacture = await createFacture(factureData);
    res.status(201).json({ 
      message: 'Facture créée avec succès',
      data: newFacture 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture.' });
  }
};

// Mettre à jour une facture
export const updateFactureController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Conversion des dates si présentes
    if (updateData.dateEmission) {
      updateData.dateEmission = new Date(updateData.dateEmission);
    }
    if (updateData.dateEcheance) {
      updateData.dateEcheance = new Date(updateData.dateEcheance);
    }
    if (updateData.montant) {
      updateData.montant = parseFloat(updateData.montant);
    }

    const updatedFacture = await updateFacture(parseInt(id), updateData);
    res.json({ 
      message: 'Facture mise à jour avec succès',
      data: updatedFacture 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la facture.' });
  }
};

// Supprimer une facture
export const deleteFactureController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteFacture(parseInt(id));
    res.json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture.' });
  }
};

// ============= FILTERING CONTROLLERS =============

// Factures par fournisseur
export const getFacturesByFournisseurController = async (req: Request, res: Response) => {
  try {
    const { fournisseur } = req.params;
    const factures = await getFacturesByFournisseur(fournisseur);
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par fournisseur.' });
  }
};

// Factures par type
export const getFacturesByTypeController = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const factures = await getFacturesByType(type);
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par type.' });
  }
};

// Factures par statut
export const getFacturesByStatutController = async (req: Request, res: Response) => {
  try {
    const { statut } = req.params;
    const factures = await getFacturesByStatut(statut);
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par statut.' });
  }
};

// Factures par moyen de paiement
export const getFacturesByMoyenPaiementController = async (req: Request, res: Response) => {
  try {
    const { moyenPaiement } = req.params;
    const factures = await getFacturesByMoyenPaiement(moyenPaiement);
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par moyen de paiement.' });
  }
};

// Factures par plage de dates
export const getFacturesByDateRangeController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Les dates de début et fin sont requises.' });
    }

    const factures = await getFacturesByDateRange(
      new Date(startDate as string), 
      new Date(endDate as string)
    );
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par plage de dates.' });
  }
};

// Factures par plage de montants
export const getFacturesByMontantRangeController = async (req: Request, res: Response) => {
  try {
    const { minMontant, maxMontant } = req.query;
    
    if (!minMontant || !maxMontant) {
      return res.status(400).json({ error: 'Les montants minimum et maximum sont requis.' });
    }

    const factures = await getFacturesByMontantRange(
      parseFloat(minMontant as string), 
      parseFloat(maxMontant as string)
    );
    res.json({ data: factures });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par plage de montants.' });
  }
};

// ============= STATISTICS CONTROLLERS =============

// Montant total des factures d'un utilisateur
export const getTotalMontantByUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const totalMontant = await getTotalMontantByUser(parseInt(userId));
    res.json({ data: { totalMontant } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du calcul du montant total.' });
  }
};

// Montant par fournisseur
export const getMontantByFournisseurController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const montantsByFournisseur = await getMontantByFournisseur(parseInt(userId));
    res.json({ data: montantsByFournisseur });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des montants par fournisseur.' });
  }
};

// Montant par type
export const getMontantByTypeController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const montantsByType = await getMontantByType(parseInt(userId));
    res.json({ data: montantsByType });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des montants par type.' });
  }
};

// Factures en retard
export const getFacturesEnRetardController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const facturesEnRetard = await getFacturesEnRetard(
      userId ? parseInt(userId as string) : undefined
    );
    res.json({ data: facturesEnRetard });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures en retard.' });
  }
};

// Factures à venir
export const getFacturesAVenirController = async (req: Request, res: Response) => {
  try {
    const { days = 7, userId } = req.query;
    const facturesAVenir = await getFacturesAVenir(
      parseInt(days as string),
      userId ? parseInt(userId as string) : undefined
    );
    res.json({ data: facturesAVenir });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures à venir.' });
  }
};

// ============= OCR CONTROLLERS =============

// Créer facture depuis OCR
export const createFactureFromOCRController = async (req: Request, res: Response) => {
  try {
    const { ocrData, userId } = req.body;
    
    if (!ocrData || !userId) {
      return res.status(400).json({ error: 'Données OCR et ID utilisateur requis.' });
    }

    const newFacture = await createFactureFromOCR(ocrData, parseInt(userId));
    res.status(201).json({ 
      message: 'Facture créée depuis OCR avec succès',
      data: newFacture 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture depuis OCR.' });
  }
};

// Créer facture avec fichier
export const createFactureWithFileController = async (req: Request, res: Response) => {
  try {
    const { factureData, fileData } = req.body;
    
    if (!factureData || !fileData) {
      return res.status(400).json({ error: 'Données de facture et fichier requis.' });
    }

    // Conversion des dates
    factureData.dateEmission = new Date(factureData.dateEmission);
    factureData.dateEcheance = new Date(factureData.dateEcheance);
    factureData.montant = parseFloat(factureData.montant);

    const newFacture = await createFactureWithFile(factureData, fileData);
    res.status(201).json({ 
      message: 'Facture créée avec fichier avec succès',
      data: newFacture 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture avec fichier.' });
  }
};
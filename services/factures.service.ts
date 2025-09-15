import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types pour TypeScript
export interface FactureCreateInput {
  utilisateurId: number;
  fournisseur: string;
  typeFacture: string;
  montant: number;
  dateEmission: Date;
  dateEcheance: Date;
  statut: string;
  moyenPaiement: string;
}

export interface FactureUpdateInput {
  fournisseur?: string;
  typeFacture?: string;
  montant?: number;
  dateEmission?: Date;
  dateEcheance?: Date;
  statut?: string;
  moyenPaiement?: string;
}

// ============= CRUD OPERATIONS =============

// Créer une nouvelle facture
export async function createFacture(data: FactureCreateInput) {
  return prisma.facture.create({
    data: {
      utilisateurId: data.utilisateurId,
      fournisseur: data.fournisseur,
      typeFacture: data.typeFacture,
      montant: data.montant,
      dateEmission: data.dateEmission,
      dateEcheance: data.dateEcheance,
      statut: data.statut,
      moyenPaiement: data.moyenPaiement
    },
    include: {
      utilisateur: true,
      fichiers: true
    }
  });
}

// Obtenir toutes les factures
export async function getAllFactures() {
  return prisma.facture.findMany({
    include: {
      utilisateur: true,
      fichiers: true
    },
    orderBy: { dateEmission: 'desc' }
  });
}

// Obtenir une facture par ID
export async function getFactureById(id: number) {
  return prisma.facture.findUnique({
    where: { id },
    include: {
      utilisateur: true,
      fichiers: true
    }
  });
}

// Obtenir toutes les factures d'un utilisateur
export async function getFacturesByUser(userId: number) {
  return prisma.facture.findMany({
    where: { utilisateurId: userId },
    include: {
      fichiers: true
    },
    orderBy: { dateEmission: 'desc' }
  });
}

// Mettre à jour une facture
export async function updateFacture(id: number, data: FactureUpdateInput) {
  return prisma.facture.update({
    where: { id },
    data,
    include: {
      utilisateur: true,
      fichiers: true
    }
  });
}

// Supprimer une facture
export async function deleteFacture(id: number) {
  return prisma.facture.delete({
    where: { id }
  });
}

// ============= FILTERING METHODS =============

// Factures par fournisseur
export async function getFacturesByFournisseur(fournisseur: string) {
  return prisma.facture.findMany({
    where: { 
      fournisseur: {
        contains: fournisseur,
        mode: 'insensitive'
      }
    },
    include: { fichiers: true },
    orderBy: { dateEmission: 'desc' }
  });
}

// Factures par type
export async function getFacturesByType(type: string) {
  return prisma.facture.findMany({
    where: { typeFacture: type },
    include: { fichiers: true },
    orderBy: { dateEmission: 'desc' }
  });
}

// Factures par statut
export async function getFacturesByStatut(statut: string) {
  return prisma.facture.findMany({
    where: { statut },
    include: { fichiers: true },
    orderBy: { dateEmission: 'desc' }
  });
}

// Factures par moyen de paiement
export async function getFacturesByMoyenPaiement(moyenPaiement: string) {
  return prisma.facture.findMany({
    where: { moyenPaiement: moyenPaiement },
    include: { fichiers: true },
    orderBy: { dateEmission: 'desc' }
  });
}

// Factures dans une plage de dates
export async function getFacturesByDateRange(startDate: Date, endDate: Date) {
  return prisma.facture.findMany({
    where: {
      dateEmission: {
        gte: startDate,
        lte: endDate
      }
    },
    include: { fichiers: true },
    orderBy: { dateEmission: 'desc' }
  });
}

// Factures par montant (min-max)
export async function getFacturesByMontantRange(minMontant: number, maxMontant: number) {
  return prisma.facture.findMany({
    where: {
      montant: {
        gte: minMontant,
        lte: maxMontant
      }
    },
    include: { fichiers: true },
    orderBy: { montant: 'desc' }
  });
}

// ============= STATISTICS METHODS =============

// Somme totale des factures d'un utilisateur
export async function getTotalMontantByUser(userId: number) {
  const result = await prisma.facture.aggregate({
    where: { utilisateurId: userId },
    _sum: { montant: true }
  });
  return result._sum.montant || 0;
}

// Somme par fournisseur
export async function getMontantByFournisseur(userId: number) {
  return prisma.facture.groupBy({
    by: ['fournisseur'],
    where: { utilisateurId: userId },
    _sum: { montant: true },
    orderBy: { _sum: { montant: 'desc' } }
  });
}

// Somme par type de facture
export async function getMontantByType(userId: number) {
  return prisma.facture.groupBy({
    by: ['typeFacture'],
    where: { utilisateurId: userId },
    _sum: { montant: true },
    orderBy: { _sum: { montant: 'desc' } }
  });
}

// Factures en retard (échéance dépassée)
export async function getFacturesEnRetard(userId?: number) {
  const today = new Date();
  return prisma.facture.findMany({
    where: {
      ...(userId && { utilisateurId: userId }),
      dateEcheance: { lt: today },
      statut: { not: 'payé' }
    },
    include: { fichiers: true },
    orderBy: { dateEcheance: 'asc' }
  });
}

// Factures à venir (échéance dans les X jours)
export async function getFacturesAVenir(days: number = 7, userId?: number) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return prisma.facture.findMany({
    where: {
      ...(userId && { utilisateurId: userId }),
      dateEcheance: { 
        gte: today,
        lte: futureDate 
      },
      statut: { not: 'payé' }
    },
    include: { fichiers: true },
    orderBy: { dateEcheance: 'asc' }
  });
}

// ============= OCR INTEGRATION HELPER =============

// Créer une facture depuis les données OCR
export async function createFactureFromOCR(ocrData: any, userId: number) {
  return prisma.facture.create({
    data: {
      utilisateurId: userId,
      fournisseur: ocrData.fournisseur || 'Non spécifié',
      typeFacture: ocrData.typeFacture || 'Autre',
      montant: parseFloat(ocrData.montant) || 0,
      dateEmission: new Date(ocrData.dateEmission) || new Date(),
      dateEcheance: new Date(ocrData.dateEcheance) || new Date(),
      statut: ocrData.statut || 'En attente',
      moyenPaiement: ocrData.moyenPaiement || 'Non spécifié'
    },
    include: {
      utilisateur: true,
      fichiers: true
    }
  });
}

// Créer une facture avec fichier attaché (pour OCR)
export async function createFactureWithFile(
  factureData: FactureCreateInput, 
  fileData: { cheminFichier: string; typeMime: string }
) {
  return prisma.facture.create({
    data: {
      ...factureData,
      fichiers: {
        create: [fileData]
      }
    },
    include: {
      utilisateur: true,
      fichiers: true
    }
  });
}
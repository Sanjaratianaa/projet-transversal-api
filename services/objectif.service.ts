import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Toutes les objectifs
export async function getAllObjectifs() {
  return prisma.objectif.findMany();
}

// Ajouter un montant à montant_actuel d'un objectif
export async function incrementMontantObjectif(id: number, montant: number) {
  // On utilise une opération atomique pour éviter les problèmes de concurrence
  return prisma.objectif.update({
    where: { id },
    data: {
      montantActuel: {
        increment: montant
      }
    }
  });
}

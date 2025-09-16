import { PrismaClient, Fichier } from '@prisma/client';

const prisma = new PrismaClient();

export interface FichierCreateInput {
  factureId: number;
  cheminFichier: string;
  typeMime: string;
}

export async function createFichier(data: FichierCreateInput) {
  return prisma.fichier.create({ data });
}

export async function getFichiersByFacture(factureId: number) {
  return prisma.fichier.findMany({ where: { factureId } });
}

export async function deleteFichier(id: number) {
  return prisma.fichier.delete({ where: { id } });
}

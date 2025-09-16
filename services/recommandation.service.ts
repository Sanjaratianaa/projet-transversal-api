import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Toutes les recommandations
export async function getAllRecommandations() {
  return prisma.recommandation.findMany();
}

// Créer une recommandation
export async function createRecommandation(data: {
  utilisateurId: number;
  description: string;
  type: string;
}) {
  return prisma.recommandation.create({ data });
}

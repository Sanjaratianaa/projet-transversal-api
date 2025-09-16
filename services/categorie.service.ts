import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Toutes les catégories
export async function getAllCategory() {
  return prisma.categorie.findMany();
}

// Catégories de dépense
export async function getAllCategoryDepense() {
  return prisma.categorie.findMany({
    where: { type: 'depense' }
  });
}

// Catégories de revenu
export async function getAllCategoryRevenu() {
  return prisma.categorie.findMany({
    where: { type: 'revenu' }
  });
}

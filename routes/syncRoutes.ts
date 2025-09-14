import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// POST /api/sync - Synchronisation bidirectionnelle pour budgets
router.post('/sync', async (req: Request, res: Response) => {
  const { budgets = [] } = req.body;
  const synced: any[] = [];
  const server_updates: any[] = [];

  for (const budget of budgets) {
    // On suppose que budget.id est l'ID local ou serveur
    const existing = budget.id
      ? await prisma.budget.findUnique({ where: { id: budget.id } })
      : null;
    if (!existing) {
      // Création si n'existe pas
      const created = await prisma.budget.create({ data: budget });
      synced.push(created);
    } else {
      // Mise à jour si la version mobile est plus récente
      if (
        budget.updated_at &&
        (!existing.updated_at || new Date(budget.updated_at) > new Date(existing.updated_at))
      ) {
        const updated = await prisma.budget.update({
          where: { id: budget.id },
          data: budget,
        });
        synced.push(updated);
      } else {
        // Sinon, on retourne la version serveur pour mise à jour locale
        server_updates.push(existing);
      }
    }
  }

  res.json({
    synced: { budgets: synced },
    server_updates: { budgets: server_updates },
  });
});

// GET /api/sync?since=2025-09-14T00:00:00Z - Récupérer les budgets modifiés depuis une date
router.get('/sync', async (req: Request, res: Response) => {
  const since = req.query.since as string;
  let budgets = [];
  if (since) {
    budgets = await prisma.budget.findMany({
      where: {
        updated_at: { gte: new Date(since) },
      },
    });
  } else {
    budgets = await prisma.budget.findMany();
  }
  res.json({ budgets });
});

export default router;

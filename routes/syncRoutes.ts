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
    const existing = budget.id
        ? await prisma.budget.findUnique({ where: { id: budget.id } })
        : null;

    if (!existing) {
        // Pick only allowed fields for creation
        const { id, ...data } = budget;
        const created = await prisma.budget.create({ data });
        synced.push(created);
    } else {
        // Update if client version is newer
        if (
        budget.updated_at &&
        (!existing.updated_at || new Date(budget.updated_at) > new Date(existing.updated_at))
        ) {
        const { id, ...data } = budget;
        const updated = await prisma.budget.update({
            where: { id: budget.id },
            data,
        });
        synced.push(updated);
        } else {
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
    const budgets = since
    ? await prisma.budget.findMany({
        where: { updated_at: { gte: new Date(since) } },
        })
    : await prisma.budget.findMany();
    res.json({ budgets });
});

export default router;

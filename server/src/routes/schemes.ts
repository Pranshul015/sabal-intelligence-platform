import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/schemes
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            search,
            category,
            state,
            ministry,
            isCentral,
            page = '1',
            limit = '50',
        } = req.query;

        const where: any = { isActive: true };

        if (search) {
            const s = search as string;
            where.OR = [
                { title: { contains: s, mode: 'insensitive' } },
                { department: { contains: s, mode: 'insensitive' } },
                { benefit: { contains: s, mode: 'insensitive' } },
                { description: { contains: s, mode: 'insensitive' } },
            ];
        }

        if (category && category !== 'all') {
            where.category = { has: category as string };
        }

        if (state && state !== 'all') {
            if (state === 'All India') {
                where.isCentral = true;
            } else {
                where.OR = [
                    ...(where.OR || []),
                    { state: state as string },
                    { state: 'All India' },
                ];
            }
        }

        if (ministry && ministry !== 'all') {
            where.ministry = ministry as string;
        }

        if (isCentral !== undefined) {
            where.isCentral = isCentral === 'true';
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [schemes, total] = await Promise.all([
            prisma.scheme.findMany({
                where,
                skip,
                take,
                orderBy: { title: 'asc' },
            }),
            prisma.scheme.count({ where }),
        ]);

        res.json({
            schemes,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Get schemes error:', error);
        res.status(500).json({ error: 'Failed to get schemes.' });
    }
});

// GET /api/schemes/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const scheme = await prisma.scheme.findUnique({
            where: { id: req.params.id },
        });

        if (!scheme) {
            res.status(404).json({ error: 'Scheme not found.' });
            return;
        }

        res.json({ scheme });
    } catch (error) {
        console.error('Get scheme error:', error);
        res.status(500).json({ error: 'Failed to get scheme.' });
    }
});

export default router;

import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/applications
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { schemeId, notes } = req.body;

        if (!schemeId) {
            res.status(400).json({ error: 'Scheme ID is required.' });
            return;
        }

        const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
        if (!scheme) {
            res.status(404).json({ error: 'Scheme not found.' });
            return;
        }

        // Check for duplicate application
        const existing = await prisma.application.findFirst({
            where: {
                userId: req.user!.id,
                schemeId,
                status: { in: ['PENDING', 'IN_REVIEW'] },
            },
        });

        if (existing) {
            res.status(409).json({ error: 'You already have an active application for this scheme.', application: existing });
            return;
        }

        const referenceNumber = `SS-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

        const application = await prisma.application.create({
            data: {
                userId: req.user!.id,
                schemeId,
                referenceNumber,
                notes: notes || null,
            },
            include: {
                scheme: {
                    select: { title: true, department: true, ministry: true },
                },
            },
        });

        res.status(201).json({ application });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ error: 'Failed to create application.' });
    }
});

// GET /api/applications
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const where: any = { userId: req.user!.id };
        if (status && status !== 'all') {
            where.status = status;
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where,
                include: {
                    scheme: {
                        select: { title: true, department: true, ministry: true, benefitAmount: true },
                    },
                },
                orderBy: { appliedAt: 'desc' },
                skip,
                take,
            }),
            prisma.application.count({ where }),
        ]);

        res.json({
            applications,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to get applications.' });
    }
});

// GET /api/applications/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const application = await prisma.application.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
            include: {
                scheme: true,
                complaints: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!application) {
            res.status(404).json({ error: 'Application not found.' });
            return;
        }

        res.json({ application });
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ error: 'Failed to get application.' });
    }
});

// GET /api/applications/track/:referenceNumber
router.get('/track/:referenceNumber', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const application = await prisma.application.findUnique({
            where: { referenceNumber: req.params.referenceNumber },
            include: {
                scheme: {
                    select: { title: true, department: true, ministry: true, benefitAmount: true },
                },
            },
        });

        if (!application || application.userId !== req.user!.id) {
            res.status(404).json({ error: 'Application not found.' });
            return;
        }

        res.json({ application });
    } catch (error) {
        console.error('Track application error:', error);
        res.status(500).json({ error: 'Failed to track application.' });
    }
});

export default router;

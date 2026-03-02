import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/complaints
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { applicationId, schemeId, category, subject, description, priority } = req.body;

        if (!category || !subject || !description) {
            res.status(400).json({ error: 'Category, subject, and description are required.' });
            return;
        }

        const complaint = await prisma.complaint.create({
            data: {
                userId: req.user!.id,
                applicationId: applicationId || null,
                schemeId: schemeId || null,
                category,
                subject,
                description,
                priority: priority || 'MEDIUM',
            },
            include: {
                application: {
                    select: { referenceNumber: true },
                },
                scheme: {
                    select: { title: true },
                },
            },
        });

        res.status(201).json({ complaint });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ error: 'Failed to create complaint.' });
    }
});

// GET /api/complaints
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const where: any = { userId: req.user!.id };
        if (status && status !== 'all') {
            where.status = status;
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [complaints, total] = await Promise.all([
            prisma.complaint.findMany({
                where,
                include: {
                    application: { select: { referenceNumber: true } },
                    scheme: { select: { title: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.complaint.count({ where }),
        ]);

        res.json({
            complaints,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ error: 'Failed to get complaints.' });
    }
});

// GET /api/complaints/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const complaint = await prisma.complaint.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
            include: {
                application: {
                    select: { referenceNumber: true, status: true },
                    include: { scheme: { select: { title: true } } },
                },
                scheme: { select: { title: true, department: true } },
            },
        });

        if (!complaint) {
            res.status(404).json({ error: 'Complaint not found.' });
            return;
        }

        res.json({ complaint });
    } catch (error) {
        console.error('Get complaint error:', error);
        res.status(500).json({ error: 'Failed to get complaint.' });
    }
});

export default router;

import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/schemes/gaps — All schemes ranked by total gap across all zones
router.get('/gaps', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const schemes = await prisma.ngoScheme.findMany();
        const allAnalytics = await prisma.zoneAnalytics.findMany({
            include: { zone: { select: { name: true, state: true } } },
        });

        const schemeGapMap: Record<string, { title: string; category: string; benefit: string; total_eligible: number; total_applied: number; total_gap: number; affected_zones: number; }> = {};

        schemes.forEach(s => {
            schemeGapMap[s.id] = { title: s.title, category: s.category, benefit: s.benefit, total_eligible: 0, total_applied: 0, total_gap: 0, affected_zones: 0 };
        });

        allAnalytics.forEach(a => {
            const gaps = (a.scheme_gaps as any) || {};
            Object.entries(gaps).forEach(([schemeId, data]: any) => {
                if (schemeGapMap[schemeId]) {
                    schemeGapMap[schemeId].total_eligible += data.eligible || 0;
                    schemeGapMap[schemeId].total_applied += data.applied || 0;
                    schemeGapMap[schemeId].total_gap += data.gap || 0;
                    if ((data.gap || 0) > 0) schemeGapMap[schemeId].affected_zones++;
                }
            });
        });

        const result = Object.entries(schemeGapMap)
            .map(([id, data]) => ({
                id,
                ...data,
                gap_rate_pct: data.total_eligible > 0 ? Math.round((data.total_gap / data.total_eligible) * 100) : 0,
            }))
            .sort((a, b) => b.total_gap - a.total_gap);

        res.json({ schemes: result });
    } catch (error) {
        console.error('Scheme gaps error:', error);
        res.status(500).json({ error: 'Failed to get scheme gaps.' });
    }
});

export default router;

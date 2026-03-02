import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/zones — All zones with gap analytics for the heatmap
router.get('/', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const zones = await prisma.zone.findMany({
            include: { analytics: true },
            orderBy: { state: 'asc' },
        });

        const result = zones.map(z => ({
            id: z.id,
            name: z.name,
            state: z.state,
            district: z.district,
            ward: z.ward,
            lat: z.lat,
            lng: z.lng,
            is_urban: z.is_urban,
            population_estimate: z.population_estimate,
            eligible_count: z.analytics?.eligible_count ?? 0,
            applied_count: z.analytics?.applied_count ?? 0,
            gap_count: z.analytics?.gap_count ?? 0,
            gap_rate_pct: z.analytics?.gap_rate_pct ?? 0,
            ngo_roi_score: z.analytics?.ngo_roi_score ?? 0,
            top_document_barrier: z.analytics?.top_document_barrier ?? null,
            top_scheme_gap: z.analytics?.top_scheme_gap ?? null,
        }));

        res.json({ zones: result });
    } catch (error) {
        console.error('Get zones error:', error);
        res.status(500).json({ error: 'Failed to get zones.' });
    }
});

// GET /api/zones/:id — Deep dive into one zone
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const zone = await prisma.zone.findUnique({
            where: { id: String(req.params.id) },
            include: { analytics: true },
        });

        if (!zone) { res.status(404).json({ error: 'Zone not found.' }); return; }

        res.json({
            zone: {
                ...zone,
                analytics: zone.analytics ?? null,
            }
        });
    } catch (error) {
        console.error('Get zone error:', error);
        res.status(500).json({ error: 'Failed to get zone.' });
    }
});

// GET /api/zones/:id/demographics — Profile breakdown for a zone
router.get('/:id/demographics', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profiles = await prisma.syntheticProfile.findMany({
            where: { zone_id: String(req.params.id) },
            select: { category: true, gender: true, age: true, occupation: true, education: true, annual_income: true, has_aadhaar: true, has_income_cert: true, has_caste_cert: true, has_bank_account: true },
        });

        const gaps = profiles.filter(p => {
            const applied = (p as any).applied_scheme_ids?.length ?? 0;
            const eligible = (p as any).eligible_scheme_ids?.length ?? 0;
            return eligible > 0 && applied < eligible;
        });

        const barricerCount = { no_aadhaar: 0, no_income_cert: 0, no_caste_cert: 0, no_bank_account: 0 };
        const categoryDist: Record<string, number> = {};

        profiles.forEach(p => {
            if (!p.has_aadhaar) barricerCount.no_aadhaar++;
            if (!p.has_income_cert) barricerCount.no_income_cert++;
            if (!p.has_caste_cert) barricerCount.no_caste_cert++;
            if (!p.has_bank_account) barricerCount.no_bank_account++;
            categoryDist[p.category] = (categoryDist[p.category] || 0) + 1;
        });

        res.json({
            total_profiles: profiles.length,
            gap_profiles: gaps.length,
            barrier_breakdown: barricerCount,
            category_distribution: categoryDist,
        });
    } catch (error) {
        console.error('Get demographics error:', error);
        res.status(500).json({ error: 'Failed to get demographics.' });
    }
});

// GET /api/priority-list — Top zones by NGO ROI score
router.get('/ranked/priority-list', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const analytics = await prisma.zoneAnalytics.findMany({
            include: { zone: true },
            orderBy: { ngo_roi_score: 'desc' },
            take: 15,
        });

        const result = analytics.map((a, i) => ({
            rank: i + 1,
            zone_id: a.zone_id,
            zone_name: a.zone.name,
            state: a.zone.state,
            district: a.zone.district,
            lat: a.zone.lat,
            lng: a.zone.lng,
            gap_count: a.gap_count,
            gap_rate_pct: a.gap_rate_pct,
            ngo_roi_score: a.ngo_roi_score,
            top_document_barrier: a.top_document_barrier,
            top_scheme_gap: a.top_scheme_gap,
            eligible_count: a.eligible_count,
        }));

        res.json({ zones: result });
    } catch (error) {
        console.error('Priority list error:', error);
        res.status(500).json({ error: 'Failed to get priority list.' });
    }
});

export default router;

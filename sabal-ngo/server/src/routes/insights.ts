import { Router, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// GET /api/insights/:zoneId — Gemini friction analysis for a zone
router.get('/:zoneId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const zone = await prisma.zone.findUnique({
            where: { id: String(req.params.zoneId) },
            include: { analytics: true },
        });

        if (!zone || !zone.analytics) {
            res.status(404).json({ error: 'Zone or analytics not found.' });
            return;
        }

        const a = zone.analytics;
        const barriers = (a.barrier_breakdown as any) || {};
        const schemeGaps = (a.scheme_gaps as any) || {};
        const demographics = (a.dominant_demographics as any) || {};

        const topSchemes = Object.entries(schemeGaps)
            .sort((x: any, y: any) => y[1].gap - x[1].gap)
            .slice(0, 3)
            .map(([, v]: any) => `${v.title} (gap: ${v.gap})`)
            .join(', ');

        const topBarriers = Object.entries(barriers)
            .sort((x: any, y: any) => y[1] - x[1])
            .slice(0, 3)
            .map(([k, v]: any) => `${k.replace(/_/g, ' ')}: ${v} citizens`)
            .join(', ');

        const prompt = `You are a senior social policy analyst advising Indian NGOs on last-mile scheme delivery.

ZONE DATA:
- Zone: ${zone.name}, ${zone.district}, ${zone.state}
- Total eligible citizens: ${a.eligible_count}
- Total who have applied: ${a.applied_count}
- Unserved gap: ${a.gap_count} citizens (${a.gap_rate_pct.toFixed(1)}% gap rate)
- Top schemes with gaps: ${topSchemes || 'None recorded'}
- Primary document barriers: ${topBarriers || 'None recorded'}
- Dominant demographic: ${demographics.category || 'Mixed'}, ${demographics.gender || 'Mixed'}, ${demographics.occupation || 'Mixed'}, age ${demographics.age_group || 'mixed'}
- Zone type: ${zone.is_urban ? 'Urban' : 'Rural'}

TASK:
Write a concise 180-word Field Intelligence Brief for an NGO field coordinator. Structure it as:
1. SITUATION (2 sentences): What the data shows about this zone.
2. ROOT CAUSE (2 sentences): Why people aren't applying — focus on the document and demographic patterns.
3. ACTION PLAN (3 bullet points): Specific, practical NGO interventions for this zone.

Be direct and actionable. Use plain language a field worker can act on immediately.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const narrative = result.response.text().trim();

        // Cache the narrative in the database
        await prisma.zoneAnalytics.update({
            where: { zone_id: zone.id },
            data: { ai_narrative: narrative, computed_at: new Date() },
        });

        res.json({
            zone_id: zone.id,
            zone_name: zone.name,
            state: zone.state,
            narrative,
            gap_count: a.gap_count,
            gap_rate_pct: a.gap_rate_pct,
        });
    } catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({ error: 'Failed to generate insight.' });
    }
});

export default router;

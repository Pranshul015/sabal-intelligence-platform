import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                age: true,
                gender: true,
                state: true,
                district: true,
                category: true,
                annualIncome: true,
                occupation: true,
                education: true,
                aadhaarNumber: true,
                panNumber: true,
                bankAccountNo: true,
                bankIfsc: true,
                profileCompletion: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile.' });
    }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const allowedFields = [
            'fullName', 'phone', 'age', 'gender', 'state', 'district',
            'category', 'annualIncome', 'occupation', 'education',
            'aadhaarNumber', 'panNumber', 'bankAccountNo', 'bankIfsc',
        ];

        const updateData: any = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (field === 'age') {
                    updateData[field] = parseInt(req.body[field]) || null;
                } else if (field === 'annualIncome') {
                    updateData[field] = parseFloat(req.body[field]) || null;
                } else {
                    updateData[field] = req.body[field];
                }
            }
        }

        // Calculate profile completion
        const currentUser = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (currentUser) {
            const merged = { ...currentUser, ...updateData };
            const fields = ['fullName', 'phone', 'age', 'gender', 'state', 'district',
                'category', 'annualIncome', 'occupation', 'education'];
            const filled = fields.filter(f => (merged as any)[f] !== null && (merged as any)[f] !== '').length;
            updateData.profileCompletion = Math.round((filled / fields.length) * 100);
        }

        const user = await prisma.user.update({
            where: { id: req.user!.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                age: true,
                gender: true,
                state: true,
                district: true,
                category: true,
                annualIncome: true,
                occupation: true,
                education: true,
                aadhaarNumber: true,
                panNumber: true,
                bankAccountNo: true,
                bankIfsc: true,
                profileCompletion: true,
                updatedAt: true,
            },
        });

        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// GET /api/users/eligible-schemes
router.get('/eligible-schemes', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        // Profile completeness gate: require at least 2 key eligibility fields to be filled
        // before showing any matched schemes. This prevents a blank profile from matching all schemes.
        const keyFields = [user.age, user.state, user.annualIncome, user.category, user.gender];
        const filledKeyFields = keyFields.filter(f => f !== null && f !== undefined && f !== '').length;

        if (filledKeyFields < 2) {
            res.json({ schemes: [], profileIncomplete: true });
            return;
        }

        const allSchemes = await prisma.scheme.findMany({ where: { isActive: true } });

        const matchedSchemes = allSchemes.map((scheme) => {
            let score = 0;
            let maxScore = 0;
            const metCriteria: string[] = [];
            const pendingCriteria: string[] = [];

            // State match
            maxScore += 20;
            if (scheme.state === 'All India') {
                score += 20;
                metCriteria.push('Available across India');
            } else if (user.state && scheme.state.toLowerCase() === user.state.toLowerCase()) {
                score += 20;
                metCriteria.push(`Resident of ${scheme.state}`);
            } else if (user.state) {
                pendingCriteria.push(`Requires residency in ${scheme.state}`);
            } else {
                pendingCriteria.push('State information needed');
            }

            // Age match
            if (scheme.minAge || scheme.maxAge) {
                maxScore += 20;
                if (user.age) {
                    const ageOk = (!scheme.minAge || user.age >= scheme.minAge) &&
                        (!scheme.maxAge || user.age <= scheme.maxAge);
                    if (ageOk) {
                        score += 20;
                        metCriteria.push('Age criteria met');
                    } else {
                        pendingCriteria.push(`Age must be ${scheme.minAge || 0}-${scheme.maxAge || '∞'}`);
                    }
                } else {
                    pendingCriteria.push('Age information needed');
                }
            }

            // Income match
            if (scheme.maxIncome) {
                maxScore += 25;
                if (user.annualIncome !== null && user.annualIncome !== undefined) {
                    if (user.annualIncome <= scheme.maxIncome) {
                        score += 25;
                        metCriteria.push('Income criteria met');
                    } else {
                        pendingCriteria.push(`Income must be below ₹${(scheme.maxIncome / 100000).toFixed(1)} Lakh`);
                    }
                } else {
                    pendingCriteria.push('Income information needed');
                }
            }

            // Gender match
            if (scheme.genderReq && scheme.genderReq !== 'All') {
                maxScore += 15;
                if (user.gender) {
                    if (user.gender.toLowerCase() === scheme.genderReq.toLowerCase()) {
                        score += 15;
                        metCriteria.push('Gender criteria met');
                    } else {
                        pendingCriteria.push(`Only for ${scheme.genderReq}`);
                    }
                } else {
                    pendingCriteria.push('Gender information needed');
                }
            }

            // Category match
            if (scheme.categoryReq && scheme.categoryReq.length > 0) {
                maxScore += 20;
                if (user.category) {
                    if (scheme.categoryReq.some(c => c.toLowerCase() === user.category!.toLowerCase())) {
                        score += 20;
                        metCriteria.push('Category criteria met');
                    } else {
                        pendingCriteria.push(`Requires ${scheme.categoryReq.join('/')}`);
                    }
                } else {
                    pendingCriteria.push('Category information needed');
                }
            }

            // Base score for general schemes
            if (maxScore === 20) { // Only state was checked
                maxScore = 100;
                score = scheme.state === 'All India' || (user.state && scheme.state.toLowerCase() === user.state.toLowerCase()) ? 70 : 30;
            }

            const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
            const matchCategory = matchPercentage >= 80 ? 'excellent' : matchPercentage >= 50 ? 'good' : 'fair';

            return {
                ...scheme,
                matchPercentage,
                matchCategory,
                eligibilityMet: metCriteria,
                eligibilityPending: pendingCriteria,
            };
        });

        // Sort by match percentage
        matchedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json({ schemes: matchedSchemes });
    } catch (error) {
        console.error('Eligible schemes error:', error);
        res.status(500).json({ error: 'Failed to get eligible schemes.' });
    }
});

export default router;

import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, phone } = req.body;

        if (!email || !password || !fullName) {
            res.status(400).json({ error: 'Email, password, and full name are required.' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: 'Email already registered.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                phone: phone || null,
                profileCompletion: 10,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                profileCompletion: true,
                createdAt: true,
            },
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed.' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
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
                profileCompletion: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to get user info.' });
    }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current password and new password are required.' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters.' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Current password is incorrect.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: req.user!.id },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password.' });
    }
});

// DELETE /api/auth/account
router.delete('/account', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Delete all user data (Prisma cascades will handle related records)
        await prisma.complaint.deleteMany({ where: { userId: req.user!.id } });
        await prisma.application.deleteMany({ where: { userId: req.user!.id } });
        await prisma.document.deleteMany({ where: { userId: req.user!.id } });
        await prisma.user.delete({ where: { id: req.user!.id } });

        res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account.' });
    }
});

export default router;


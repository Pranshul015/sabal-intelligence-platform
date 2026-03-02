import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/auth/register (admin setup only)
router.post('/register', async (req, res: Response): Promise<void> => {
    try {
        const { email, password, organization } = req.body;
        if (!email || !password || !organization) {
            res.status(400).json({ error: 'email, password, and organization are required.' });
            return;
        }
        const existing = await prisma.ngoUser.findUnique({ where: { email } });
        if (existing) { res.status(409).json({ error: 'Email already registered.' }); return; }

        const hashed = await bcrypt.hash(password, 12);
        const user = await prisma.ngoUser.create({ data: { email, password: hashed, organization } });
        const token = jwt.sign(
            { id: user.id, email: user.email, organization: user.organization },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        res.status(201).json({ token, user: { id: user.id, email: user.email, organization: user.organization } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await prisma.ngoUser.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, organization: user.organization },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user.id, email: user.email, organization: user.organization } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed.' });
    }
});

export default router;

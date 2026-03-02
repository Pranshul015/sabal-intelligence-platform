import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        fullName: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
            userId: string;
            email: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, fullName: true },
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid token. User not found.' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
                userId: string;
                email: string;
            };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, fullName: true },
            });

            if (user) {
                req.user = user;
            }
        }
    } catch {
        // Silently ignore invalid tokens for optional auth
    }
    next();
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import zoneRoutes from './routes/zones';
import insightRoutes from './routes/insights';
import schemeRoutes from './routes/schemes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/schemes', schemeRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', platform: 'Sabal NGO', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🛰️  Sabal NGO API running on http://localhost:${PORT}`);
});

export default app;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import subscriptionRoutes from './routes/subscriptionRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', subscriptionRoutes);

export default app;

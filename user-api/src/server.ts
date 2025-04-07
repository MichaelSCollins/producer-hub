import express from 'express';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();
// Configure CORS
app.use(cors({
    origin: '*', // Replace with the allowed origin(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
}));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use((req, res, next) => {
    console.log(`[user-api] Incoming request: ${req.method} ${req.originalUrl}`);
    console.log(`[user-api] Request Body: ${JSON.stringify(req.body)}`);
    next();
});

// Register routes
app.use('/api/users', userRoutes);

const PORT = 7777;
app.listen(PORT, () => {
    console.log(`user-api is running on http://localhost:${PORT}`);
});


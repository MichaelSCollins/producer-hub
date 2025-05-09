import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoDB } from './lib/db/mongo';
import userRoutes from './routes/userRoutes';
import corsConfig from './lib/auth/cors.config.';

const app = express();
const PORT = 7777;

// Middleware
app.use(bodyParser.json());
// Configure CORS
app.use(corsConfig);

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
MongoDB.connect().catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
}).then(() => {
    console.log('�� Connected to MongoDB');
});;


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

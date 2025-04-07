import { Express } from 'express';
import cors from 'cors';
const initCors = (app: Express) => {
    // Initialize middleware
    // app.use(helmet()); // Security middleware to set various HTTP headers
    // Configure CORS
    app.use(cors({
        origin: '*', // Replace with the allowed origin(s)
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    }));
}

export default initCors;
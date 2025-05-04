import { Express } from 'express';
import cors from 'cors';
import State from '../state';
const applyCors = () => {
    // Initialize middleware
    // app.use(helmet()); // Security middleware to set various HTTP headers
    // Configure CORS
    State.app.use(cors({
        origin: '*', // Replace with the allowed origin(s)
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    }));
}

export default applyCors;
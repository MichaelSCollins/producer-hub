import cors from 'cors';
import express from 'express';
class SecurityBuilder {
    protected app = express();
    constructor() {
    }
    buildSecurity() {
        // Initialize middleware
        // this.app.use(helmet()); // Security middleware to set various HTTP headers
        // Configure CORS
        this.app.use(cors({
            origin: '*', // Replace with the allowed origin(s)
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        }));
        return this;
    }
}

export default SecurityBuilder;
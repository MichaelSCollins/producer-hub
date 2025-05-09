import cors from 'cors';

function apply(app) {
    // Initialize middleware
    // this.app.use(helmet()); // Security middleware to set various HTTP headers
    // Configure CORS
    app.use(cors({
        origin: '*', // Replace with the allowed origin(s)
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    }));
}

export default {
    apply
};
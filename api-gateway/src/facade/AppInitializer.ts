import { Express } from 'express';
import useMiddleware from '../middleware/init';
import useRouter from '../routes/router';
import useCors from '../middleware/cors';
import useHealthCheckRoute, { healthCheck } from '../middleware/healthcheck';
import useProxies from '../proxy/proxy';
class ApiGatewayInitializer {
    static instance: ApiGatewayInitializer; // Singleton instance
    static getInstance(app: Express): ApiGatewayInitializer {
        if (!ApiGatewayInitializer.instance)
        {
            ApiGatewayInitializer.instance = new ApiGatewayInitializer(app);
        }
        return ApiGatewayInitializer.instance;
    }
    static initialize(app: Express) {
        const instance = ApiGatewayInitializer.getInstance(app);
        instance.initialize();
    }
    // Express app instance

    app: Express;
    constructor(app: Express) {
        this.app = app;
    }
    initialize() {
        // Proxies
        useProxies(this.app); // Setup proxy routes
        // Middleware // Parse JSON bodies
        useHealthCheckRoute(this.app); // Health check route
        useMiddleware(this.app);
        useCors(this.app);
        // Routes
        useRouter(this.app); // User routes
    }

}

export default ApiGatewayInitializer;
import express from 'express';
import UserController from '../controllers/user';
import routeProxies from '../proxy/proxy';
import { healthCheck } from './healthcheck';
const router = express.Router();
class AppRouter {
    static route = (app) => {
        // healthCheck(); // Health check route
        // Proxies
        routeProxies(); // Setup proxy routes

        // router.post('/login', UserController.login);
        // router.post('/logout', UserController.logout)
        app.use('/api', router);
    }
}

export default AppRouter;
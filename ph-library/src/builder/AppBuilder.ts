import express from 'express';
import MiddlewareBuilder from './MiddlewareBuilder';
import AppRouter from '../../routes/router';

class AppBuilder extends MiddlewareBuilder {
    static instance: AppBuilder; // Singleton instance
    static app = express(); // Express app instance
    static getInstance(): AppBuilder {
        if (!AppBuilder.instance)
        {
            AppBuilder.instance = new AppBuilder();
        }
        return AppBuilder.instance;
    }
    static initialize() {
        const instance = AppBuilder.getInstance();
        return instance;
    }
    buildRouting() {
        // Routes
        AppRouter.route(this.app) // User routes
        return this;
    }
    build() {
        return AppBuilder.app; // Return the Express app instance
    }
}

export default AppBuilder;
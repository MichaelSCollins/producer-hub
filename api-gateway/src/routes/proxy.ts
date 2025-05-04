import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const routes = [
    { route: '/api/payment', target: 'http://localhost:8000' }, // Replace with actual payment-api URL
    { route: '/api/users', target: 'http://localhost:7777' }, // Replace with actual user-api URL
    { route: '/api/subscribe', target: 'http://localhost:4444' }, // Replace with actual payment-api URL
];

export const setupProxies = (app: Application) => {
    routes.forEach(({ route, target }) => {
        console.log(`[API Gateway] Proxying ${route} -> ${target}`);
        app.use(
            route,
            createProxyMiddleware({
                target,
                changeOrigin: true,
                pathRewrite: {
                    [`^${route}`]: '', // Remove the route prefix before forwarding
                },
                logLevel: 'debug',
            })
        );
    });
};

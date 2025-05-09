// proxy.ts
import { Application } from 'express';
import ProxyFactory from "../lib/factory/ProxyFactory";
import { routes } from "../config/proxy.config";

export const proxyApp = (app: Application): void => {
    for (const { route, target } of routes)
    {
        const proxyMiddleware = ProxyFactory.createProxyMiddleware(target);
        app.use(route, proxyMiddleware);
    }
};

export default proxyApp;

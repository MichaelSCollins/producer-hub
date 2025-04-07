import { Express, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';


type ProxyServices = { [route: string]: string };
const services: ProxyServices = {}; // Define your services here

const validateJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try
    {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        req.headers['authorization'] = `Bearer ${token}`;
        next();
    } catch
    {
        res.status(403).json({ error: 'Token expired or invalid' });
    }
};

export const setupProxies = (app: Express) => {
    for (const [route, target] of Object.entries(services))
    {
        app.use(route, validateJwt, createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^${route}`]: '' },
        }));
    }
};
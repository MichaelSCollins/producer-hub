import { Request, Response, NextFunction } from 'express';
import State from '../state';
const initializeProxyLogger = () =>
    State.app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[API Gateway] Incoming request: ${req.method} -> ${req.originalUrl}`);
        console.log(`[API Gateway] Request Body: ${JSON.stringify(req.body)}`);
        console.log(`[API Gateway] Request Headers: ${JSON.stringify(req.headers)}`);
        // Log the request headers
        if (req.cookies) console.log(`[API Gateway] Request Cookies: ${JSON.stringify(req.cookies)}`);
        if (req.query) console.log(`[API Gateway] Request Query: ${JSON.stringify(req.query)}`);
        if (req.params) console.log(`[API Gateway] Request Params: ${JSON.stringify(req.params)}`);
        next();
    });

export default initializeProxyLogger;
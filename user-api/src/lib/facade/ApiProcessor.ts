import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../auth/auth.config';

// Middleware to validate JWT token
export const authenticateToken = (req: Request, res: Response): boolean => {
    if (!req.cookies)
    {
        return false;
    }
    const token = req.cookies?.token;
    if (!token)
    {
        return false;
    }
    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.cookies.user = decoded
        return true;
    } catch (err)
    {
        res.status(403).json({ message: 'Invalid token.' });
        return false
    }
};


class APIJob<T> {
    req!: Request;
    res!: Response;

    run!: (req: Request, res: Response) => Promise<T>;
    error: (err: any) => void = (err: any) =>
        this.res.status(500).json({
            error: err.message
        });
    success: (data: T) => void = (data: T) =>
        this.res.status(200).json(data);

    onError(callback: (err: any) => void) {
        this.error = callback;
        return this;
    }
    onSuccess(callback: (data: T) => void) {
        this.success = callback;
        return this;
    }
    setReq(req: Request, res: Response) {
        this.req = req
        this.res = res;
        return this;
    }
    buisinessLogic(callback: () => Promise<T>) {
        this.run = callback
        return this
    }
    async process(req: Request, res: Response): Promise<any> {
        // Perform API job
        console.log('API job executed');
        return await this
            .setReq(req, res)
            .run(req, res)
            .then(this.success)
            .catch(this.error)
    }
}

class AuthAPIJob<T> extends APIJob<T> {
    unauthorized: () => void = () =>
        this.res.status(401).json({
            message: 'Invalid credentials'
        });
    auth: (req: Request, res: Response, next: any) => void =
        (req: Request, res: Response, next) =>
            authenticateToken(req, res)
                ? next(res, req)
                : this.unauthorized();
    override async process(req: Request, res: Response): Promise<void> {
        // if (!authenticateToken(req, res))
        // {
        //     this.unauthorized();
        //     return;
        // }
        try
        {
            super.process(req, res)
        } catch (err: any)
        {
            console.error(
                'API job encountered an error:',
                err.message
            );
            this.error(err);
        }
    }
}

export default AuthAPIJob
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

    task!: (req: Request, res: Response) => Promise<T>;
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
    setRequest(request: Request) {
        this.req = request;
        return this;
    }
    setResponse(response: Response) {
        this.res = response;
        return this;
    }
    setTask(callback: () => Promise<T>) {
        this.task = callback
        return this
    }
    async execute(req: Request, res: Response): Promise<any> {
        // Perform API job
        console.log('API job executed');
        return await this.task(req, res)
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
    override async execute(req: Request, res: Response): Promise<void> {
        // if (!authenticateToken(req, res))
        // {
        //     this.unauthorized();
        //     return;
        // }
        try
        {
            super.execute(req, res)
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
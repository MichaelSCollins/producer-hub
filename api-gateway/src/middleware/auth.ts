import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const USER_API = 'http://localhost:7777/api/users';

// export const loginHandler;

export const refreshTokenHandler = (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Missing refresh token' });

    try
    {
        const payload = jwt.verify(token, REFRESH_SECRET) as any;
        const newAccess = jwt.sign({ userId: payload.userId }, ACCESS_SECRET, { expiresIn: '15m' });

        res.cookie('jwt', newAccess, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ success: true });
    } catch (err)
    {
        console.error('Refresh failed', err);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};

// Middleware: Attach JWT from cookie to Authorization header
export const attachJwtFromCookie = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token)
    {
        req.headers['authorization'] = `Bearer ${token}`;
    }
    next();
};

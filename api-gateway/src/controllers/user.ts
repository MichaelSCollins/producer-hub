import axios from 'axios';
import { Request, Response } from 'express';

class UserController {
    static async login(req: Request, res: Response) {
        try
        {
            const url = `${process.env.USER_API}/login`
            const userUrl = `${process.env.USER_API}/user`
            console.log('Login request:', { url, body: req.body });
            const response = await axios.post(url, req.body);
            const userRes = await axios.post(userUrl);
            const { token, refreshToken } = response.data;
            console.log('Login response:', { status: response.status, data: response.data });
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000, // 15 mins
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.cookie('userId', userRes.data.id ?? userRes.data._id, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({ success: true });
        } catch (err: (unknown | Error))
        {
            if (err instanceof Error)
            {
                console.error('Login failed', err.message);
            } else
            {
                console.error('Login failed', err);
            }
            res.status(401).json({ error: 'Login failed' });
        }
    }
    static async logout(req: Request, res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true });
    };
}

export default UserController;
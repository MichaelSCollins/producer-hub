import axios from 'axios';
import { Request, Response } from 'express';

class UserController {
    static async login(req: Request, res: Response) {
        console.log("gateway login", req.body)
        try
        {
            const url = `${process.env.USER_API}/login`
            // const userUrl = `${process.env.USER_API}/user`
            console.log('Login request:', { url, body: req.body });
            const response = await axios.post(url, req.body)
            // const userRes = await axios.post(userUrl);
            console.log('Login response:', response);
            if (!response?.data)
            {
                res.sendStatus(500).json({ message: 'Response data not fonud.' })
            } else
            {
                const { token, refreshToken } = response.data;
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
                // res.cookie('userId', userRes.data.id ?? userRes.data._id, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: 'lax',
                //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                // });
                res.status(200).json({ success: true });
            }
        } catch (err)
        {
            console.error("Error occured while calling user-api", err)
            const status = err?.status || 500;
            const message = err?.message || 'Login failed';
            res.status(status).json({ success: false, message });
        }
    }
    static async logout(req: Request, res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true });
    };
}

export default UserController;
import express, { Express } from 'express';
import { logoutHandler } from '../middleware/auth'
const USER_API = 'http://localhost:7777/api/users';
import axios from 'axios';
import { Request } from 'express';
const router = express.Router();

const useRouter = (app: Express) => {

    router.post('/login', async (req, res) => {
        try
        {
            const url = `${USER_API}/login`
            const userUrl = `${USER_API}/user`
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
        } catch (err: any)
        {
            console.error('Login failed', err.message);
            res.status(401).json({ error: 'Login failed' });
        }
    })
    router.post('/logout', logoutHandler)
    app.use('/api', router);
}

export default useRouter
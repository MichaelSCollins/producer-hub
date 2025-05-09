import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import ApiProcess from '../lib/facade/ApiProcessor';
import { JWT_SECRET } from '../lib/auth/auth.config';

const apiProcess = new ApiProcess();

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
    return await apiProcess
        .buisinessLogic(async () => {
            const { username, password } = req.body;
            if (!username || !password)
            {
                res.status(400).json({ message: 'Username and password are required' });
                throw "Invalid: " + JSON.stringify({ username, password })
            }
            const user = await UserService.registerUser(username, password);
            res.status(201).json({ message: 'User registered successfully', user });
        })
        .process(req, res);
};

// Login a user
export const login = async (req: Request, res: Response): Promise<void> => {
    apiProcess
        .buisinessLogic(async () => {
            const { username, password } = req.body;
            if (!username || !password)
            {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }
            let user;
            try
            {
                console.log("Authenticating user...")
                user = await UserService.authenticateUser(
                    username,
                    password
                );
                console.log("User: ", user)
            } catch (e: any)
            {
                res.status(500).json({
                    message: 'Internal server error: ' + e.message || 'Unknown error',
                });
                return
            }

            const token = jwt.sign({ username: user?.username }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ message: 'Login successful', token });
        })
        .process(req, res);
};

// Update user settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    return await apiProcess.buisinessLogic(async () => {
        const { settings } = req.body;
        const user = await UserService.updateUserSettings(req.body.username, settings);
        if (!user)
        {
            res.status(500).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Settings updated successfully', user });
    }).process(req, res);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    console.log("getUser")
    return await apiProcess
        .buisinessLogic(async () => {
            const user = await UserService.getUser(req);
            res.status(200).json({ user });
        })
        .process(req, res);
};

// Search for users
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    return await apiProcess
        .buisinessLogic(async () => {
            const { query } = req.query;
            const users = await UserService.searchUsers(query as string);
            res.status(200).json(users);
        })
        .process(req, res);
};
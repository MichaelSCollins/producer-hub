import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import ApiProcessor from '../lib/facade/ApiProcessor';
import { JWT_SECRET } from '../lib/auth/auth.config';

const processor = new ApiProcessor();

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
    return await processor.setRequest(req)
        .setResponse(res)
        .setTask(async () => {
            const { username, password } = req.body;
            if (!username || !password)
            {
                res.status(400).json({ message: 'Username and password are required' });
                throw "Invalid: " + JSON.stringify({ username, password })
            }
            const user = await UserService.registerUser(username, password);
            res.status(201).json({ message: 'User registered successfully', user });
        })
        .execute(req, res);
};

// Login a user
export const login = async (req: Request, res: Response): Promise<void> => {
    return await processor.setRequest(req)
        .setResponse(res)
        .setTask(async () => {
            const { username, password } = req.body;
            if (!username || !password)
            {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }
            const user = await UserService.authenticateUser(username, password);
            if (!user)
            {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ message: 'Login successful', token });
        })
        .execute(req, res);
};

// Update user settings
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    return await processor.setRequest(req)
        .setResponse(res)
        .setTask(async () => {
            const { settings } = req.body;
            const user = await UserService.updateUserSettings(req.body.username, settings);
            if (!user)
            {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'Settings updated successfully', user });
        })
        .execute(req, res);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    console.log("getUser")
    return await processor.setRequest(req)
        .setResponse(res)
        .setTask(async () => {
            const user = await UserService.getUser(req);
            res.status(200).json({ user });
        })
        .execute(req, res);
};

// Search for users
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    return await processor.setRequest(req)
        .setResponse(res)
        .setTask(async () => {
            const { query } = req.query;
            const users = await UserService.searchUsers(query as string);
            res.status(200).json(users);
        })
        .execute(req, res);
};
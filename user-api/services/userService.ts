import { User, IUser } from '../models/User';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken module
export class UserService {
    static async registerUser(username: string, password: string): Promise<IUser> {
        const user = new User({ username, password });
        return await user.save();
    }

    static async authenticateUser(username: string, password: string): Promise<IUser | null> {
        return await User.findOne({ username, password });
    }

    static async updateUserSettings(username: string, settings: Record<string, any>): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            { username },
            { settings },
            { new: true }
        );
    }

    static async searchUsers(query: string): Promise<IUser[]> {
        return await User.find({ username: { $regex: query || '', $options: 'i' } }, 'username settings');
    }

    static getToken(req: Request): string {
        try
        {
            const token = req.cookies?.token; // Retrieve the HTTP-only token from cookies
            if (!token)
            {
                const notFoundMessage = 'Token not found'
                throw Error(notFoundMessage)
            }
            return token
        } catch (error)
        {
            const errorMessage = 'Error retrieving token: ' + error
            console.error(errorMessage, error);
            throw errorMessage
        }
    }

    // ... previous code remains the same
    static async getUser(req: Request): Promise<any> {
        try
        {
            const token = req.cookies?.token; // Retrieve the HTTP-only token from cookies
            console.log("API token")
            if (!token)
            {
                console.error('Token not found');
                throw 'Token not found'
            }

            const secretKey = process.env.JWT_SECRET || 'defaultSecret'; // Replace with your actual secret key
            const decoded: any = jwt.verify(token, secretKey); // Decode the token to get user info

            const user = await User.findById(decoded.userId); // Fetch user info from the database
            if (!user)
            {
                throw 'User not found'
            }

            return user;
        } catch (error: any)
        {
            console.error('Error retrieving user:', error.message);
            throw 'Internal server error'
        }
    }

}

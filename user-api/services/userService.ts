import { User, IUser } from '../models/User';

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
}

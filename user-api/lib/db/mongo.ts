import mongoose from 'mongoose';

export class MongoDB {
    private static connection: typeof mongoose | null = null;

    static async connect(): Promise<void> {
        if (!this.connection)
        {
            try
            {
                const uri = 'mongodb+srv://codebigthings:4friends@cluster0.oxz1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'; // Replace with your MongoDB URI
                const options = {
                    autoCreate: true,
                }
                mongoose.set('debug', true); // Enable debug mode to log queries
                this.logMongoEvents();
                this.connection = await mongoose.connect(uri, options as any);
                console.log('Connected to MongoDB');
            } catch (error)
            {
                console.error('Error connecting to MongoDB:', error);
                throw error;
            }
        }
    }

    static async ensureConnection(): Promise<void> {
        if (!this.connection || mongoose.connection.readyState !== 1)
        { // 1 = connected
            console.warn('MongoDB connection lost. Reconnecting...');
            await this.connect();
        }
    }
    static logMongoEvents() {
        mongoose.connection.on('connected', () => {
            console.log('✅ Connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });
    }
    static async closeConnection(): Promise<void> {
        if (this.connection)
        {
            try
            {
                await mongoose.disconnect();
                this.connection = null;
                console.log('MongoDB connection closed');
            } catch (error)
            {
                console.error('Error closing MongoDB connection:', error);
                throw error;
            }
        }
    }
}

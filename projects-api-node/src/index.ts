import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ProjectController } from './controllers/ProjectController.js';
import { Project } from './models/Project.js';
import { Channel } from './models/Channel.js';
import { Effect } from './models/Effect.js';
import { Track } from './models/Track.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 8082;

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3003'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-User-Id'],
    exposedHeaders: ['X-User-Id']
}));
app.use(express.json());

// Database connection
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    synchronize: true, // Enable auto-synchronization in development
    logging: process.env.NODE_ENV !== 'production',
    entities: [Project, Channel, Effect, Track],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/**/*.ts']
});

// Routes
const projectController = new ProjectController();
app.use('/api/projects', projectController.router);

// Start server
AppDataSource.initialize()
    .then(async () => {
        console.log('Database connection established');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(
            `(${port}:${process.env.DB_NAME || 'postgres'}) Error connecting to the database:`, error
        );
    }); 
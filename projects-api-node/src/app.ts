import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ProjectController } from './controllers/ProjectController.js';

const app = express();
const projectController = new ProjectController();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectController.router);

export { app }; 
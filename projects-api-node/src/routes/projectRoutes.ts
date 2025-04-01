import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController.js';

const router = Router();
const projectController = new ProjectController();

// Project routes
router.get('/', projectController.getProjectsByUser);
router.get('/:id', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export { router as projectRoutes }; 
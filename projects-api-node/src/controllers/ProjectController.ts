import { Router } from 'express';
import { ProjectService } from '../services/ProjectService.js';
import { CreateProjectRequest, UpdateProjectRequest } from '../dtos/ProjectDto.js';
import { CreateChannelRequest, UpdateChannelRequest } from '../dtos/ChannelDto.js';
import { CreateTrackRequest, UpdateTrackRequest } from '../dtos/TrackDto.js';
import { validateRequest } from '../middleware/validateRequest.js';

export class ProjectController {
    public router: Router;
    private projectService: ProjectService;

    constructor() {
        this.router = Router();
        this.projectService = new ProjectService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Project routes
        this.router.post('/create', validateRequest(CreateProjectRequest), this.createProject.bind(this));
        this.router.get('/:id', this.getProject.bind(this));
        this.router.get('/', this.getProjectsByUser.bind(this));
        this.router.put('/:id', validateRequest(UpdateProjectRequest), this.updateProject.bind(this));
        this.router.delete('/:id', this.deleteProject.bind(this));

        // Channel routes
        this.router.post('/:projectId/channels', validateRequest(CreateChannelRequest), this.addChannel.bind(this));
        this.router.put('/:projectId/channels/:channelId', validateRequest(UpdateChannelRequest), this.updateChannel.bind(this));
        this.router.delete('/:projectId/channels/:channelId', this.deleteChannel.bind(this));

        // Track routes
        this.router.post('/:projectId/channels/:channelId/tracks', validateRequest(CreateTrackRequest), this.createTrack.bind(this));
        this.router.put('/:projectId/channels/:channelId/tracks/:trackId', validateRequest(UpdateTrackRequest), this.updateTrack.bind(this));
        this.router.delete('/:projectId/channels/:channelId/tracks/:trackId', this.deleteTrack.bind(this));
    }

    public async createProject(req: any, res: any): Promise<void> {
        try
        {
            console.log('ProjectController - Creating project with body:', JSON.stringify(req.body, null, 2));
            console.log('ProjectController - User ID from headers:', req.headers['x-user-id']);
            const project = await this.projectService.createProject(req.body, req.headers['x-user-id']);
            console.log('ProjectController - Project created successfully:', JSON.stringify(project, null, 2));
            res.status(201).json(project);
        } catch (error: any)
        {
            console.error('ProjectController - Error creating project:', error);
            res.status(500).json({ error: error.message });
        }
    }

    public async getProject(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.getProject(parseInt(req.params.id));
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async getProjectsByUser(req: any, res: any): Promise<void> {
        try
        {
            const projects = await this.projectService.getProjectsByUser(req.headers['x-user-id']);
            res.json(projects);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async updateProject(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.updateProject(parseInt(req.params.id), req.body);
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async deleteProject(req: any, res: any): Promise<void> {
        try
        {
            await this.projectService.deleteProject(parseInt(req.params.id));
            res.status(204).send();
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async addChannel(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.addChannel(parseInt(req.params.projectId), req.body);
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async updateChannel(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.updateChannel(
                parseInt(req.params.projectId),
                parseInt(req.params.channelId),
                req.body
            );
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async deleteChannel(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.deleteChannel(
                parseInt(req.params.projectId),
                parseInt(req.params.channelId)
            );
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async createTrack(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.createTrack(
                parseInt(req.params.projectId),
                parseInt(req.params.channelId),
                req.body
            );
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async updateTrack(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.updateTrack(
                parseInt(req.params.projectId),
                parseInt(req.params.channelId),
                parseInt(req.params.trackId),
                req.body
            );
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }

    public async deleteTrack(req: any, res: any): Promise<void> {
        try
        {
            const project = await this.projectService.deleteTrack(
                parseInt(req.params.projectId),
                parseInt(req.params.channelId),
                parseInt(req.params.trackId)
            );
            res.json(project);
        } catch (error: any)
        {
            res.status(500).json({ error: error.message });
        }
    }
} 
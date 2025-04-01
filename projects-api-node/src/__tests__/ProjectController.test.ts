import request from 'supertest';
import express from 'express';
import { ProjectController } from '../controllers/ProjectController.js';
import { TestDataSource, setup, teardown } from '../test/setup.js';
import { Project } from '../models/Project.js';
import { Channel } from '../models/Channel.js';
import { Track } from '../models/Track.js';

describe('ProjectController', () => {
    let app: express.Application;
    let projectController: ProjectController;

    beforeAll(async () => {
        await setup();
        app = express();
        app.use(express.json());
        projectController = new ProjectController();
        app.use('/api/projects', projectController.router);
    });

    afterAll(async () => {
        await teardown();
    });

    beforeEach(async () => {
        // Clear the database before each test
        await TestDataSource.getRepository(Track).clear();
        await TestDataSource.getRepository(Channel).clear();
        await TestDataSource.getRepository(Project).clear();
    });

    describe('GET /api/projects', () => {
        it('should return all projects for a user', async () => {
            const response = await request(app)
                .get('/api/projects')
                .set('x-user-id', 'test-user');
            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/projects/create', () => {
        it('should create a new project', async () => {
            const projectData = {
                name: 'Test Project',
                bpm: 120,
                quantizeDivision: '1/4',
                masterVolume: 0.8,
                masterMuted: false
            };
            const response = await request(app)
                .post('/api/projects/create')
                .set('x-user-id', 'test-user')
                .send(projectData);
            expect(response.status).toBe(201);
        });
    });

    describe('GET /api/projects/:id', () => {
        it('should return a project by id', async () => {
            const response = await request(app)
                .get('/api/projects/1');
            expect(response.status).toBe(200);
        });
    });

    describe('PUT /api/projects/:id', () => {
        it('should update a project', async () => {
            const updateData = {
                name: 'Updated Project',
                bpm: 140
            };
            const response = await request(app)
                .put('/api/projects/1')
                .send(updateData);
            expect(response.status).toBe(200);
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete a project', async () => {
            const response = await request(app)
                .delete('/api/projects/1');
            expect(response.status).toBe(204);
        });
    });
}); 
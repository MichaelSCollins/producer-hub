import { Repository } from 'typeorm';
import { Project } from '../models/Project.js';
import { Channel } from '../models/Channel.js';
import { Track } from '../models/Track.js';
import { CreateProjectRequest, UpdateProjectRequest } from '../dtos/ProjectDto.js';
import { CreateChannelRequest, UpdateChannelRequest } from '../dtos/ChannelDto.js';
import { CreateTrackRequest, UpdateTrackRequest } from '../dtos/TrackDto.js';
import { AppDataSource } from '../index.js';

export class ProjectService {
    private projectRepository: Repository<Project>;
    private channelRepository: Repository<Channel>;
    private trackRepository: Repository<Track>;

    constructor() {
        this.projectRepository = AppDataSource.getRepository(Project);
        this.channelRepository = AppDataSource.getRepository(Channel);
        this.trackRepository = AppDataSource.getRepository(Track);
    }

    async createProject(data: CreateProjectRequest, userId: string): Promise<Project> {
        const project = this.projectRepository.create({
            ...data,
            createdBy: userId
        });
        return await this.projectRepository.save(project);
    }

    async getProject(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['channels', 'channels.tracks', 'effects']
        });
        if (!project)
        {
            throw new Error('Project not found');
        }
        return project;
    }

    async getProjectsByUser(userId: string): Promise<Project[]> {
        return await this.projectRepository.find({
            where: { createdBy: userId },
            relations: ['channels', 'channels.tracks', 'effects']
        });
    }

    async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
        const project = await this.getProject(id);
        Object.assign(project, data);
        return await this.projectRepository.save(project);
    }

    async deleteProject(id: number): Promise<void> {
        const project = await this.getProject(id);
        await this.projectRepository.remove(project);
    }

    async addChannel(projectId: number, data: CreateChannelRequest): Promise<Project> {
        const project = await this.getProject(projectId);
        const channel = this.channelRepository.create({
            ...data,
            project
        });
        await this.channelRepository.save(channel);
        return await this.getProject(projectId);
    }

    async updateChannel(projectId: number, channelId: number, data: UpdateChannelRequest): Promise<Channel> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        Object.assign(channel, data);
        return await this.channelRepository.save(channel);
    }

    async deleteChannel(projectId: number, channelId: number): Promise<Project> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        await this.channelRepository.remove(channel);
        return await this.getProject(projectId);
    }

    async createTrack(projectId: number, channelId: number, data: CreateTrackRequest): Promise<Track> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        const track = this.trackRepository.create({
            ...data,
            channel
        });
        return await this.trackRepository.save(track);
    }

    async updateTrack(projectId: number, channelId: number, trackId: number, data: UpdateTrackRequest): Promise<Track> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        const track = channel.tracks?.find(t => t.id === trackId);
        if (!track)
        {
            throw new Error('Track not found');
        }
        Object.assign(track, data);
        return await this.trackRepository.save(track);
    }

    async deleteTrack(projectId: number, channelId: number, trackId: number): Promise<void> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        const track = channel.tracks?.find(t => t.id === trackId);
        if (!track)
        {
            throw new Error('Track not found');
        }
        await this.trackRepository.remove(track);
    }

    async getChannel(projectId: number, channelId: number): Promise<Channel> {
        const project = await this.getProject(projectId);
        const channel = project.channels?.find(c => c.id === channelId);
        if (!channel)
        {
            throw new Error('Channel not found');
        }
        return channel;
    }

    async getTrack(projectId: number, channelId: number, trackId: number): Promise<Track> {
        const channel = await this.getChannel(projectId, channelId);
        const track = channel.tracks?.find(t => t.id === trackId);
        if (!track)
        {
            throw new Error('Track not found');
        }
        return track;
    }

    async updateChannelPosition(projectId: number, channelId: number, position: number): Promise<Channel> {
        const channel = await this.getChannel(projectId, channelId);
        channel.position = position;
        return await this.channelRepository.save(channel);
    }

    async updateTrackPosition(projectId: number, channelId: number, trackId: number, position: number): Promise<Track> {
        const track = await this.getTrack(projectId, channelId, trackId);
        track.position = position;
        return await this.trackRepository.save(track);
    }
} 
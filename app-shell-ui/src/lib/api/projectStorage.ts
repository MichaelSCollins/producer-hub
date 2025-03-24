import { useAudioStore } from '@/store/audioStore';
import axios from 'axios';
import { CreateProjectRequest, ProjectDto, UpdateProjectRequest } from '../interface/Project';
import CreateProjectRequestBuilder from "@/lib/builder/projectBuilder";
import { MasterChannel, Channel, CreateChannelRequest, UpdateChannelRequest } from "@/lib/interface";
import { projectValidator } from '../validation/ProjectValidation';
import { TrackDto } from '../interface/Track';

const API_BASE_URL = 'http://localhost:8082/api/projects'; // Updated to use nginx proxy

export const projectStorageApi = {
    createProject: async (
        projectName: string,
        bpm: number,
        quantizeDivision: string,
        masterChannel: MasterChannel,
        channels: Channel[],
        userId: string,
        setError = console.error
    ) => {
        const validation = projectValidator.validateProject(projectName);
        if (!validation.isValid)
        {
            setError(validation.message);
            return;
        }
        const projectReq = new CreateProjectRequestBuilder()
            .setProjectName(projectName)
            .setBpm(bpm)
            .setQuantizeDivision(quantizeDivision)
            .setMasterChannel(masterChannel)
            .setChannels(channels)
            .setUserId(userId)
            .build()
        console.log("saving project...")
        const project = await projectStorageApi.postProject(
            projectReq,
            userId
        );
        console.log("saving channels...", channels)
        // Add channels
        for (const channel of channels)
        {
            for (const track of channel.tracks ?? [])
            {
                track.channelId = channel.id;
            }
            await projectStorageApi.createChannel(channel, channels.indexOf(channel), project.id)
        }
    },

    createChannel: async (channel: Channel, position: number, projectId: string) => {
        console.log("creating channel", channel, position, projectId)
        const res = await projectStorageApi.addChannel(projectId, {
            name: channel.name,
            volume: channel.volume,
            tracks: channel.tracks ?? [],
            muted: channel.muted,
            solo: channel.solo,
            position: position,
        });
        console.log("added channel", res)
    },
    postProject: async (request: CreateProjectRequest, userId: string): Promise<ProjectDto> => {
        const url = API_BASE_URL + '/create';
        console.log('postProject:', url);
        const requestCfg = {
            method: 'POST',
            url: url,
            data: request,
            headers: {
                'X-User-Id': userId,
            },
        }
        console.log('Request:', requestCfg);
        const response = await axios.request<ProjectDto>(
            requestCfg,
        ).catch(error => {
            console.error('Error creating project:', error.response || error);
            throw error;
        });
        if (!response)
            throw new Error('Failed to create project');
        console.log('Project created successfully:', response.data);
        useAudioStore.setState({ projectId: response.data.id });
        return response.data;
    },

    getProject: async (id: string): Promise<ProjectDto> => {
        const response = await axios.get<ProjectDto>(`${API_BASE_URL}/${id}`);
        console.log("project", response.data)
        return response.data;
    },

    getProjectsByUser: async (userId: string): Promise<ProjectDto[]> => {
        const response = await axios.get<ProjectDto[]>(API_BASE_URL, {
            headers: {
                'X-User-Id': userId,
            },
        }).catch(error => {
            console.error('Error getting projects:', error.response || error);
            throw error;
        });
        return response.data;
    },

    updateProject: async (id: string, request: UpdateProjectRequest): Promise<ProjectDto> => {
        const response = await axios.put<ProjectDto>(`${API_BASE_URL}/${id}`, request);
        return response.data;
    },

    deleteProject: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },

    addChannel: async (projectId: string, request: CreateChannelRequest): Promise<ProjectDto> => {
        console.log('Adding channel to project:', projectId, 'with request:', request);
        const response = await axios.post<ProjectDto>(`${API_BASE_URL}/${projectId}/channels`, request)
            .catch(error => {
                console.error('Error adding channel:', error.response || error);
                throw error;
            });
        console.log('Successfully added channel to project:', projectId);
        return response.data;
    },

    updateChannel: async (projectId: string, channelId: string, request: UpdateChannelRequest): Promise<ProjectDto> => {
        console.log('Updating channel:', channelId, 'in project:', projectId, 'with request:', request);
        const response = await axios.put<ProjectDto>(`${API_BASE_URL}/${projectId}/channels/${channelId}`, request);
        return response.data;
    },

    deleteChannel: async (projectId: string, channelId: string): Promise<ProjectDto> => {
        const response = await axios.delete<ProjectDto>(`${API_BASE_URL}/${projectId}/channels/${channelId}`);
        return response.data;
    },

    createTrack: async (projectId: string, channelId: string, track: TrackDto): Promise<TrackDto> => {
        const response = await axios.post<TrackDto>(
            `${API_BASE_URL}/${projectId}/channels/${channelId}/tracks`,
            track
        );
        return response.data;
    },

    updateTrack: async (
        projectId: string,
        channelId: string,
        trackId: number,
        track: Partial<TrackDto>
    ): Promise<TrackDto> => {
        const response = await axios.put<TrackDto>(
            `${API_BASE_URL}/${projectId}/channels/${channelId}/tracks/${trackId}`,
            track
        );
        return response.data;
    },

    deleteTrack: async (projectId: string, channelId: string, trackId: number): Promise<void> => {
        await axios.delete(
            `${API_BASE_URL}/${projectId}/channels/${channelId}/tracks/${trackId}`
        );
    },
};

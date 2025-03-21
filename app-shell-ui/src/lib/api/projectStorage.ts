import { AudioTrack, useAudioStore } from '@/store/audioStore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/projects'; // Updated to use nginx proxy

export interface ProjectDto {
    id: string;
    name: string;
    createdBy: string;
    bpm: number;
    quantizeDivision: string;
    masterVolume: number;
    masterMuted: boolean;
    channels: ChannelDto[];
    effects: EffectDto[];
    createdAt: string;
    updatedAt: string;
}

export interface ChannelDto {
    id: string;
    name: string;
    volume: number;
    muted: boolean;
    solo: boolean;
    position: number;
    effects: EffectDto[];
    tracks: TrackDto[];
}

export interface EffectDto {
    id: string;
    type: string;
    enabled: boolean;
    parameters: Record<string, number>;
    position: number;
}

export interface TrackDto {
    id?: number | undefined;
    name: string;
    channel?: number | undefined;
    audioFileId?: number | undefined;
    startTime: number;
}

export interface CreateProjectRequest {
    name: string;
    bpm: number;
    quantizeDivision: string;
    masterVolume?: number;
    masterMuted?: boolean;
    channels: ChannelDto[];
}

export interface UpdateProjectRequest {
    name?: string;
    bpm?: number;
    quantizeDivision?: string;
    masterVolume?: number;
    masterMuted?: boolean;
}

export const projectStorageApi = {
    createProject: async (request: CreateProjectRequest, userId: string): Promise<ProjectDto> => {
        console.log('Creating project with request:', request, 'and userId:', userId);
        console.log('API_BASE_URL:', API_BASE_URL);
        if (!userId) throw new Error('User ID is required to create a project');
        if (!request) throw new Error('Request body is required to create a project');
        if (!request.name) throw new Error('Project name is required');
        const url = API_BASE_URL + '/create';
        console.log('Creating project at URL:', url);
        console.log('Request body:', request);
        const response = await axios.post<ProjectDto>(url, request, {
            headers: {
                'X-User-Id': userId,
            },
        }).catch(error => {
            console.error('Error creating project:', error.response || error);
            throw error;
        });
        if (!response) throw new Error('Failed to create project');
        console.log('Project created successfully:', response.data);
        useAudioStore.setState({ projectId: response.data.id });
        return response.data;
    },

    getProject: async (id: string): Promise<ProjectDto> => {
        const response = await axios.get<ProjectDto>(`${API_BASE_URL}/${id}`);
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
        const response = await axios.post<ProjectDto>(`${API_BASE_URL}/${projectId}/channels`, request);
        return response.data;
    },

    updateChannel: async (projectId: string, channelId: number, request: UpdateChannelRequest): Promise<ProjectDto> => {
        console.log('Updating channel:', channelId, 'in project:', projectId, 'with request:', request);
        const response = await axios.put<ProjectDto>(`${API_BASE_URL}/${projectId}/channels/${channelId}`, request);
        return response.data;
    },

    deleteChannel: async (projectId: string, channelId: number): Promise<ProjectDto> => {
        const response = await axios.delete<ProjectDto>(`${API_BASE_URL}/${projectId}/channels/${channelId}`);
        return response.data;
    },
};

export interface CreateChannelRequest {
    name: string;
    volume?: number;
    muted?: boolean;
    solo?: boolean;
    position: number;
    tracks: TrackDto[];
}

export interface UpdateChannelRequest {
    name?: string;
    volume?: number;
    muted?: boolean;
    solo?: boolean;
    position?: number;
    tracks?: AudioTrack[];
} 
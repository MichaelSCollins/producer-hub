/* eslint-disable @typescript-eslint/no-explicit-any */
import { AudioTrack } from '@/types/audio';
import axios from 'axios';
const USER_BASE_URL =
    process.env.NEXT_PUBLIC_USER_API_URL
    ?? 'http://localhost:7777/api/users/user'; // Updated to use nginx proxy
const API_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_API_URL; // Updated to use nginx proxy

export interface AudioFileMetadata {
    downloadUrl: string;
    id?: number;
    filename: string;
    position: number;
    contentType: string;
    fileSize: number;
    description?: string;
    uploadedAt: string;
    uploadedBy: string;
}

export const audioStorageApi = {
    getUser: async () => {
        const response = await fetch(USER_BASE_URL)
        return response.json()
    },
    uploadAudioFromProject: async (track: any, projectId?: string | null, description?: string, uploadedBy: string = 'user'): Promise<AudioFileMetadata> => {
        const inMemoryFile = await fetch(track.url!);
        const blob = await inMemoryFile.blob();
        const file = new File(
            [blob],
            track.name,
            { type: blob.type }
        );
        return await audioStorageApi.uploadAudio(file, description, uploadedBy);
    },

    uploadAudio: async (file: File, description?: string, uploadedBy: string = 'user'): Promise<AudioFileMetadata> => {
        console.log("uploading audio", file)
        const formData = new FormData();
        formData.append('file', file);
        if (description)
        {
            formData.append('description', description);
        }
        formData.append('uploadedBy', uploadedBy);

        const response = await axios.post<AudioFileMetadata>(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).catch(onError);
        if (!response)
        {
            throw new Error('Failed to upload audio file');
        }
        return response.data;
    },

    downloadAudio: async (id: number): Promise<Blob> => {
        console.log("downloading audio", id)
        const response = await axios.get(`${API_BASE_URL}/${id}/download`, {
            responseType: 'blob',
        }).catch(onError);
        if (!response)
        {
            throw new Error('Failed to download audio file');
        }
        return response?.data;
    },

    deleteAudio: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`)
            .catch(onError);
    },

    getAllAudioFiles: async (): Promise<AudioTrack[]> => {
        console.log("getting all audio files")
        const response = await axios
            .get<AudioTrack[]>(
                `${API_BASE_URL}`
            ).catch(onError);
        if (!response)
        {
            throw new Error('Failed to fetch audio files');
        }
        return response?.data;
    },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (error: any) => {
    console.error('Audio Storage API Error:', error.message);
}
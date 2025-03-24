import axios from 'axios';
import { AudioTrack } from '../interface';

const API_BASE_URL = 'http://localhost:8081/api'; // Updated to use nginx proxy

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
    uploadAudioFromProject: async (track: AudioTrack, projectId?: string | null, description?: string, uploadedBy: string = 'user'): Promise<AudioFileMetadata> => {
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

        const response = await axios.post<AudioFileMetadata>(`${API_BASE_URL}/audio/upload`, formData, {
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
        const response = await axios.get(`${API_BASE_URL}/audio/${id}/download`, {
            responseType: 'blob',
        }).catch(onError);
        if (!response)
        {
            throw new Error('Failed to download audio file');
        }
        return response?.data;
    },

    deleteAudio: async (id: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/audio/${id}`)
            .catch(onError);
    },

    getAllAudioFiles: async (): Promise<AudioFileMetadata[]> => {
        console.log("getting all audio files")
        const response = await axios
            .get<AudioFileMetadata[]>(
                `${API_BASE_URL}/audio`
            )
            .catch(onError);
        if (!response)
        {
            throw new Error('Failed to fetch audio files');
        }
        return response.data;
    },

    searchAudioFiles: async (id: string): Promise<AudioFileMetadata[]> => {
        console.log("searching audio files", id)
        const response = await axios.get<AudioFileMetadata[]>(`${API_BASE_URL}/audio/search`, {
            params: { id },
        }).catch(onError);
        if (!response)
        {
            throw new Error('Failed to search audio files');
        }
        return response.data;
    },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (error: any) => {
    console.error('Audio Storage API Error:', error.message);
}
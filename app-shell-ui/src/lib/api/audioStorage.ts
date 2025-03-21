import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api'; // Updated to use nginx proxy

export interface AudioFileMetadata {
    id?: number;
    filename: string;
    contentType: string;
    fileSize: number;
    description?: string;
    uploadedAt: string;
    uploadedBy: string;
}

export const audioStorageApi = {
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

    searchAudioFiles: async (fileName: string): Promise<AudioFileMetadata[]> => {
        console.log("searching audio files", fileName)
        const response = await axios.get<AudioFileMetadata[]>(`${API_BASE_URL}/audio/search`, {
            params: { fileName },
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
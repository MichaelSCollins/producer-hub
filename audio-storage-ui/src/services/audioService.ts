import { AudioTrack } from '@/types/audio';
import Cookies from "../../node_modules/@types/js-cookie";

const NEXT_API_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_API_URL || 'http://localhost:8081';
const cookieStore = Cookies

class AudioServiceError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'AudioServiceError';
    }
}

export class AudioService {
    private static instance: AudioService;
    private constructor() { }

    public static getInstance(): AudioService {
        if (!AudioService.instance)
        {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private async fetchWithAuth<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const userId = cookieStore.get('userId') ?? "guest";
        if (!userId)
        {
            throw new AudioServiceError('User ID not found');
        }

        const response = await fetch(`${NEXT_API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': userId,
                ...options.headers,
            },
        });

        if (!response.ok)
        {
            throw new AudioServiceError(
                `API request failed: ${response.statusText}`,
                response.status
            );
        }

        return response.json();
    }

    public async getTracks(): Promise<AudioTrack[]> {
        return this.fetchWithAuth<AudioTrack[]>('/api/audio');
    }

    public async getTrack(id: string): Promise<AudioTrack> {
        return this.fetchWithAuth<AudioTrack>(`/api/audio/${id}`);
    }

    public async getTrackWaveform(id: string): Promise<number[]> {
        return this.fetchWithAuth<number[]>(`/api/audio/${id}/waveform`);
    }

    public async getTrackAudioUrl(id: string): Promise<string> {
        const response = await this.fetchWithAuth<{ url: string }>(
            `/api/audio/${id}/url`
        );
        return response.url;
    }
} 
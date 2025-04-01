export interface AudioTrack {
    startTime: number;
    filename: string;
    id: string;
    name: string;
    audioUrl: string;
    duration: number;
    waveform: number[];
    createdAt: string;
    updatedAt: string;
    downloadUrl: string;
    position: number;
    contentType: string;
    fileSize: number;
    description?: string;
    uploadedAt: string;
    uploadedBy: string;
}

export interface AudioChannel {
    id: string;
    name: string;
    projectId: string;
    tracks: AudioTrack[];
    createdAt: string;
    updatedAt: string;
}

export interface AudioProject {
    id: string;
    name: string;
    userId: string;
    channels: AudioChannel[];
    createdAt: string;
    updatedAt: string;
}

export interface AudioWaveformData {
    peaks: number[];
    duration: number;
    sampleRate: number;
}

export interface AudioPlaybackState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    trackId: string | null;
} 
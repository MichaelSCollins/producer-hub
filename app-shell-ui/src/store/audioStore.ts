import { EffectDto } from '@/lib/api/projectStorage';
import { create } from 'zustand';
export interface AudioTrack {
    id?: number;
    name: string;
    url: string;
    audioFileId: number;
    channel: number | undefined;
    startTime: number;
}

export interface Channel {
    name: string;
    id?: number | undefined;
    tracks: AudioTrack[];
    volume: number;
    muted: boolean;
    solo: boolean;
    effects: EffectDto[];
}

export interface MasterChannel {
    volume: number;
    muted: boolean;
    effects: Effect[];
}

export interface Effect {
    id?: number;
    type: 'eq' | 'compressor' | 'limiter';
    enabled: boolean;
    parameters: Record<string, number>;
}

export const ZOOM_PRESETS = {
    SECONDS_5: { label: '5s', seconds: 5 },
    SECONDS_10: { label: '10s', seconds: 10 },
    SECONDS_30: { label: '30s', seconds: 30 },
    MINUTE_1: { label: '1m', seconds: 60 },
    MINUTE_5: { label: '5m', seconds: 300 },
} as const;

export const QUANTIZE_DIVISIONS = {
    OFF: { label: 'Off', value: 0 },
    BAR: { label: 'Bar', value: 4 },
    HALF: { label: '1/2', value: 2 },
    QUARTER: { label: '1/4', value: 1 },
    EIGHTH: { label: '1/8', value: 0.5 },
    SIXTEENTH: { label: '1/16', value: 0.25 },
} as const;

type AudioStore = {
    projectId: string | null;
    channels: Channel[];
    masterChannel: MasterChannel;
    selectedTrackId: number | null;
    isPlaying: boolean;
    currentTime: number;
    pixelsPerSecond: number;
    viewportWidth: number;
    selectionStart: number | null;
    selectionEnd: number | null;
    bpm: number;
    quantizeDivision: keyof typeof QUANTIZE_DIVISIONS;
    setProjectId: (projectId: string) => void;
    addChannel: () => void;
    removeChannel: (channelId: number) => void;
    addTrack: (channelId: number | undefined, track: Omit<AudioTrack, 'id' | 'channelId'>) => void;
    removeTrack: (channelId: number, trackId: number) => void;
    updateTrackPosition: (trackId: number | undefined, channelId: number | undefined, startTime: number) => void;
    setChannelVolume: (channelId: number, volume: number) => void;
    toggleChannelMute: (channelId: number) => void;
    toggleChannelSolo: (channelId: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTime: (time: number) => void;
    setSelectedTrack: (trackId: number | null) => void;
    setPixelsPerSecond: (pixels: number) => void;
    setViewportWidth: (width: number) => void;
    zoomToFitProject: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToSelection: () => void;
    zoomToPreset: (seconds: number) => void;
    setSelection: (start: number | null, end: number | null) => void;
    setBpm: (bpm: number) => void;
    setQuantizeDivision: (division: keyof typeof QUANTIZE_DIVISIONS) => void;
    quantizeTime: (time: number) => number;
    setMasterVolume: (volume: number) => void;
    toggleMasterMute: () => void;
    addMasterEffect: (type: Effect['type']) => void;
    removeMasterEffect: (effectId: number) => void;
    updateMasterEffect: (effectId: number, parameters: Record<number, number>) => void;
    toggleMasterEffect: (effectId: number) => void;
};

const DEFAULT_MASTER_CHANNEL: MasterChannel = {
    volume: 1,
    muted: false,
    effects: [
        {
            type: 'limiter',
            enabled: true,
            parameters: {
                threshold: -1.0,
                release: 50,
            },
        },
    ],
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    projectId: null,
    channels: [],
    masterChannel: DEFAULT_MASTER_CHANNEL,
    selectedTrackId: null,
    isPlaying: false,
    currentTime: 0,
    pixelsPerSecond: 100, // Default zoom level
    viewportWidth: 1000, // Will be updated when component mounts
    selectionStart: null,
    selectionEnd: null,
    bpm: 120,
    quantizeDivision: "QUARTER",
    setProjectId: (projectId: string) => set({ projectId }),
    addChannel: () => set((state) => ({
        channels: [...state.channels, {
            name: `Channel ${state.channels.length + 1}`,
            tracks: [],
            volume: 1,
            effects: [],
            muted: false,
            solo: false, // Add required audioFileId property
        }]
    })),

    removeChannel: (channelId: number) => set((state) => ({
        channels: state.channels.filter((channel) => channel.id !== channelId),
    })),

    addTrack: (
        channelId: number | undefined,
        track: Omit<AudioTrack, 'id' | 'channelId'>
    ) => set((state) => ({
        channels: state.channels.map((channel) =>
            channel.id === channelId
                ? {
                    ...channel,
                    tracks: [...channel.tracks,
                    {
                        ...track,
                        channel: channelId,
                    }],
                }
                : channel
        ),
    })),

    removeTrack: (channelId: number, trackId: number) => set((state) => ({
        channels: state.channels.map((channel) =>
            channel.id === channelId
                ? {
                    ...channel,
                    tracks: channel.tracks.filter((track) => track.id !== trackId),
                }
                : channel
        ),
    })),

    updateTrackPosition: (trackId: number | undefined, channelId: number | undefined, startTime: number) => {
        const state = get();
        const quantizedTime = state.quantizeTime(startTime);

        set((state) => ({
            channels: state.channels.map((channel) =>
                channel.id === channelId
                    ? {
                        ...channel,
                        tracks: channel.tracks.map((track) =>
                            track.id === trackId ? {
                                ...track,
                                startTime: quantizedTime
                            } : track
                        ),
                    }
                    : channel
            ),
        }));
        get().zoomToFitProject();
    },

    setChannelVolume: (channelId: number, volume: number) => set((state) => ({
        channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, volume } : channel
        ),
    })),

    toggleChannelMute: (channelId: number) => set((state) => ({
        channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, muted: !channel.muted } : channel
        ),
    })),

    toggleChannelSolo: (channelId: number) => set((state) => ({
        channels: state.channels.map((channel) =>
            channel.id === channelId ? { ...channel, solo: !channel.solo } : channel
        ),
    })),

    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentTime: (currentTime: number) => set({ currentTime }),
    setSelectedTrack: (selectedTrackId: number | null) => set({ selectedTrackId }),
    setPixelsPerSecond: (pixels: number) => set({ pixelsPerSecond: Math.max(10, Math.min(500, pixels)) }),
    setViewportWidth: (width: number) => set({ viewportWidth: width }),

    zoomToFitProject: () => {
        const state = get();
        let maxEndTime = 0;

        // Find the latest end time across all tracks
        state.channels.forEach(channel => {
            channel.tracks.forEach(track => {
                // Assuming each track is 30 seconds long for now
                // TODO: Replace with actual track duration when available
                const trackEndTime = track.startTime + 30;
                maxEndTime = Math.max(maxEndTime, trackEndTime);
            });
        });

        // Add 10% padding
        maxEndTime *= 1.1;

        // Calculate new pixels per second to fit the project
        if (maxEndTime > 0)
        {
            const newPixelsPerSecond = state.viewportWidth / maxEndTime;
            set({ pixelsPerSecond: newPixelsPerSecond });
        }
    },

    zoomIn: () => {
        const state = get();
        const newZoom = state.pixelsPerSecond * 1.5;
        set({ pixelsPerSecond: Math.min(500, newZoom) });
    },

    zoomOut: () => {
        const state = get();
        const newZoom = state.pixelsPerSecond / 1.5;
        set({ pixelsPerSecond: Math.max(10, newZoom) });
    },

    zoomToSelection: () => {
        const state = get();
        if (state.selectionStart === null || state.selectionEnd === null) return;

        const selectionDuration = Math.abs(state.selectionEnd - state.selectionStart);
        if (selectionDuration === 0) return;

        const newPixelsPerSecond = (state.viewportWidth * 0.9) / selectionDuration;
        set({ pixelsPerSecond: newPixelsPerSecond });
    },

    zoomToPreset: (seconds: number) => {
        const state = get();
        const newPixelsPerSecond = state.viewportWidth / seconds;
        set({ pixelsPerSecond: newPixelsPerSecond });
    },

    setSelection: (start: number | null, end: number | null) => set({
        selectionStart: start,
        selectionEnd: end
    }),

    setBpm: (bpm: number) => set({ bpm: Math.max(20, Math.min(300, bpm)) }),

    setQuantizeDivision: (division: keyof typeof QUANTIZE_DIVISIONS) =>
        set({ quantizeDivision: division }),

    quantizeTime: (time: number) => {
        const state = get();
        const division = QUANTIZE_DIVISIONS[state.quantizeDivision];

        if (division.value === 0) return time; // Quantization off

        // Calculate beat duration and grid size
        const beatDuration = 60 / state.bpm; // Duration of one beat in seconds
        const gridSize = beatDuration * division.value; // Duration of one grid unit

        // Snap to nearest grid position
        return Math.round(time / gridSize) * gridSize;
    },

    setMasterVolume: (volume: number) => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            volume: Math.max(0, Math.min(1, volume)),
        },
    })),

    toggleMasterMute: () => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            muted: !state.masterChannel.muted,
        },
    })),

    addMasterEffect: (type: Effect['type']) => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            effects: [
                ...state.masterChannel.effects,
                {
                    type,
                    enabled: true,
                    parameters: getDefaultEffectParameters(type),
                },
            ],
        },
    })),

    removeMasterEffect: (effectId: number) => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            effects: state.masterChannel.effects.filter(effect => effect.id !== effectId),
        },
    })),

    updateMasterEffect: (effectId: number, parameters: Record<string, number>) => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            effects: state.masterChannel.effects.map(effect =>
                effect.id === effectId
                    ? { ...effect, parameters: { ...effect.parameters, ...parameters } }
                    : effect
            ),
        },
    })),

    toggleMasterEffect: (effectId: number) => set((state) => ({
        masterChannel: {
            ...state.masterChannel,
            effects: state.masterChannel.effects.map(effect =>
                effect.id === effectId
                    ? { ...effect, enabled: !effect.enabled }
                    : effect
            ),
        },
    })),
}));

function getDefaultEffectParameters(type: Effect['type']): Record<string, number> {
    switch (type)
    {
        case 'eq':
            return {
                low: 0,
                mid: 0,
                high: 0,
            };
        case 'compressor':
            return {
                threshold: -20,
                ratio: 4,
                attack: 5,
                release: 50,
            };
        case 'limiter':
            return {
                threshold: -1.0,
                release: 50,
            };
    }
} 
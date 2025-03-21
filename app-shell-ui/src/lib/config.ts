export const config = {
    // Audio settings
    maxChannels: 16,
    maxTracksPerChannel: 32,
    supportedAudioFormats: [
        'audio/wav',
        'audio/mp3',
        'audio/ogg',
        'audio/aac',
        'audio/mpeg',
    ],
    maxFileSize: 100 * 1024 * 1024, // 100MB

    // UI settings
    timelineGridSize: 50, // pixels
    waveformHeight: 80,
    minTrackWidth: 200,
    channelHeight: 150,

    // Playback settings
    defaultVolume: 1,
    defaultBPM: 120,
    maxBPM: 300,
    minBPM: 20,

    // Collaboration settings
    maxCollaborators: 8,
    autoSaveInterval: 30000, // 30 seconds
} as const;

export type SupportedAudioFormat = typeof config.supportedAudioFormats[number]; 
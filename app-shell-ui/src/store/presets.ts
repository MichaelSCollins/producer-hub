import { MasterChannel } from "@/lib/interface";

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

export const DEFAULT_MASTER_CHANNEL: MasterChannel = {
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
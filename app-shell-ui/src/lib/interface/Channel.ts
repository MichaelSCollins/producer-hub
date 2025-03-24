import { EffectDto } from "./Effect";
import { AudioTrack, TrackDto } from "./Track";

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

export interface Channel {
    id: number;
    name: string;
    tracks: AudioTrack[];
    volume: number;
    muted: boolean;
    solo: boolean;
    effects: EffectDto[];
    position: number;
}
export interface ChannelRef {
    id: string;
    name: string;
    volume: number;
    muted: boolean;
    solo: boolean;
    effects: EffectDto[];
    position: number;
}
export interface CreateChannelRequest {
    name: string;
    volume?: number;
    muted?: boolean;
    solo?: boolean;
    position: number;
    tracks: AudioTrack[];
}

export interface UpdateChannelRequest {
    name?: string;
    volume?: number;
    muted?: boolean;
    solo?: boolean;
    position?: number;
    tracks?: AudioTrack[];
} 
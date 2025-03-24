export interface EffectDto {
    id: string;
    type: string;
    enabled: boolean;
    parameters: Record<string, number>;
    position: number;
}

export interface Effect {
    id?: string;
    type: 'eq' | 'compressor' | 'limiter';
    enabled: boolean;
    parameters: Record<string, number>;
}
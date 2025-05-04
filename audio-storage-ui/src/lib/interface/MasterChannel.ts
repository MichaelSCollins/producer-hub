export interface MasterChannel {
    volume: number,
    muted: boolean,
    effects: AudioEffect[
    ],
}

export interface AudioEffect {
    type: string,
    enabled: boolean,
    parameters: EffectParameters,
}

export interface EffectParameters {
    [param: string]: number
}
export interface TrackDto {
    id?: number;
    name: string;
    audioFileId: number;
    startTime: number;
    position?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AudioTrack extends TrackDto {
    url?: string;
    channelId?: number;
}

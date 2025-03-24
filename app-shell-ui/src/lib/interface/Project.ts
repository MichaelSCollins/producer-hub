export interface ProjectDto {
    id: string;
    name: string;
    createdBy: string;
    bpm: number;
    quantizeDivision: string;
    masterVolume: number;
    masterMuted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectRequest {
    name: string;
    bpm: number;
    quantizeDivision: string;
    masterVolume?: number;
    masterMuted?: boolean;
}

export interface UpdateProjectRequest {
    name?: string;
    bpm?: number;
    quantizeDivision?: string;
    masterVolume?: number;
    masterMuted?: boolean
}
import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateTrackRequest {
    @IsString()
    name?: string;

    @IsString()
    type?: string;

    @IsObject()
    @IsOptional()
    data?: Record<string, any>;

    @IsNumber()
    @IsOptional()
    startTime?: number;

    @IsNumber()
    @IsOptional()
    duration?: number;
}

export class UpdateTrackRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsObject()
    @IsOptional()
    data?: Record<string, any>;

    @IsNumber()
    @IsOptional()
    startTime?: number;

    @IsNumber()
    @IsOptional()
    duration?: number;
}

export class TrackDto {
    id?: number;
    name?: string;
    type?: string;
    data?: Record<string, any>;
    startTime?: number;
    duration?: number;
    createdAt?: Date;
    updatedAt?: Date;
} 
import { IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { TrackDto } from './TrackDto.js';

export class CreateChannelRequest {
    @IsString()
    name?: string;

    @IsString()
    type?: string;

    @IsNumber()
    @IsOptional()
    volume?: number;

    @IsBoolean()
    @IsOptional()
    muted?: boolean;

    @IsBoolean()
    @IsOptional()
    soloed?: boolean;

    @IsObject()
    @IsOptional()
    settings?: Record<string, any>;
}

export class UpdateChannelRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsNumber()
    @IsOptional()
    volume?: number;

    @IsBoolean()
    @IsOptional()
    muted?: boolean;

    @IsBoolean()
    @IsOptional()
    soloed?: boolean;

    @IsObject()
    @IsOptional()
    settings?: Record<string, any>;
}

export class ChannelDto {
    id?: number;
    name?: string;
    type?: string;
    volume?: number;
    muted?: boolean;
    soloed?: boolean;
    settings?: Record<string, any>;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TrackDto)
    tracks?: TrackDto[];

    createdAt?: Date;
    updatedAt?: Date;
} 
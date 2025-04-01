import { IsString, IsNumber, IsBoolean, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ChannelDto } from './ChannelDto.js';
import { EffectDto } from './EffectDto.js';

export class CreateProjectRequest {
    @IsString()
    name?: string;

    @IsString()
    createdBy?: string;

    @IsNumber()
    bpm?: number;

    @IsString()
    quantizeDivision?: string;

    @IsNumber()
    masterVolume?: number;

    @IsBoolean()
    @IsOptional()
    masterMuted?: boolean;
}

export class UpdateProjectRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    bpm?: number;

    @IsString()
    @IsOptional()
    quantizeDivision?: string;

    @IsNumber()
    @IsOptional()
    masterVolume?: number;

    @IsBoolean()
    @IsOptional()
    masterMuted?: boolean;
}

export class ProjectDto {
    id?: number;
    name?: string;
    createdBy?: string;
    bpm?: number;
    quantizeDivision?: string;
    masterVolume?: number;
    masterMuted?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChannelDto)
    channels?: ChannelDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EffectDto)
    effects?: EffectDto[];

    createdAt?: Date;
    updatedAt?: Date;
} 
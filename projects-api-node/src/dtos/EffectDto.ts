import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateEffectRequest {
    @IsString()
    name?: string;

    @IsString()
    type?: string;

    @IsObject()
    @IsOptional()
    parameters?: Record<string, any>;
}

export class UpdateEffectRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsObject()
    @IsOptional()
    parameters?: Record<string, any>;
}

export class EffectDto {
    id?: number;
    name?: string;
    type?: string;
    parameters?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
} 
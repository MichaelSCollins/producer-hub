import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project.js';

@Entity('effects')
export class Effect {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    type?: string;

    @Column('jsonb', { nullable: true })
    parameters?: Record<string, any>;

    @ManyToOne(() => Project, project => project.effects)
    project?: Project;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
} 
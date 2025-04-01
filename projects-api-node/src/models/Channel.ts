import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project.js';
import { Track } from './Track.js';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    type?: string;

    @Column('decimal', { precision: 10, scale: 2, default: 1.0 })
    volume?: number;

    @Column({ default: false })
    muted?: boolean;

    @Column({ default: false })
    soloed?: boolean;

    @Column('int', { default: 0 })
    position?: number;

    @Column('jsonb', { nullable: true })
    settings?: Record<string, any>;

    @ManyToOne(() => Project, project => project.channels)
    project?: Project;

    @OneToMany(() => Track, track => track.channel, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    tracks?: Track[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
} 
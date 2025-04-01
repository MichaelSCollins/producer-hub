import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Channel } from './Channel.js';

@Entity('tracks')
export class Track {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    type?: string;

    @Column('jsonb', { nullable: true })
    data?: Record<string, any>;

    @Column('int', { default: 0 })
    startTime?: number;

    @Column('int', { default: 0 })
    duration?: number;

    @Column('int', { default: 0 })
    position?: number;

    @ManyToOne(() => Channel, channel => channel.tracks)
    channel?: Channel;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
} 
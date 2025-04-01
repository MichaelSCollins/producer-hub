import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Channel } from './Channel.js';
import { Effect } from './Effect.js';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    createdBy?: string;

    @Column()
    bpm?: number;

    @Column()
    quantizeDivision?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    masterVolume?: number;

    @Column({ default: false })
    masterMuted?: boolean;

    @OneToMany(() => Channel, channel => channel.project, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    channels?: Channel[];

    @OneToMany(() => Effect, effect => effect.project, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    effects?: Effect[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
} 
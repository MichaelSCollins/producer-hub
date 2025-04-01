import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTables1709856000000 implements MigrationInterface {
    name = 'CreateProjectTables1709856000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "createdBy" character varying NOT NULL,
                "bpm" integer NOT NULL,
                "quantizeDivision" character varying NOT NULL,
                "masterVolume" decimal(10,2) NOT NULL,
                "masterMuted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_projects" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "channels" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "volume" decimal(10,2) NOT NULL,
                "muted" boolean NOT NULL DEFAULT false,
                "solo" boolean NOT NULL DEFAULT false,
                "position" integer NOT NULL,
                "projectId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_channels" PRIMARY KEY ("id"),
                CONSTRAINT "FK_channels_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "tracks" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "volume" decimal(10,2) NOT NULL,
                "muted" boolean NOT NULL DEFAULT false,
                "solo" boolean NOT NULL DEFAULT false,
                "position" integer NOT NULL,
                "channelId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tracks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_tracks_channel" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "effects" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "type" character varying NOT NULL,
                "parameters" jsonb NOT NULL,
                "projectId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_effects" PRIMARY KEY ("id"),
                CONSTRAINT "FK_effects_project" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "effects"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "channels"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }
} 
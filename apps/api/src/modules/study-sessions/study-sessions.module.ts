import { Module } from '@nestjs/common';
import { StudySessionsController } from './controllers/v1/study-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySessionEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ StudySessionEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ StudySessionsController ],
} )
export class StudySessionsModule {}

import { Module } from '@nestjs/common';
import { LearningPathController } from './controllers/v1/learning-path.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningPathEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ LearningPathEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ LearningPathController ],
} )
export class LearningPathModule {}

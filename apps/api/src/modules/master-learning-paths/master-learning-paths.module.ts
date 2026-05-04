import { Module } from '@nestjs/common';
import { MasterLearningPathsController } from './controllers/v1/master-learning-paths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterLearningPathEntity, MasterModuleEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ MasterLearningPathEntity, MasterModuleEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ MasterLearningPathsController ],
} )
export class MasterLearningPathsModule {}

import { Module } from '@nestjs/common';
import { UserLearningPathsController } from './controllers/v1/user-learning-paths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLearningPathEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserLearningPathEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ UserLearningPathsController ],
} )
export class UserLearningPathsModule {}

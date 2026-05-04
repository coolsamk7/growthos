import { Module } from '@nestjs/common';
import { UserModulesController } from './controllers/v1/user-modules.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModuleEntity, UserLearningPathEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserModuleEntity, UserLearningPathEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ UserModulesController ],
} )
export class UserModulesModule {}

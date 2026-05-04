import { Module } from '@nestjs/common';
import { MasterTopicsController } from './controllers/v1/master-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterTopicEntity, MasterModuleEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ MasterTopicEntity, MasterModuleEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ MasterTopicsController ],
} )
export class MasterTopicsModule {}

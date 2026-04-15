import { Module } from '@nestjs/common';
import { MasterProblemsController } from './controllers/v1/master-problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterProblemEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ MasterProblemEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ MasterProblemsController ],
} )
export class MasterProblemsModule {}

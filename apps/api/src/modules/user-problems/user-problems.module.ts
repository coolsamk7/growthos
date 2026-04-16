import { Module } from '@nestjs/common';
import { UserProblemsController } from './controllers/v1/user-problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProblemEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserProblemEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ UserProblemsController ],
} )
export class UserProblemsModule {}

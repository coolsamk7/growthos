import { Module } from '@nestjs/common';
import { ProblemAttemptsController } from './controllers/v1/problem-attempts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemAttemptEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProblemAttemptEntity]),
        CaslModule.forRoot(),
    ],
    controllers: [ProblemAttemptsController],
})
export class ProblemAttemptsModule {}

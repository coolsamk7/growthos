import { Module } from '@nestjs/common';
import { GoalsController } from './controllers/v1/goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([GoalEntity]),
        CaslModule.forRoot(),
    ],
    controllers: [GoalsController],
})
export class GoalsModule {}

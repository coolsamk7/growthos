import { Module } from '@nestjs/common';
import { StreaksController } from './controllers/v1/streaks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([StreakEntity]),
        CaslModule.forRoot(),
    ],
    controllers: [StreaksController],
})
export class StreaksModule {}

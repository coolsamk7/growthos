import { Module } from '@nestjs/common';
import { StreaksController } from './controllers/v1/streaks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';
import { StreaksService } from './services';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ StreakEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ StreaksController ],
    providers: [ StreaksService ],
    exports: [ StreaksService ],
} )
export class StreaksModule {}

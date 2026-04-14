import { Module } from '@nestjs/common';
import { AuthController } from './controllers/v1/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, RefreshTokenEntity } from '@growthos/nestjs-database/entities';
import { OtpService, QueueProducerService, TokenService } from 'src/services';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../queue';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserEntity, RefreshTokenEntity ] ),
        QueueModule
    ] ,
    controllers: [ AuthController ],
    providers: [ OtpService, TokenService ],
} )
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './controllers/v1/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity  } from '@growthos/nestjs-database/entities';
import { OtpService, QueueProducerService } from 'src/services';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../queue';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserEntity ] ),
        QueueModule
    ] ,
    controllers: [ AuthController ],
    providers: [ OtpService ],
} )
export class AuthModule {}

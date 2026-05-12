import { Module } from '@nestjs/common';
import { AuthController } from './controllers/v1/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, RefreshTokenEntity } from '@growthos/nestjs-database/entities';
import { OtpService, TokenService } from 'src/services';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserEntity, RefreshTokenEntity ] ),
    ] ,
    controllers: [ AuthController ],
    providers: [ OtpService, TokenService ],
} )
export class AuthModule {}

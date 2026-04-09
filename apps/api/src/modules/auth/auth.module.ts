import { Module } from '@nestjs/common';
import { AuthController } from './controllers/v1/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity  } from '@growthos/nestjs-database/entities';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserEntity ] ),
    ],
    controllers: [ AuthController ],
    providers: [],
} )
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserProfileController } from './controllers/v1/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from '@growthos/nestjs-database/entities'

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ UserProfileEntity ] )
    ],
    controllers: [ UserProfileController ],
    providers: [ UserProfileService ],
    exports: [ UserProfileService ]
} )
export class UserProfileModule {}

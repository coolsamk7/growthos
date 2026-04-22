import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { UserEntity } from '@growthos/nestjs-database/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ) {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        configService: ConfigService
    ) {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get( 'jwt.config' ).secret,
        } );
    }

    async validate( payload: { id: string } ) {
        const user = await this.dataSource.manager.findOne( UserEntity, {
            where: { id: payload.id }
        } );

        if ( !user ) {
            throw new UnauthorizedException( 'User not found' );
        }

        if ( user.status !== 'ACTIVE' ) {
            throw new UnauthorizedException( 'User account is not active' );
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status
        };
    }
}

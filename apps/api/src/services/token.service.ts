import { RefreshTokenEntity } from '@growthos/nestjs-database/entities';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';

type TokenClaims = {
    id: string;
    email?: string;
    mobilenumber?: string;
    roles?: string[];
    onboarding_incomplete?: true;
};

@Injectable()
export class TokenService {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource,
        @Inject( JwtService ) private readonly jwtService: JwtService,
    ) {}

    async generateTokenPair<P extends TokenClaims = TokenClaims>( payload: P ) {
        return {
            accessToken: await this.generateAccessToken( payload ),
            refreshToken: await this.generateRefreshToken( payload ),
        };
    }

    async generateAccessToken<P extends TokenClaims = TokenClaims>( payload: P ) {
        return this.jwtService.signAsync( payload );
    }

    async generateRefreshToken<P extends TokenClaims = TokenClaims>( payload: P ) {
        // Revoke all the existing tokens
        await this.datasource.manager.softDelete( RefreshTokenEntity, { deletedAt: IsNull() } );

        const token = await this.jwtService.signAsync(
            { id: payload.id },
            {
                expiresIn: '24weeks',
            },
        );
        await this.datasource.manager.save(
            this.datasource.manager.create( RefreshTokenEntity, {
                token,
                userId: payload.id,
            } ),
        );
        return token;
    }
}

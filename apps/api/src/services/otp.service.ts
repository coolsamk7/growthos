import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
    private redis: Redis;
    private readonly logger = new Logger( OtpService.name );
    private readonly OTP_EXPIRY: number;
    private readonly SALT_ROUNDS: number;

    constructor( private readonly configService: ConfigService ) {
        const redisConfig: any = this.configService.get( 'redis' );
        const otpConfig: any = this.configService.get( 'otp' );
        
        this.OTP_EXPIRY = otpConfig.expiry;
        this.SALT_ROUNDS = otpConfig.saltRounds;
        
        this.redis = new Redis( {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
        } );
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    generateOtp(): string {
        return Math.floor( 100000 + Math.random() * 900000 ).toString();
    }

    async storeOtp( sessionId: string, otp: string ): Promise<void> {
        const key = `otp:${ sessionId }`;
        const hashedOtp = await bcrypt.hash( otp, this.SALT_ROUNDS );
        await this.redis.setex( key, this.OTP_EXPIRY, hashedOtp );
        this.logger.log( `OTP stored for sessionId ${ sessionId }` );
    }

    async verifyOtp( sessionId: string, otp: string ): Promise<boolean> {
        const key = `otp:${ sessionId }`;
        const storedHashedOtp = await this.redis.get( key );
        
        if ( !storedHashedOtp ) {
            this.logger.warn( `OTP not found or expired for user ${ sessionId }` );
            return false;
        }

        const isValid = await bcrypt.compare( otp, storedHashedOtp );
        
        if ( isValid ) {
            await this.redis.del( key );
            this.logger.log( `OTP verified and deleted for session ${sessionId} ` );
        } else {
            this.logger.warn( `Invalid OTP for session ${sessionId}` );
        }

        return isValid;
    }

    async storePasswordResetOtp( sessionId: string, otp: string ): Promise<void> {
        const key = `password-reset:${ sessionId }`;
        const hashedOtp = await bcrypt.hash( otp, this.SALT_ROUNDS );
        await this.redis.setex( key, this.OTP_EXPIRY, hashedOtp );
        this.logger.log( `Password reset OTP stored for session ${sessionId}` );
    }

    async verifyPasswordResetOtp( sessionId: string, otp: string ): Promise<boolean> {
        const key = `password-reset:${ sessionId }`;
        const storedHashedOtp = await this.redis.get( key );
        
        if ( !storedHashedOtp ) {
            this.logger.warn( `Password reset OTP not found or expired session ${ sessionId }` );
            return false;
        }

        const isValid = await bcrypt.compare( otp, storedHashedOtp );
        
        if ( isValid ) {
            await this.redis.del( key );
            this.logger.log( `Password reset OTP verified and deleted for sessionId ${ sessionId }` );
        } else {
            this.logger.warn( `Invalid password reset OTP for sessionId ${ sessionId }` );
        }

        return isValid;
    }
}

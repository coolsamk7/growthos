import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
    private redis: Redis;
    private readonly logger = new Logger( OtpService.name );
    private readonly OTP_EXPIRY = 600; // 10 minutes in seconds

    constructor( private readonly configService: ConfigService ) {
        const redisConfig: any = this.configService.get( 'redis' );
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

    async storeOtp( userId: string, otp: string ): Promise<void> {
        const key = `otp:${ userId }`;
        await this.redis.setex( key, this.OTP_EXPIRY, otp );
        this.logger.log( `OTP stored for user ${ userId }` );
    }

    async verifyOtp( userId: string, otp: string ): Promise<boolean> {
        const key = `otp:${ userId }`;
        const storedOtp = await this.redis.get( key );
        
        if ( !storedOtp ) {
            this.logger.warn( `OTP not found or expired for user ${ userId }` );
            return false;
        }

        const isValid = storedOtp === otp;
        
        if ( isValid ) {
            await this.redis.del( key );
            this.logger.log( `OTP verified and deleted for user ${ userId }` );
        } else {
            this.logger.warn( `Invalid OTP for user ${ userId }` );
        }

        return isValid;
    }
}

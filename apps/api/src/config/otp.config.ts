import { registerAs } from '@nestjs/config';

export const otpConfig = registerAs( 'otp', () => ( {
    expiry: parseInt( process.env.OTP_EXPIRY || '600', 10 ), // 10 minutes in seconds
    saltRounds: parseInt( process.env.OTP_SALT_ROUNDS || '10', 10 ),
} ) );

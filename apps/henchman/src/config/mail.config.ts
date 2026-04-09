import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs( 'mail', () => {
    const env = process.env;
    return {
        smtp: {
            host: env.SMTP_HOST || 'localhost',
            port: +( env.SMTP_PORT || 1025 ),
            secure: env.SMTP_SECURE === 'true',
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASSWORD,
            },
        },
        from: env.SMTP_FROM || `no-reply@${ env.SMTP_DOMAIN || 'localhost' }`,
    };
} );

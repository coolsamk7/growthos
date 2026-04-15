import { registerAs } from '@nestjs/config';

export const queueConfig = registerAs( 'queue', () => {
    const env = process.env;
    return {
        connection: {
            host: env.REDIS_HOST || 'localhost',
            port: parseInt( env.REDIS_PORT || '6379', 10 ),
            password: env.REDIS_PASSWORD,
            db: parseInt( env.REDIS_DB || '0', 10 ),
        },
    };
} );

import { registerAs } from '@nestjs/config';

export const kafkaConfig = registerAs( 'kafka', () => {
    const env = process.env;
    return {
        brokers: ( env.KAFKA_BROKERS || 'localhost:9092' ).split( ',' ),
        clientId: env.KAFKA_CLIENT_ID || 'henchman',
        groupId: env.KAFKA_GROUP_ID || 'henchman-group',
    };
} );

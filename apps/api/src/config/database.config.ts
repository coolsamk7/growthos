import * as entities from '@growthos/nestjs-database/entities';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = registerAs( 'database.config', (): TypeOrmModuleOptions => {
    const env = process.env;
    return {
        type: 'postgres',
        database: env.DATABASE_NAME,
        host: env.DATABASE_HOST,
        port: +env.DATABASE_PORT,
        username: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        maxQueryExecutionTime: 1000,
        extra: {
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        },
    };
} );

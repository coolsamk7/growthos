import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, jwtConfig, loggerConfig, queueConfig, redisConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth';
import { QueueModule } from './modules/queue'; 
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ databaseConfig, loggerConfig, jwtConfig, queueConfig, redisConfig ],
        } ),
        LoggerModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'logger.config' );
            },
        } ),
        JwtModule.registerAsync( {
            global: true,
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'jwt.config' );
            },
        } ),
        PassportModule.register( {
            defaultStrategy: 'jwt',
        } ),
        TypeOrmModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            async useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'database.config' );
            },
        } ),
        BullModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => {
                return configService.getOrThrow( 'queue' ) 
            }
        } ),
        BullModule.registerQueue( {
            name: 'mail'
        } ),
        BullBoardModule.forRoot( {
            route: '/admin/queues',
            adapter: ExpressAdapter,
        } ),
        BullBoardModule.forFeature( {
            name: 'mail',
            adapter: BullMQAdapter,
        } ),
        AuthModule,
        QueueModule
    ],
    providers: []
} )
export class AppModule {}

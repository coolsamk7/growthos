import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { mailConfig, queueConfig, loggerConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { MailService } from './mail/mail.service';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ mailConfig, queueConfig, loggerConfig ],
        } ),
        LoggerModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'logger.config' );
            },
        } ),
        BullModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => ( {
                connection: configService.get( 'queue.redis' ),
            } ),
        } ),
        BullModule.registerQueue( {
            name: 'mail',
        } ),
    ],
    providers: [ MailService ],
} )
export class AppModule {}

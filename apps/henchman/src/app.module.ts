import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mailConfig, queueConfig, loggerConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { MailService } from './mail/mail.service';
import { MailQueueConsumer } from './consumers/mail-queue.consumer';

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
    ],
    providers: [ MailService, MailQueueConsumer ],
} )
export class AppModule {}

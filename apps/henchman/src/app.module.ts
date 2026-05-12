import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mailConfig, loggerConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { MailService } from './mail/mail.service';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ mailConfig, loggerConfig ],
        } ),
        LoggerModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'logger.config' );
            },
        } ),
    ],
    providers: [ MailService ],
} )
export class AppModule {}

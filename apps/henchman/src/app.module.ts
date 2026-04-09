import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailConfig, kafkaConfig } from './config';
import { MailService } from './mail/mail.service';
import { MailConsumer } from './consumers/mail.consumer';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ mailConfig, kafkaConfig ],
        } ),
    ],
    providers: [ MailService, MailConsumer ],
} )
export class AppModule {}

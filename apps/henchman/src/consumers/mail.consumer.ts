import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MailConsumer {
    private kafka: Kafka;
    private consumer: Consumer;
    private readonly logger = new Logger( MailConsumer.name );

    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) {
        const kafkaConfig: any = this.configService.get( 'kafka' );
        this.kafka = new Kafka( {
            clientId: kafkaConfig.clientId,
            brokers: kafkaConfig.brokers,
        } );
        this.consumer = this.kafka.consumer( { groupId: kafkaConfig.groupId } );
    }

    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe( { topic: 'mail', fromBeginning: false } );

        await this.consumer.run( {
            eachMessage: async ( { topic, partition, message } ) => {
                try {
                    const event = JSON.parse( message.value!.toString() );
                    this.logger.log( `Processing mail event: ${ event.type }` );

                    switch ( event.type ) {
                        case 'signup_welcome':
                            await this.mailService.sendWelcomeEmail( event.email, event.firstName );
                            break;
                        case 'send_otp':
                            await this.mailService.sendOtpEmail( event.email, event.code );
                            break;
                        default:
                            this.logger.warn( `Unknown event type: ${ event.type }` );
                    }
                } catch ( error ) {
                    this.logger.error( `Failed to process mail event: ${ error }` );
                }
            },
        } );
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }
}

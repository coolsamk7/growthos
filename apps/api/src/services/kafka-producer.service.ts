import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
    private kafka: Kafka;
    private producer: Producer;
    private readonly logger = new Logger( KafkaProducerService.name );

    constructor( private readonly configService: ConfigService ) {
        const kafkaConfig: any = this.configService.get( 'kafka' );
        this.kafka = new Kafka( {
            clientId: kafkaConfig.clientId,
            brokers: kafkaConfig.brokers,
        } );
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        this.logger.log( 'Kafka producer connected' );
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }

    async sendMailEvent( type: string, data: Record<string, any> ) {
        try {
            await this.producer.send( {
                topic: 'mail',
                messages: [
                    {
                        key: data.email,
                        value: JSON.stringify( { type, ...data } ),
                    },
                ],
            } );
            this.logger.log( `Mail event published: ${ type }` );
        } catch ( error ) {
            this.logger.error( `Failed to publish mail event: ${ error }` );
            throw error;
        }
    }
}

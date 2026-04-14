import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Injectable()
export class QueueProducerService implements OnModuleDestroy {
    private mailQueue: Queue;
    private readonly logger = new Logger( QueueProducerService.name );

    constructor(
        private readonly configService: ConfigService,
    ) { 
        this.logger.log( 'Mail queue initialized' );
    }

    async onModuleDestroy() {
        await this.mailQueue.close();
    }

    async sendMailEvent( type: string, data: Record<string, any> ) {
        try {
            await this.mailQueue.add( type, { type, ...data } );
            this.logger.log( `Mail event published: ${ type }` );
        } catch ( error ) {
            this.logger.error( `Failed to publish mail event: ${ error }` );
            throw error;
        }
    }
}

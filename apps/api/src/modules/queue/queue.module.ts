import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { MailQueueProducerService } from './mail-queue-producer.service';

@Module( {
    imports: [
        BullModule.registerQueue( {
            name: 'mail',
        } ),
    ],
    providers: [ QueueService, MailQueueProducerService ],
    exports: [ QueueService, MailQueueProducerService ],
} )
export class QueueModule {}

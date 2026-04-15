import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue( 'mail' ) private readonly mailQueue: Queue,
    ) {}

    async addMailJob( data: any, options?: any ) {
        return await this.mailQueue.add( 'send-mail', data, options );
    }

    async getMailQueueInfo() {
        return {
            waiting: await this.mailQueue.getWaitingCount(),
            active: await this.mailQueue.getActiveCount(),
            completed: await this.mailQueue.getCompletedCount(),
            failed: await this.mailQueue.getFailedCount(),
        };
    }

    async removeMailJob( jobId: string ) {
        const job = await this.mailQueue.getJob( jobId );
        if ( job ) {
            await job.remove();
        }
    }

    async cleanMailQueue() {
        await this.mailQueue.drain();
    }
}

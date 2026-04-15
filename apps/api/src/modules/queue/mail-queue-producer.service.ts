import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';

@Injectable()
export class MailQueueProducerService {
    constructor(
        @InjectQueue( 'mail' ) private readonly mailQueue: Queue,
    ) {}

    async addToMailQueue( jobName: string, data: any, options?: JobsOptions ) {
        return await this.mailQueue.add( jobName, data, {
            removeOnComplete: false,
            removeOnFail: false,
            ...options,
        } );
    }

    async addBulkToMailQueue( jobs: Array<{ name: string; data: any; opts?: JobsOptions }> ) {
        return await this.mailQueue.addBulk( jobs );
    }

    async pauseMailQueue() {
        await this.mailQueue.pause();
    }

    async resumeMailQueue() {
        await this.mailQueue.resume();
    }

    async getMailJob( jobId: string ) {
        return await this.mailQueue.getJob( jobId );
    }

    async getMailJobs( types: Array<'completed' | 'waiting' | 'active' | 'delayed' | 'failed'> ) {
        return await this.mailQueue.getJobs( types );
    }
}

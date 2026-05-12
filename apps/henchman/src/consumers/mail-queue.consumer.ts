import { Processor, WorkerHost, OnWorkerEvent, Process } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';


@Processor( 'mail', { concurrency: 5 } )
export class MailQueueConsumer extends WorkerHost {
    private readonly logger = new Logger( MailQueueConsumer.name );

    constructor(
        private readonly mailService: MailService,
    ) {
        super();
    }
    @Process()
    async process( job: Job ): Promise<any> {
        try {
            const jobName = job.name;
            const data = job.data;
            this.logger.log( `Processing mail job: ${ jobName }` );

            switch ( jobName ) {
                case 'sendWelcomeEmail':
                    await this.mailService.sendWelcomeEmail( data.email, data.firstName );
                    break;
                case 'sendOTP':
                    await this.mailService.sendOtpEmail( data.email, data.code || data.otp );
                    break;
                case 'sendPasswordResetOTP':
                    await this.mailService.sendPasswordResetOtpEmail( data.email, data.code || data.otp );
                    break;
                case 'sendPasswordChangeNotification':
                    await this.mailService.sendPasswordChangeNotification( data.email, data.firstName );
                    break;
                default:
                    this.logger.warn( `Unknown job name: ${ jobName }` );
            }
        } catch ( error ) {
            this.logger.error( `Failed to process mail job: ${ error }` );
            throw error;
        }
    }

    @OnWorkerEvent( 'completed' )
    onCompleted( job: Job ) {
        this.logger.log( `Job ${ job.id } completed successfully` );
    }

    @OnWorkerEvent( 'failed' )
    onFailed( job: Job, err: Error ) {
        this.logger.error( `Job ${ job?.id } failed: ${ err.message }` );
    }
}

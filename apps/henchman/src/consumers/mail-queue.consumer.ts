import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import { MailService } from '../mail/mail.service';


@Injectable()
export class MailQueueConsumer implements OnModuleInit, OnModuleDestroy {
    private worker: Worker;
    private readonly logger = new Logger( MailQueueConsumer.name );

    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) {}

    async onModuleInit() {
        const queueConfig: any = this.configService.get( 'queue' );
        
        this.worker = new Worker(
            'mail',
            async ( job: Job ) => {
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
            },
            {
                connection: queueConfig.redis,
                concurrency: 5,
            }
        );

        this.worker.on( 'completed', ( job ) => {
            this.logger.log( `Job ${ job.id } completed successfully` );
        } );

        this.worker.on( 'failed', ( job, err ) => {
            this.logger.error( `Job ${ job?.id } failed: ${ err.message }` );
        } );

        this.logger.log( 'Mail queue worker started' );
    }

    async onModuleDestroy() {
        await this.worker.close();
    }
}

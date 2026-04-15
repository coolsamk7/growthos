import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { QueueProducerService } from '../services/queue-producer.service';

async function testQueue() {
    const app = await NestFactory.createApplicationContext( AppModule );
    const queueProducer = app.get( QueueProducerService );

    console.log( 'Sending test email to queue...' );

    await queueProducer.sendMailEvent( 'send_otp', {
        email: 'test@example.com',
        code: '123456',
    } );

    console.log( 'Test email sent to queue successfully!' );

    await app.close();
}

testQueue().catch( console.error );

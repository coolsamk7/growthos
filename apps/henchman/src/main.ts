import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create( AppModule, { bufferLogs: true } );
    const logger = app.get<Logger>( Logger );
    app.useLogger( logger );

    await app.listen( process.env.PORT || 3001 );
    logger.log( `Henchman worker running on port ${ process.env.PORT || 3001 }` );
}

bootstrap();

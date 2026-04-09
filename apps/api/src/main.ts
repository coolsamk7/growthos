import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/setup-swagger.util';
import { apiReference } from '@scalar/nestjs-api-reference';
import { updateGlobalConfig } from 'nestjs-paginate';

updateGlobalConfig( {
    defaultLimit: 20,
    defaultMaxLimit: 1000,
} );

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>( AppModule, { bufferLogs: true } );
    const configService = app.get<ConfigService>( ConfigService );
    const logger = app.get<Logger>( Logger );
    app.useLogger( logger );

    app.enableShutdownHooks();

    app.use( json( { limit: '50mb' } ) );
    app.use( urlencoded( { extended: true, limit: '50mb' } ) );
  
    app.enableVersioning( {
        type: VersioningType.URI,
    } );

    setupSwagger( app );
    app.use(
        '/reference',
        apiReference( {
            theme: 'mars',
            url: '/openapi.json',
            _integration: 'nestjs',
        } ),
    );

    const HOST = configService.get<string>( 'HOST', '0.0.0.0' );
    const PORT = +configService.get<string>( 'PORT', '5600' );

    await app.listen( PORT, HOST, () => {
        logger.log( `Application started listening at http://${HOST}:${PORT}` );
    } );
}
bootstrap();

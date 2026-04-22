import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/setup-swagger.util';
import { apiReference } from '@scalar/nestjs-api-reference';
import { updateGlobalConfig } from 'nestjs-paginate';
import basicAuth from 'express-basic-auth';

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
    app.use(
        '/admin/queues',
        basicAuth( {
          users: { admin: 'password' },
          challenge: true,
         } ),
    );

    app.enableCors( {
        origin: configService.get<string>( 'CORS_ORIGIN', '*' ),
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization,Accept',
    } );

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
        logger.log( `Bull Board available at http://${HOST}:${PORT}/admin/queues` );
    } );
}
bootstrap();

import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { version } from '../../package.json';
import  { RequestMethod } from '@nestjs/common';

export const loggerConfig = registerAs( 'logger.config', (): Params => {
    const env = process.env;

   const params: Params = {
        pinoHttp: {
           serializers: {
                req( req: any ) {
                    return {
                        method: req.method,
                        url: req.url,
                    };
                },
                res( res: any ) {
                    return {
                        statusCode: res.statusCode,
                    };
                },
            },
            base: {
                pid: process.pid,
                serviceName: 'api',
                serviceVersion: version,
            },
            transport: {
                targets: [
                    {
                        level: 'trace',
                        target: 'pino-pretty',
                        options: {
                            all: true,
                            colorize: true,
                        },
                    },
                ],
            },
        },
    };
    return params;
} );

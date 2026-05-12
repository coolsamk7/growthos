import {
    DynamicModule,
    Module,
    ModuleMetadata,
    Provider,
} from '@nestjs/common';

import { Inngest } from 'inngest';

import { InngestService } from './inngest.service';
import { INNGEST_CLIENT } from './inngest.constants';

export interface InngestModuleOptions {
    appId: string;
    baseUrl: string
    eventKey: string
}

export interface InngestModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {

    inject?: any[];

    useFactory?: (
        ...args: any[]
    ) =>
        | Promise<InngestModuleOptions>
        | InngestModuleOptions;
}

@Module( {} )
export class InngestModule {

    static forRoot(
        options: InngestModuleOptions,
    ): DynamicModule {

        const inngestClient = new Inngest( {
            id: options.appId,
            baseUrl: options.baseUrl,
            eventKey: options.eventKey
        } );

        return {
            module: InngestModule,
            providers: [
                {
                    provide: Inngest,
                    useValue: inngestClient,
                },
                InngestService,
            ],
            exports: [
                InngestService,
                Inngest,
            ],
        };
    }

    static forRootAsync(
        options: InngestModuleAsyncOptions,
    ): DynamicModule {

        const inngestProvider: Provider = {
            provide: INNGEST_CLIENT,

            useFactory: async (
                ...args: any[]
            ) => {

                const config =
                    await options.useFactory?.(
                        ...args,
                    );

                return new Inngest( {
                    id: config?.appId,

                    baseUrl:
                        config?.baseUrl,

                    eventKey:
                        config?.eventKey,
                } );
            },

            inject: options.inject || [],
        };

        return {
            module: InngestModule,

            imports: options.imports || [],

            providers: [ inngestProvider ],

            exports: [ inngestProvider ],
        };
    }
}

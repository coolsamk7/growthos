import {
    Inject,
    Injectable,
} from '@nestjs/common';

import { Inngest } from 'inngest';

@Injectable()
export class InngestService {

    constructor(
        @Inject( Inngest )
        private readonly inngest: Inngest,
    ) {}

    async emit(
        name: string,
        data: unknown,
    ) {
        return this.inngest.send( {
            name,
            data,
        } );
    }
}

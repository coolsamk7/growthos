import { Module } from '@nestjs/common';
import { SessionTagsController } from './controllers/v1/session-tags.controller';

@Module( {
    controllers: [ SessionTagsController ],
} )
export class SessionTagsModule {}

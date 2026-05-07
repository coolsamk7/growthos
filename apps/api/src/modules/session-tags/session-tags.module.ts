import { Module } from '@nestjs/common';
import { SessionTagsController } from './controllers/v1/session-tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionTagEntity } from '@growthos/nestjs-database/entities'

@Module( {
    imports: [ TypeOrmModule.forFeature( [ SessionTagEntity ] ) ],
    controllers: [ SessionTagsController ],
} )
export class SessionTagsModule {}

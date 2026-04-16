import { Module } from '@nestjs/common';
import { NotesController } from './controllers/v1/notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ NoteEntity ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ NotesController ],
} )
export class NotesModule {}

import { Module } from '@nestjs/common';
import { TagsController } from './controllers/v1/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
    TagEntity,
    MasterProblemTagEntity,
    UserProblemTagEntity,
    UserModuleTagEntity,
    UserTopicTagEntity,
    StudySessionTagEntity
} from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module( {
    imports: [
        TypeOrmModule.forFeature( [ 
            TagEntity,
            MasterProblemTagEntity,
            UserProblemTagEntity,
            UserModuleTagEntity,
            UserTopicTagEntity,
            StudySessionTagEntity
        ] ),
        CaslModule.forRoot(),
    ],
    controllers: [ TagsController ],
} )
export class TagsModule {}

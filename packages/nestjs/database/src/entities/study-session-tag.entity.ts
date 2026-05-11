import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { TagEntity } from './tag.entity.js';
import { StudySessionEntity } from './study-session.entity.js';

@Entity( 'study_session_tags' )
@Index( [ 'studySessionId', 'tagId' ], { unique: true } )
export class StudySessionTagEntity extends IdTimestamppedEntity {
    @Column( { name: 'study_session_id', type: 'varchar' } )
    studySessionId: string;

    @ManyToOne( () => StudySessionEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'study_session_id' } )
    studySession: StudySessionEntity;

    @Column( { name: 'tag_id', type: 'varchar' } )
    tagId: string;

    @ManyToOne( () => TagEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'tag_id' } )
    tag: TagEntity;
}

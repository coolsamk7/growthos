import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { TagEntity } from './tag.entity.js';
import { UserTopicEntity } from './user-topic.entity.js';

@Entity( 'user_topic_tags' )
@Index( [ 'userTopicId', 'tagId' ], { unique: true } )
export class UserTopicTagEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_topic_id', type: 'varchar' } )
    userTopicId: string;

    @ManyToOne( () => UserTopicEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic: UserTopicEntity;

    @Column( { name: 'tag_id', type: 'varchar' } )
    tagId: string;

    @ManyToOne( () => TagEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'tag_id' } )
    tag: TagEntity;
}

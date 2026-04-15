import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'

@Entity( 'notes' )
@Index( [ 'userTopicId' ] )
export class NoteEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_topic_id', type: 'varchar' } )
    userTopicId: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic: UserTopicEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'text' } )
    content: string

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'boolean', default: false, name: 'is_pinned' } )
    isPinned: boolean
}

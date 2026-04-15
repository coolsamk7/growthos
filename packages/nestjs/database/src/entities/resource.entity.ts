import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'

@Entity( 'resources' )
@Index( [ 'userTopicId' ] )
export class ResourceEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_topic_id', type: 'varchar' } )
    userTopicId: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic: UserTopicEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar' } )
    url: string

    @Column( { type: 'varchar', nullable: true } )
    type?: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'boolean', default: false, name: 'is_completed' } )
    isCompleted: boolean
}

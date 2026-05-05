import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'
import { UserModuleEntity } from './user-module.entity.js'
import { UserProblemEntity } from './user-problem.entity.js'

@Entity( 'resources' )
@Index( [ 'entityType', 'entityId' ] )
export class ResourceEntity extends IdTimestamppedEntity {
    // Generic reference - can point to Module, Topic, or Problem
    @Column( { name: 'entity_type', type: 'varchar' } )
    entityType: 'module' | 'topic' | 'problem'

    @Column( { name: 'entity_id', type: 'varchar' } )
    entityId: string

    // Legacy field - keep for backward compatibility
    @Column( { name: 'user_topic_id', type: 'varchar', nullable: true } )
    userTopicId?: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic?: UserTopicEntity

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

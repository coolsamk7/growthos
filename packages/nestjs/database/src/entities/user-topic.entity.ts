import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserLearningPathEntity } from './user-learning-path.entity.js'
import { MasterTopicEntity } from './master-topic.entity.js'
import { TopicStatus } from '@growthos/nestjs-shared'

@Entity( 'user_topics' )
@Index( [ 'userLearningPathId', 'orderIndex' ] )
export class UserTopicEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_learning_path_id', type: 'varchar' } )
    userLearningPathId: string

    @ManyToOne( () => UserLearningPathEntity )
    @JoinColumn( { name: 'user_learning_path_id' } )
    userLearningPath: UserLearningPathEntity

    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'enum', enum: TopicStatus, default: TopicStatus.NOT_STARTED } )
    status: TopicStatus

    @Column( { type: 'timestamp', nullable: true, name: 'last_revised_at' } )
    lastRevisedAt?: Date

    @Column( { type: 'integer', default: 0, name: 'confidence_score' } )
    confidenceScore: number

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'varchar', nullable: true, name: 'master_topic_id' } )
    masterTopicId?: string

    @ManyToOne( () => MasterTopicEntity )
    @JoinColumn( { name: 'master_topic_id' } )
    masterTopic?: MasterTopicEntity
}

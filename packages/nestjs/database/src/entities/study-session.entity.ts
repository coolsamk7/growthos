import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { UserLearningPathEntity } from './user-learning-path.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'

@Entity( 'study_sessions' )
@Index( [ 'userId', 'sessionDate' ] )
@Index( [ 'userLearningPathId' ] )
export class StudySessionEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { name: 'user_learning_path_id', type: 'varchar', nullable: true } )
    userLearningPathId?: string

    @ManyToOne( () => UserLearningPathEntity )
    @JoinColumn( { name: 'user_learning_path_id' } )
    userLearningPath?: UserLearningPathEntity

    @Column( { name: 'user_topic_id', type: 'varchar', nullable: true } )
    userTopicId?: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic?: UserTopicEntity

    @Column( { type: 'integer', name: 'duration_minutes' } )
    durationMinutes: number

    @Column( { type: 'text', nullable: true } )
    notes?: string

    @Column( { type: 'date', name: 'session_date' } )
    @Index()
    sessionDate: Date
}

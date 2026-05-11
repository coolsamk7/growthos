import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { UserLearningPathEntity } from './user-learning-path.entity.js'
import { UserModuleEntity } from './user-module.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'
import { UserProblemEntity } from './user-problem.entity.js'
import { StudySessionTagEntity } from './study-session-tag.entity.js'

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

    @Column( { name: 'user_module_id', type: 'varchar', nullable: true } )
    userModuleId?: string

    @ManyToOne( () => UserModuleEntity )
    @JoinColumn( { name: 'user_module_id' } )
    userModule?: UserModuleEntity

    @Column( { name: 'user_topic_id', type: 'varchar', nullable: true } )
    userTopicId?: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic?: UserTopicEntity

    @Column( { name: 'user_problem_id', type: 'varchar', nullable: true } )
    userProblemId?: string

    @ManyToOne( () => UserProblemEntity )
    @JoinColumn( { name: 'user_problem_id' } )
    userProblem?: UserProblemEntity

    @Column( { type: 'integer', name: 'duration_minutes' } )
    durationMinutes: number

    @Column( { type: 'integer', name: 'duration_seconds', nullable: true } )
    durationSeconds?: number

    @Column( { type: 'text', nullable: true } )
    notes?: string

    @Column( { type: 'date', name: 'session_date' } )
    @Index()
    sessionDate: Date

    @Column( { type: 'timestamp', name: 'start_time', nullable: true } )
    startTime?: Date

    @Column( { type: 'timestamp', name: 'end_time', nullable: true } )
    endTime?: Date

    @Column( { type: 'boolean', name: 'is_active', default: false } )
    isActive: boolean
    
    @OneToMany( () => StudySessionTagEntity, studySessionTag => studySessionTag.studySession )
    studySessionTags: StudySessionTagEntity[];
}

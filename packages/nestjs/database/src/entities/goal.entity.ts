import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { UserLearningPathEntity } from './user-learning-path.entity.js'

@Entity( 'goals' )
@Index( [ 'userId' ] )
@Index( [ 'userId', 'status' ] )
export class GoalEntity extends IdTimestamppedEntity {
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

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'integer', nullable: true, name: 'target_problems' } )
    targetProblems?: number

    @Column( { type: 'integer', default: 0, name: 'completed_problems' } )
    completedProblems: number

    @Column( { type: 'integer', nullable: true, name: 'target_minutes' } )
    targetMinutes?: number

    @Column( { type: 'integer', default: 0, name: 'completed_minutes' } )
    completedMinutes: number

    @Column( { type: 'date', name: 'start_date' } )
    startDate: Date

    @Column( { type: 'date', name: 'target_date' } )
    targetDate: Date

    @Column( { type: 'varchar', default: 'active' } )
    @Index()
    status: string

    @Column( { type: 'timestamp', nullable: true, name: 'completed_at' } )
    completedAt?: Date
}

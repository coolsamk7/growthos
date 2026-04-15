import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { MasterLearningPathEntity } from './master-learning-path.entity.js'

@Entity( 'user_learning_paths' )
@Index( [ 'userId' ] )
export class UserLearningPathEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'timestamp', nullable: true, name: 'target_date' } )
    targetDate?: Date

    @Column( { type: 'integer', default: 0, name: 'target_problems' } )
    targetProblems: number

    @Column( { type: 'varchar', nullable: true, name: 'master_learning_path_id' } )
    masterLearningPathId?: string

    @ManyToOne( () => MasterLearningPathEntity )
    @JoinColumn( { name: 'master_learning_path_id' } )
    masterLearningPath?: MasterLearningPathEntity
}

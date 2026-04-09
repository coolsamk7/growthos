import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { LearningPathEntity } from './learning-path.entity.js'

@Entity( 'enrollments' )
@Unique( [ 'userId', 'learningPathId' ] )
@Index( [ 'learningPathId' ] )
export class EnrollmentEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @Column( { name: 'learning_path_id', type: 'varchar' } )
    learningPathId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @ManyToOne( () => LearningPathEntity )
    @JoinColumn( { name: 'learning_path_id' } )
    learningPath: LearningPathEntity
}

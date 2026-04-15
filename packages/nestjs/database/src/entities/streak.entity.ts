import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity( 'streaks' )
@Index( [ 'userId' ], { unique: true } )
export class StreakEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @OneToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { type: 'integer', default: 0, name: 'current_streak' } )
    currentStreak: number

    @Column( { type: 'integer', default: 0, name: 'longest_streak' } )
    longestStreak: number

    @Column( { type: 'date', nullable: true, name: 'last_activity_date' } )
    lastActivityDate?: Date

    @Column( { type: 'integer', default: 0, name: 'total_study_days' } )
    totalStudyDays: number

    @Column( { type: 'integer', default: 0, name: 'total_problems_solved' } )
    totalProblemsSolved: number
}

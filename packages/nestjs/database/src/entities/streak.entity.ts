import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity( 'streaks' )
@Unique( [ 'userId' ] )
export class StreakEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { type: 'integer', default: 0 } )
    currentStreak: number

    @Column( { type: 'integer', default: 0 } )
    longestStreak: number

    @Column( { type: 'timestamptz', nullable: true } )
    lastStudyDate?: Date
}

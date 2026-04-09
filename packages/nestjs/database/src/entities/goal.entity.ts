import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'

@Entity( 'goals' )
@Index( [ 'userId' ] )
export class GoalEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'integer' } )
    targetHours: number

    @Column( { type: 'integer', default: 0 } )
    completedHours: number

    @Column( { type: 'timestamptz' } )
    startDate: Date

    @Column( { type: 'timestamptz' } )
    endDate: Date
}

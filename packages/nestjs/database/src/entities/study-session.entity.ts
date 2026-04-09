import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { ItemEntity } from './item.entity.js'

@Entity( 'study_sessions' )
@Index( [ 'userId', 'date' ] )
@Index( [ 'itemId' ] )
export class StudySessionEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { name: 'item_id', type: 'varchar', nullable: true } )
    itemId?: string

    @ManyToOne( () => ItemEntity )
    @JoinColumn( { name: 'item_id' } )
    item?: ItemEntity

    @Column( { type: 'integer' } )
    duration: number

    @Column( { type: 'varchar', nullable: true } )
    notes?: string

    @Column( { type: 'timestamptz' } )
    @Index()
    date: Date
}

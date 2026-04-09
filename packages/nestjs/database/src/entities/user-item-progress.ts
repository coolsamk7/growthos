import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserEntity } from './user.entity.js'
import { ItemEntity } from './item.entity.js'
import { ProgressStatus } from '@growthos/nestjs-shared'

@Entity( 'user_item_progress' )
@Unique( [ 'userId', 'itemId' ] )
@Index( [ 'userId' ] )
export class UserItemProgressEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @Column( { name: 'item_id', type: 'varchar' } )
    itemId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @ManyToOne( () => ItemEntity )
    @JoinColumn( { name: 'item_id' } )
    item: ItemEntity

    @Column( {
        type: 'enum',
        enum: ProgressStatus,
        default: ProgressStatus.NOT_STARTED,
    } )
    status: ProgressStatus

    @Column( { type: 'integer', default: 0 } )
    attempts: number

    @Column( { type: 'timestamptz', nullable: true } )
    completedAt?: Date
}

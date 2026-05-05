import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { UserEntity } from './user.entity.js';

@Entity( 'session_tags' )
@Unique( [ 'userId', 'name' ] )
export class SessionTagEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( { type: 'varchar', length: 50 } )
    name: string

    @Column( { type: 'varchar', length: 7, nullable: true } )
    color?: string
}

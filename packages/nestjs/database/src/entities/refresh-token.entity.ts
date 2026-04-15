import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { UserEntity } from './user.entity.js';

@Entity( { name: 'refresh_tokens' } )
export class RefreshTokenEntity extends IdTimestamppedEntity {
    @Column( 'text', { nullable: false } )
    token: string;

    @Column( { type: 'varchar', name: 'user_id' } )
    userId: string;

    // Relations

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity;
}

import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { UserEntity } from './user.entity.js';

@Entity( { name: 'refresh_tokens' } )
export class RefreshTokenEntity extends IdTimestamppedEntity {
    @Column( 'text', { nullable: false } )
    token: string;

    @RelationId( 'user' )
    userId: string;

    // Relations

    @ManyToOne( () => UserEntity )
    user: UserEntity;
}

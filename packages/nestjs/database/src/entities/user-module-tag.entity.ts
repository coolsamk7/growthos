import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { TagEntity } from './tag.entity.js';
import { UserModuleEntity } from './user-module.entity.js';

@Entity( 'user_module_tags' )
@Index( [ 'userModuleId', 'tagId' ], { unique: true } )
export class UserModuleTagEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_module_id', type: 'varchar' } )
    userModuleId: string;

    @ManyToOne( () => UserModuleEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'user_module_id' } )
    userModule: UserModuleEntity;

    @Column( { name: 'tag_id', type: 'varchar' } )
    tagId: string;

    @ManyToOne( () => TagEntity, { onDelete: 'CASCADE' } )
    @JoinColumn( { name: 'tag_id' } )
    tag: TagEntity;
}

import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IdTimestamppedEntity } from './id-timestampped.entity.js';
import { UserEntity } from './user.entity.js';
import { LearningPathStatus } from '@growthos/nestjs-shared';

@Entity( 'learning_paths' )
export class LearningPathEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar' } )
    title: string;

    @Column( { type: 'text', nullable: true } )
    description?: string;

    @Column( { type: 'jsonb', default: [] } )
    content: any[];

    @Column( {
        type: 'enum',
        enum: LearningPathStatus,
        default: LearningPathStatus.DRAFT,
    } )
    @Index()
    status: LearningPathStatus;

    @Column( { type: 'varchar', nullable: true } )
    thumbnail?: string;

    @Column( { type: 'int', default: 0 } )
    estimatedHours: number;

    @Column( { type: 'varchar', array: true, default: [] } )
    tags: string[];

    @ManyToOne( () => UserEntity, { nullable: false } )
    @JoinColumn( { name: 'createdBy' } )
    creator: UserEntity;

    @Column( { type: 'uuid' } )
    @Index()
    createdBy: string;
}

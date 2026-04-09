import { Entity, Column, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity( 'learning_paths' )
export class LearningPathEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar' } )
    @Index()
    title: string

    @Column( { type: 'varchar', nullable: true } )
    description?: string

    @Column( { type: 'boolean', default: true } )
    isPublic: boolean

    @Column( { type: 'varchar', nullable: true, name: 'created_by' } )
    createdBy?: string

    @Column( { type: 'varchar', name: 'master_learning_path_id', nullable: true } )
    masterLearningPathId: string
}

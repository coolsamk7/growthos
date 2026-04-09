import { Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity( 'master_learning_paths' )
export class MasterLearningPathEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar', nullable: true } )
    description?: string

    @Column( { type: 'boolean', default: true } )
    isActive: boolean
}

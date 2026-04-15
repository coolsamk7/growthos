import { Column, Entity } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity( 'master_learning_paths' )
export class MasterLearningPathEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'boolean', default: true, name: 'is_published' } )
    isPublished: boolean

    @Column( { type: 'integer', default: 0, name: 'adoption_count' } )
    adoptionCount: number
}

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { MasterLearningPathEntity } from './master-learning-path.entity.js'

@Entity( 'master_modules' )
@Index( [ 'masterLearningPathId', 'orderIndex' ] )
export class MasterModuleEntity extends IdTimestamppedEntity {
    @Column( { name: 'master_learning_path_id', type: 'varchar' } )
    masterLearningPathId: string

    @ManyToOne( () => MasterLearningPathEntity )
    @JoinColumn( { name: 'master_learning_path_id' } )
    masterLearningPath: MasterLearningPathEntity

    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'integer', nullable: true, name: 'estimated_hours' } )
    estimatedHours?: number

    @Column( { type: 'boolean', default: true, name: 'is_published' } )
    isPublished: boolean

    @Column( { type: 'varchar', nullable: true, name: 'icon' } )
    icon?: string
}

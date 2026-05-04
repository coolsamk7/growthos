import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { MasterLearningPathEntity } from './master-learning-path.entity.js'
import { MasterModuleEntity } from './master-module.entity.js'

@Entity( 'master_topics' )
@Index( [ 'masterModuleId', 'orderIndex' ] )
@Index( [ 'masterLearningPathId' ] )
export class MasterTopicEntity extends IdTimestamppedEntity {
    @Column( { name: 'master_learning_path_id', type: 'varchar', nullable: true } )
    masterLearningPathId?: string

    @ManyToOne( () => MasterLearningPathEntity )
    @JoinColumn( { name: 'master_learning_path_id' } )
    masterLearningPath?: MasterLearningPathEntity

    @Column( { name: 'master_module_id', type: 'varchar', nullable: true } )
    masterModuleId?: string

    @ManyToOne( () => MasterModuleEntity )
    @JoinColumn( { name: 'master_module_id' } )
    masterModule?: MasterModuleEntity

    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'boolean', default: true, name: 'is_published' } )
    isPublished: boolean
}

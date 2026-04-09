import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { MasterLearningPathEntity } from './master-learning-path.entity.js'

@Entity( 'master_modules' )
@Index( [ 'masterLearningPathId', 'order' ] )
export class MasterModuleEntity extends IdTimestamppedEntity {
    @Column( { name: 'master_learning_path_id', type: 'varchar' } )
    masterLearningPathId: string

    @ManyToOne( () => MasterLearningPathEntity )
    @JoinColumn( { name: 'master_learning_path_id' } )
    learningPath: MasterLearningPathEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar', nullable: true } )
    description?: string

    @Column( { type: 'integer' } )
    order: number
}

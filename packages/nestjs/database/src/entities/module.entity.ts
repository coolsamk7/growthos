import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { LearningPathEntity } from './learning-path.entity.js'

@Entity( 'modules' )
@Index( [ 'learningPathId', 'order' ] )
export class ModuleEntity extends IdTimestamppedEntity {
    @Column( { name: 'learning_path_id', type: 'varchar' } )
    learningPathId: string

    @ManyToOne( () => LearningPathEntity )
    @JoinColumn( { name: 'learning_path_id' } )
    learningPath: LearningPathEntity

    @Column( { name: 'master_module_id', type: 'varchar', nullable: true } )
    masterModuleId?: string;

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar', nullable: true } )
    description?: string

    @Column( { type: 'integer' } )
    order: number
}

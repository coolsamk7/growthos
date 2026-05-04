import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserLearningPathEntity } from './user-learning-path.entity.js'
import { MasterModuleEntity } from './master-module.entity.js'
import { ModuleStatus } from '@growthos/nestjs-shared'

@Entity( 'user_modules' )
@Index( [ 'userLearningPathId', 'orderIndex' ] )
export class UserModuleEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_learning_path_id', type: 'varchar' } )
    userLearningPathId: string

    @ManyToOne( () => UserLearningPathEntity )
    @JoinColumn( { name: 'user_learning_path_id' } )
    userLearningPath: UserLearningPathEntity

    @Column( { type: 'varchar', nullable: true, name: 'master_module_id' } )
    masterModuleId?: string

    @ManyToOne( () => MasterModuleEntity )
    @JoinColumn( { name: 'master_module_id' } )
    masterModule?: MasterModuleEntity

    @Column( { type: 'varchar' } )
    name: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'enum', enum: ModuleStatus, default: ModuleStatus.NOT_STARTED } )
    status: ModuleStatus

    @Column( { type: 'integer', default: 0 } )
    progress: number

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'timestamp', nullable: true, name: 'started_at' } )
    startedAt?: Date

    @Column( { type: 'timestamp', nullable: true, name: 'completed_at' } )
    completedAt?: Date
}

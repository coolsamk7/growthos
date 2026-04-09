import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { MasterModuleEntity } from './master-module.entity.js'
import { Difficulty, ItemType } from '@growthos/nestjs-shared'

@Entity( 'master_items' )
@Index( [ 'masterModuleId', 'order' ] )
export class MasterItemEntity extends IdTimestamppedEntity {
    @Column( { name: 'master_module_id', type: 'varchar' } )
    masterModuleId: string

    @ManyToOne( () => MasterModuleEntity )
    @JoinColumn( { name: 'master_module_id' } )
    module: MasterModuleEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'enum', enum: ItemType } )
    type: ItemType

    @Column( { type: 'enum', enum: Difficulty, nullable: true } )
    difficulty?: Difficulty

    @Column( { type: 'varchar', nullable: true } )
    link?: string

    @Column( { type: 'text', nullable: true } )
    content?: string

    @Column( { type: 'integer' } )
    order: number
}

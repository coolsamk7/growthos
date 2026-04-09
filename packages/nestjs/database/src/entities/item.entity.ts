import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { ModuleEntity } from './module.entity.js'
import { Difficulty, ItemType } from '@growthos/nestjs-shared'

@Entity( 'items' )
@Index( [ 'moduleId', 'order' ] )
export class ItemEntity extends IdTimestamppedEntity {
    @Column( { name: 'module_id', type: 'varchar' } )
    moduleId: string

    @ManyToOne( () => ModuleEntity )
    @JoinColumn( { name: 'module_id' } )
    module: ModuleEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'enum', enum: ItemType } )
    @Index()
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

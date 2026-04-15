import { Column, Entity, Index } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'

@Entity( 'tags' )
export class TagEntity extends IdTimestamppedEntity {
    @Column( { type: 'varchar', unique: true } )
    @Index()
    name: string

    @Column( { type: 'varchar', nullable: true } )
    category?: string

    @Column( { type: 'text', nullable: true } )
    description?: string

    @Column( { type: 'integer', default: 0, name: 'usage_count' } )
    usageCount: number
}

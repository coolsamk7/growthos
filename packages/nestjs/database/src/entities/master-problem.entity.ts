import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { MasterTopicEntity } from './master-topic.entity.js'
import { Difficulty, ProblemSource } from '@growthos/nestjs-shared'

@Entity( 'master_problems' )
@Index( [ 'masterTopicId', 'orderIndex' ] )
export class MasterProblemEntity extends IdTimestamppedEntity {
    @Column( { name: 'master_topic_id', type: 'varchar' } )
    masterTopicId: string

    @ManyToOne( () => MasterTopicEntity )
    @JoinColumn( { name: 'master_topic_id' } )
    masterTopic: MasterTopicEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar', nullable: true, name: 'external_url' } )
    externalUrl?: string

    @Column( { type: 'enum', enum: Difficulty } )
    difficulty: Difficulty

    @Column( { type: 'enum', enum: ProblemSource, default: ProblemSource.LEETCODE } )
    source: ProblemSource

    @Column( { type: 'integer', default: 0, name: 'order_index' } )
    orderIndex: number

    @Column( { type: 'boolean', default: true, name: 'is_published' } )
    isPublished: boolean

    @Column( { type: 'boolean', default: false, name: 'is_must_solve' } )
    isMustSolve: boolean
}

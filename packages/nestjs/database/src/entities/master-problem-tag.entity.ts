import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { MasterProblemEntity } from './master-problem.entity.js'
import { TagEntity } from './tag.entity.js'

@Entity( 'master_problem_tags' )
@Index( [ 'masterProblemId', 'tagId' ], { unique: true } )
@Index( [ 'tagId' ] )
export class MasterProblemTagEntity {
    @PrimaryColumn( { name: 'master_problem_id', type: 'varchar' } )
    masterProblemId: string

    @PrimaryColumn( { name: 'tag_id', type: 'varchar' } )
    tagId: string

    @ManyToOne( () => MasterProblemEntity )
    @JoinColumn( { name: 'master_problem_id' } )
    masterProblem: MasterProblemEntity

    @ManyToOne( () => TagEntity )
    @JoinColumn( { name: 'tag_id' } )
    tag: TagEntity
}

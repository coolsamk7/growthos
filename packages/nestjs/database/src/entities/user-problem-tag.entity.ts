import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { UserProblemEntity } from './user-problem.entity.js'
import { TagEntity } from './tag.entity.js'

@Entity( 'user_problem_tags' )
@Index( [ 'userProblemId', 'tagId' ], { unique: true } )
@Index( [ 'tagId' ] )
export class UserProblemTagEntity {
    @PrimaryColumn( { name: 'user_problem_id', type: 'varchar' } )
    userProblemId: string

    @PrimaryColumn( { name: 'tag_id', type: 'varchar' } )
    tagId: string

    @ManyToOne( () => UserProblemEntity )
    @JoinColumn( { name: 'user_problem_id' } )
    userProblem: UserProblemEntity

    @ManyToOne( () => TagEntity )
    @JoinColumn( { name: 'tag_id' } )
    tag: TagEntity
}

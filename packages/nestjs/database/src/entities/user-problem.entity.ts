import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserTopicEntity } from './user-topic.entity.js'
import { MasterProblemEntity } from './master-problem.entity.js'
import { Difficulty, ProblemStatus, ProblemSource } from '@growthos/nestjs-shared'

@Entity( 'user_problems' )
@Index( [ 'userTopicId' ] )
export class UserProblemEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_topic_id', type: 'varchar' } )
    userTopicId: string

    @ManyToOne( () => UserTopicEntity )
    @JoinColumn( { name: 'user_topic_id' } )
    userTopic: UserTopicEntity

    @Column( { type: 'varchar' } )
    title: string

    @Column( { type: 'varchar', nullable: true, name: 'external_url' } )
    externalUrl?: string

    @Column( { type: 'enum', enum: Difficulty } )
    difficulty: Difficulty

    @Column( { type: 'enum', enum: ProblemStatus, default: ProblemStatus.TODO } )
    status: ProblemStatus

    @Column( { type: 'enum', enum: ProblemSource, default: ProblemSource.LEETCODE } )
    source: ProblemSource

    @Column( { type: 'text', nullable: true, name: 'approach_notes' } )
    approachNotes?: string

    @Column( { type: 'text', nullable: true } )
    solution?: string

    @Column( { type: 'boolean', default: false, name: 'is_starred' } )
    isStarred: boolean

    @Column( { type: 'timestamp', nullable: true, name: 'solved_at' } )
    solvedAt?: Date

    @Column( { type: 'varchar', nullable: true, name: 'master_problem_id' } )
    masterProblemId?: string

    @ManyToOne( () => MasterProblemEntity )
    @JoinColumn( { name: 'master_problem_id' } )
    masterProblem?: MasterProblemEntity
}

import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { IdTimestamppedEntity } from './id-timestampped.entity.js'
import { UserProblemEntity } from './user-problem.entity.js'
import { AttemptResult } from '@growthos/nestjs-shared'

@Entity( 'problem_attempts' )
@Index( [ 'userProblemId', 'attemptedAt' ] )
export class ProblemAttemptEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_problem_id', type: 'varchar' } )
    userProblemId: string

    @ManyToOne( () => UserProblemEntity )
    @JoinColumn( { name: 'user_problem_id' } )
    userProblem: UserProblemEntity

    @Column( { type: 'enum', enum: AttemptResult } )
    result: AttemptResult

    @Column( { type: 'integer', nullable: true, name: 'time_taken_minutes' } )
    timeTakenMinutes?: number

    @Column( { type: 'text', nullable: true } )
    notes?: string

    @Column( { type: 'boolean', default: false, name: 'used_hint' } )
    usedHint: boolean

    @CreateDateColumn( { name: 'attempted_at' } )
    attemptedAt: Date
}

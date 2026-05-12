import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { IdTimestamppedEntity } from "./id-timestampped.entity.js";
import { UserEntity } from "./user.entity.js";

@Entity( 'daily_activities' )
@Index( [ 'userId', 'activityDate' ], { unique: true } )
export class DailyActivityEntity extends IdTimestamppedEntity {
    @Column( { name: 'user_id', type: 'varchar' } )
    userId: string;

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name: 'user_id' } )
    user: UserEntity

    @Column( {
        name: 'activity_date',
        type: 'date',
    } )
    activityDate: Date;

    @Column( {
        name: 'study_minutes',
        type: 'integer',
        default: 0,
    } )
    studyMinutes: number;

    @Column( {
        name: 'study_seconds',
        type: 'integer',
        default: 0,
    } )
    studySeconds: number;

    @Column( {
        name: 'sessions_count',
        type: 'integer',
        default: 0,
    } )
    sessionsCount: number;

    @Column( {
        name: 'focus_blocks_count',
        type: 'integer',
        default: 0,
    } )
    focusBlocksCount: number;

    @Column( {
        name: 'problems_solved',
        type: 'integer',
        default: 0,
    } )
    problemsSolved: number;

    @Column( {
        name: 'is_streak_qualified',
        type: 'boolean',
        default: false,
    } )
    isStreakQualified: boolean;

    @Column( {
        name: 'streak_qualified_at',
        type: 'timestamp',
        nullable: true,
    } )
    streakQualifiedAt?: Date;

    @Column( {
        name: 'completed_sessions',
        type: 'integer',
        default: 0,
    } )
    completedSessions: number;

    @Column( {
        name: 'cancelled_sessions',
        type: 'integer',
        default: 0,
    } )
    cancelledSessions: number;

    @Column( {
        name: 'expired_sessions',
        type: 'integer',
        default: 0,
    } )
    expiredSessions: number;

    @Column( {
        name: 'heatmap_level',
        type: 'integer',
        default: 0,
    } )
    heatmapLevel: number;

    @Column( {
        name: 'deep_work_minutes',
        type: 'integer',
        default: 0,
    } )
    deepWorkMinutes: number;
}

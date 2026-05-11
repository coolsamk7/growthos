import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StreakEntity } from '@growthos/nestjs-database/entities';

@Injectable()
export class StreaksService {
    private readonly logger = new Logger( StreaksService.name );

    constructor( @InjectDataSource() private readonly dataSource: DataSource ) {}

    async updateStreakForUser( userId: string ): Promise<StreakEntity> {
        const today = new Date();
        today.setHours( 0, 0, 0, 0 );

        let streak = await this.dataSource.manager.findOne( StreakEntity, {
            where: { userId },
        } );

        if ( !streak ) {
            streak = this.dataSource.manager.create( StreakEntity, {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActivityDate: today,
                totalStudyDays: 1,
                totalProblemsSolved: 0,
            } );
        } else {
            const lastActivityDate = streak.lastActivityDate
                ? new Date( streak.lastActivityDate )
                : null;

            if ( lastActivityDate ) {
                lastActivityDate.setHours( 0, 0, 0, 0 );
            }

            const daysDiff = lastActivityDate
                ? Math.floor( ( today.getTime() - lastActivityDate.getTime() ) / ( 1000 * 60 * 60 * 24 ) )
                : 1;

            if ( daysDiff === 0 ) {
                // Same day, no streak update needed
                return streak;
            } else if ( daysDiff === 1 ) {
                // Consecutive day
                streak.currentStreak += 1;
                streak.totalStudyDays += 1;
                streak.lastActivityDate = today;

                if ( streak.currentStreak > streak.longestStreak ) {
                    streak.longestStreak = streak.currentStreak;
                }
            } else {
                // Streak broken
                streak.currentStreak = 1;
                streak.totalStudyDays += 1;
                streak.lastActivityDate = today;
            }
        }

        return await this.dataSource.manager.save( streak );
    }

    async incrementProblemsSolved( userId: string ): Promise<StreakEntity> {
        const streak = await this.updateStreakForUser( userId );
        streak.totalProblemsSolved += 1;
        return await this.dataSource.manager.save( streak );
    }

    async getCurrentStreak( userId: string ): Promise<number> {
        const streak = await this.dataSource.manager.findOne( StreakEntity, {
            where: { userId },
        } );

        if ( !streak ) {
            return 0;
        }

        const today = new Date();
        today.setHours( 0, 0, 0, 0 );

        const lastActivityDate = streak.lastActivityDate
            ? new Date( streak.lastActivityDate )
            : null;

        if ( !lastActivityDate ) {
            return 0;
        }

        lastActivityDate.setHours( 0, 0, 0, 0 );
        const daysDiff = Math.floor( ( today.getTime() - lastActivityDate.getTime() ) / ( 1000 * 60 * 60 * 24 ) );

        // If last activity was more than 1 day ago, streak is broken
        if ( daysDiff > 1 ) {
            return 0;
        }

        return streak.currentStreak;
    }

    async getStreakStats( userId: string ) {
        const streak = await this.dataSource.manager.findOne( StreakEntity, {
            where: { userId },
        } );

        if ( !streak ) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                totalStudyDays: 0,
                totalProblemsSolved: 0,
                lastActivityDate: null,
                isActiveToday: false,
            };
        }

        const today = new Date();
        today.setHours( 0, 0, 0, 0 );

        const lastActivityDate = streak.lastActivityDate
            ? new Date( streak.lastActivityDate )
            : null;

        let isActiveToday = false;
        let currentStreakValue = streak.currentStreak;

        if ( lastActivityDate ) {
            lastActivityDate.setHours( 0, 0, 0, 0 );
            const daysDiff = Math.floor( ( today.getTime() - lastActivityDate.getTime() ) / ( 1000 * 60 * 60 * 24 ) );
            
            isActiveToday = daysDiff === 0;
            
            // If streak is broken, reflect it
            if ( daysDiff > 1 ) {
                currentStreakValue = 0;
            }
        }

        return {
            currentStreak: currentStreakValue,
            longestStreak: streak.longestStreak,
            totalStudyDays: streak.totalStudyDays,
            totalProblemsSolved: streak.totalProblemsSolved,
            lastActivityDate: streak.lastActivityDate,
            isActiveToday,
        };
    }
}

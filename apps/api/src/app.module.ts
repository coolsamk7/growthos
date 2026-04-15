import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig, jwtConfig, loggerConfig, otpConfig, queueConfig, redisConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth';
import { LearningPathModule } from './modules/learning-path';
import { TagsModule } from './modules/tags';
import { MasterProblemsModule } from './modules/master-problems';
import { MasterTopicsModule } from './modules/master-topics';
import { MasterLearningPathsModule } from './modules/master-learning-paths';
import { UserLearningPathsModule } from './modules/user-learning-paths';
import { UserTopicsModule } from './modules/user-topics';
import { UserProblemsModule } from './modules/user-problems';
import { GoalsModule } from './modules/goals';
import { NotesModule } from './modules/notes';
import { ResourcesModule } from './modules/resources';
import { StreaksModule } from './modules/streaks';
import { StudySessionsModule } from './modules/study-sessions';
import { ProblemAttemptsModule } from './modules/problem-attempts';
import { QueueModule } from './modules/queue'; 
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { JwtStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './guards/app.guard';

@Module( {
    imports: [
        ConfigModule.forRoot( {
            isGlobal: true,
            load: [ databaseConfig, loggerConfig, jwtConfig, otpConfig, queueConfig, redisConfig ],
        } ),
        LoggerModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'logger.config' );
            },
        } ),
        JwtModule.registerAsync( {
            global: true,
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'jwt.config' );
            },
        } ),
        PassportModule.register( {
            defaultStrategy: 'jwt',
        } ),
        TypeOrmModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            async useFactory( configService: ConfigService ) {
                return configService.getOrThrow( 'database.config' );
            },
        } ),
        BullModule.forRootAsync( {
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: ( configService: ConfigService ) => {
                return configService.getOrThrow( 'queue' ) 
            }
        } ),
        BullModule.registerQueue( {
            name: 'mail'
        } ),
        BullBoardModule.forRoot( {
            route: '/admin/queues',
            adapter: ExpressAdapter,
        } ),
        BullBoardModule.forFeature( {
            name: 'mail',
            adapter: BullMQAdapter,
        } ),
        AuthModule,
        LearningPathModule,
        TagsModule,
        MasterProblemsModule,
        MasterTopicsModule,
        MasterLearningPathsModule,
        UserLearningPathsModule,
        UserTopicsModule,
        UserProblemsModule,
        GoalsModule,
        NotesModule,
        ResourcesModule,
        StreaksModule,
        StudySessionsModule,
        ProblemAttemptsModule,
        QueueModule
    ],
    providers: [
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: AppAuthGuard,
        },
    ]
} )
export class AppModule {}

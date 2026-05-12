import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InngestModule } from '@growthos/nestjs-inngest'
import { databaseConfig, jwtConfig, loggerConfig, otpConfig, queueConfig, redisConfig } from './config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth';
import { UserProfileModule } from './modules/user-profile';
import { LearningPathModule } from './modules/learning-path';
import { TagsModule } from './modules/tags';
import { MasterProblemsModule } from './modules/master-problems';
import { MasterTopicsModule } from './modules/master-topics';
import { MasterLearningPathsModule } from './modules/master-learning-paths';
import { UserLearningPathsModule } from './modules/user-learning-paths';
import { UserModulesModule } from './modules/user-modules';
import { UserTopicsModule } from './modules/user-topics';
import { UserProblemsModule } from './modules/user-problems';
import { GoalsModule } from './modules/goals';
import { NotesModule } from './modules/notes';
import { ResourcesModule } from './modules/resources';
import { StreaksModule } from './modules/streaks';
import { StudySessionsModule } from './modules/study-sessions';
import { ProblemAttemptsModule } from './modules/problem-attempts';
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
        InngestModule.forRoot( {
            appId: 'growthos', baseUrl: ""
        } ),
        AuthModule,
        UserProfileModule,
        LearningPathModule,
        TagsModule,
        MasterProblemsModule,
        MasterTopicsModule,
        MasterLearningPathsModule,
        UserLearningPathsModule,
        UserModulesModule,
        UserTopicsModule,
        UserProblemsModule,
        GoalsModule,
        NotesModule,
        ResourcesModule,
        StreaksModule,
        StudySessionsModule,
        // SessionTagsModule,  // OLD - replaced by TagsModule
        ProblemAttemptsModule,
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

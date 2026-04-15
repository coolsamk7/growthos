import { UserRole } from '@growthos/nestjs-shared'

export enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage',
}

export enum Subject {
    USER = 'User',
    LEARNING_PATH = 'LearningPath',
    MASTER_LEARNING_PATH = 'MasterLearningPath',
    MASTER_TOPIC = 'MasterTopic',
    MASTER_PROBLEM = 'MasterProblem',
    USER_LEARNING_PATH = 'UserLearningPath',
    USER_TOPIC = 'UserTopic',
    USER_PROBLEM = 'UserProblem',
    PROBLEM_ATTEMPT = 'ProblemAttempt',
    STUDY_SESSION = 'StudySession',
    STREAK = 'Streak',
    GOAL = 'Goal',
    NOTE = 'Note',
    RESOURCE = 'Resource',
    TAG = 'Tag',
    ALL = 'all',
}

export { UserRole }

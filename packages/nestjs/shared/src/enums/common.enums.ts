export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum UserRole {
    USER = 'USER',
    CONTENT_CREATOR = 'CONTENT_CREATOR',
    ADMIN = 'ADMIN',
}

export enum ProgressStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum ItemType {
    PROBLEM = 'PROBLEM',
    THEORY = 'THEORY',
    VIDEO = 'VIDEO',
    TASK = 'TASK',
}

export enum Difficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

export enum ProblemSource {
    LEETCODE = 'LEETCODE',
    HACKERRANK = 'HACKERRANK',
    CODECHEF = 'CODECHEF',
    CODEFORCES = 'CODEFORCES',
    CUSTOM = 'CUSTOM',
}

export enum TopicStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    MASTERED = 'MASTERED',
}

export enum ProblemStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    SOLVED = 'SOLVED',
    REVIEWING = 'REVIEWING',
}

export enum AttemptResult {
    SOLVED_INDEPENDENTLY = 'SOLVED_INDEPENDENTLY',
    SOLVED_WITH_HINT = 'SOLVED_WITH_HINT',
    PARTIALLY_SOLVED = 'PARTIALLY_SOLVED',
    COULD_NOT_SOLVE = 'COULD_NOT_SOLVE',
}

export enum LearningPathStatus {
    DRAFT = 'DRAFT',
    PUBLIC = 'PUBLIC',
    INACTIVE = 'INACTIVE',
}

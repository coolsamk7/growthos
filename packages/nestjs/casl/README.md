# @growthos/nestjs-casl

CASL-based authorization package for GrowthOS with role-based permissions.

## Installation

In your NestJS application's `app.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import { CaslModule } from '@growthos/nestjs-casl'

@Module( {
    imports: [
        CaslModule.forRoot(), // Register globally
        // ... other modules
    ],
} )
export class AppModule {}
```

## Roles

- **USER** - Regular learners
- **CONTENT_CREATOR** - Can manage master templates (learning paths, topics, problems)
- **ADMIN** - Full system access

## Usage

### 1. Using the Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common'
import {  AbilitiesGuard, CheckAbilities, Action, Subject } from '@growthos/nestjs-casl'

@Controller( 'master-learning-paths' )
@UseGuards( AbilitiesGuard )
export class MasterLearningPathController {
    @Get()
    @CheckAbilities(
        { action: Action.READ, subject: Subject.MASTER_LEARNING_PATH }
    )
    findAll() {
        // Anyone can read master learning paths
        return []
    }

    @Post()
    @CheckAbilities(
        { action: Action.CREATE, subject: Subject.MASTER_LEARNING_PATH }
    )
    create() {
        // Only CONTENT_CREATOR and ADMIN can create
        return {}
    }
}
```

### 2. Programmatic Usage

```typescript
import { Injectable } from '@nestjs/common'
import { CaslAbilityFactory, Action, Subject, UserRole } from '@growthos/nestjs-casl'

@Injectable()
export class SomeService {
    constructor( private abilityFactory: CaslAbilityFactory ) {}

    checkPermission( userId: string, role: UserRole ) {
        const ability = this.abilityFactory.defineAbility( role, userId )
        
        if ( ability.can( Action.CREATE, Subject.MASTER_PROBLEM ) ) {
            // User can create problems
        }
    }
}
```

## Permissions Matrix

### ADMIN
- `manage all` - Full system access

### CONTENT_CREATOR
- `manage MasterLearningPath, MasterTopic, MasterProblem, Tag`
- `read User, UserLearningPath, UserTopic, UserProblem`
- `manage` their own user data

### USER
- `read MasterLearningPath, MasterTopic, MasterProblem, Tag`
- `manage` their own user data (UserLearningPath, UserTopic, UserProblem, etc.)
- `update, read` their own User profile
- `cannot delete` their own User account

## Available Actions

```typescript
enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage', // All of the above
}
```

## Available Subjects

```typescript
enum Subject {
    USER = 'User',
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
```

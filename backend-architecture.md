# GrowthOS Backend Architecture

## Overview
GrowthOS is a NestJS-based backend system for managing learning paths, problems, topics, and user progress tracking. The architecture follows a modular, layered approach with clear separation of concerns.

## Technology Stack
- **Framework**: NestJS (Node.js)
- **Database**: TypeORM with PostgreSQL
- **Authentication**: JWT + Passport
- **Queue**: BullMQ (Redis-based)
- **Authorization**: CASL
- **API Documentation**: Scalar/Swagger
- **Logging**: Pino

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                    (Web App / API Client)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────┐     │
│  │ Guards         │  │ Interceptors │  │ Exception      │     │
│  │ - AppAuthGuard │  │              │  │ Filters        │     │
│  │ - PublicGuard  │  │              │  │                │     │
│  │ - CASL Guards  │  │              │  │                │     │
│  └────────────────┘  └──────────────┘  └────────────────┘     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     Controller Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints (v1)                                  │  │
│  │  - AuthController                                         │  │
│  │  - UserProfileController                                  │  │
│  │  - UserLearningPathsController                           │  │
│  │  - MasterLearningPathsController                         │  │
│  │  - UserProblemsController                                │  │
│  │  - MasterProblemsController                              │  │
│  │  - UserTopicsController                                  │  │
│  │  - MasterTopicsController                                │  │
│  │  - GoalsController                                       │  │
│  │  - NotesController                                       │  │
│  │  - ResourcesController                                   │  │
│  │  - StreaksController                                     │  │
│  │  - StudySessionsController                               │  │
│  │  - ProblemAttemptsController                             │  │
│  │  - TagsController                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      Business Logic Layer                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NestJS Modules (Feature Modules)                        │  │
│  │  - AuthModule (Login, Register, JWT)                     │  │
│  │  - UserProfileModule                                     │  │
│  │  - UserLearningPathsModule                               │  │
│  │  - MasterLearningPathsModule                             │  │
│  │  - UserProblemsModule                                    │  │
│  │  - MasterProblemsModule                                  │  │
│  │  - UserTopicsModule                                      │  │
│  │  - MasterTopicsModule                                    │  │
│  │  - GoalsModule                                           │  │
│  │  - NotesModule                                           │  │
│  │  - ResourcesModule                                       │  │
│  │  - StreaksModule                                         │  │
│  │  - StudySessionsModule                                   │  │
│  │  - ProblemAttemptsModule                                 │  │
│  │  - TagsModule                                            │  │
│  │  - QueueModule (Email processing)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    Shared Packages Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ @growthos/   │  │ @growthos/   │  │ Common       │         │
│  │ nestjs-      │  │ nestjs-      │  │ Utilities    │         │
│  │ database     │  │ casl         │  │ DTOs         │         │
│  │              │  │              │  │ Decorators   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      Data Access Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  TypeORM Entities                                         │  │
│  │  - UserEntity                    - GoalEntity            │  │
│  │  - UserProfileEntity             - NoteEntity            │  │
│  │  - UserLearningPathEntity        - ResourceEntity        │  │
│  │  - MasterLearningPathEntity      - StreakEntity          │  │
│  │  - UserProblemEntity             - StudySessionEntity    │  │
│  │  - MasterProblemEntity           - ProblemAttemptEntity  │  │
│  │  - UserTopicEntity               - TagEntity             │  │
│  │  - MasterTopicEntity             - RefreshTokenEntity    │  │
│  │  - LearningPathEntity (legacy)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    External Services Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Redis     │  │  BullBoard   │         │
│  │   Database   │  │  (Cache &    │  │  (Queue      │         │
│  │              │  │   Queue)     │  │   Monitor)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Domain Model

### Core Domains

#### 1. **User Management Domain**
- **User**: Base user authentication
- **UserProfile**: Extended user information and preferences
- **RefreshToken**: JWT refresh token management

#### 2. **Learning Path Domain**
```
MasterLearningPath (Template)
    ├── UserLearningPath (User's instance)
    │   ├── targetDate
    │   ├── targetProblems
    │   └── progress tracking
```

#### 3. **Topic Domain**
```
MasterTopic (Template)
    └── UserTopic (User's instance)
        ├── proficiency
        ├── lastPracticedAt
        └── status
```

#### 4. **Problem Domain**
```
MasterProblem (Template)
    ├── difficulty
    ├── platform
    └── UserProblem (User's instance)
        ├── status (TODO, IN_PROGRESS, COMPLETED)
        ├── attempts
        ├── lastAttemptedAt
        └── ProblemAttempt[]
            ├── timeSpent
            ├── solution
            └── status
```

#### 5. **Progress Tracking Domain**
- **StudySession**: Tracks learning sessions
- **Streak**: Tracks daily consistency
- **Goal**: User-defined goals with progress tracking
- **ProblemAttempt**: Individual problem-solving attempts

#### 6. **Content Management Domain**
- **Note**: User notes for problems/topics
- **Resource**: Learning resources (links, files)
- **Tag**: Categorization for problems/topics

---

## Module Relationships

```
┌────────────────────────────────────────────────────────────────┐
│                         AppModule                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Core Infrastructure                                      │ │
│  │  - ConfigModule (global)                                 │ │
│  │  - LoggerModule (Pino)                                   │ │
│  │  - TypeOrmModule (Database)                              │ │
│  │  - JwtModule (global)                                    │ │
│  │  - PassportModule                                        │ │
│  │  - BullModule (Queue)                                    │ │
│  │  - BullBoardModule (Queue Monitor)                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Feature Modules                                          │ │
│  │                                                           │ │
│  │  Authentication & User                                    │ │
│  │  ├── AuthModule                                          │ │
│  │  └── UserProfileModule                                   │ │
│  │                                                           │ │
│  │  Master Data (Templates)                                 │ │
│  │  ├── MasterLearningPathsModule                          │ │
│  │  ├── MasterTopicsModule                                  │ │
│  │  └── MasterProblemsModule                               │ │
│  │                                                           │ │
│  │  User Data (Instances)                                   │ │
│  │  ├── UserLearningPathsModule                            │ │
│  │  ├── UserTopicsModule                                    │ │
│  │  └── UserProblemsModule                                  │ │
│  │                                                           │ │
│  │  Progress & Tracking                                     │ │
│  │  ├── GoalsModule                                         │ │
│  │  ├── StreaksModule                                       │ │
│  │  ├── StudySessionsModule                                │ │
│  │  └── ProblemAttemptsModule                              │ │
│  │                                                           │ │
│  │  Content & Resources                                     │ │
│  │  ├── NotesModule                                         │ │
│  │  ├── ResourcesModule                                     │ │
│  │  └── TagsModule                                          │ │
│  │                                                           │ │
│  │  Background Jobs                                         │ │
│  │  └── QueueModule (Email processing)                      │ │
│  │                                                           │ │
│  │  Legacy                                                  │ │
│  │  └── LearningPathModule (deprecated)                     │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization Flow

```
1. User Login
   ├── POST /v1/auth/login
   │   ├── Validates credentials (bcrypt)
   │   ├── Generates JWT access token
   │   └── Returns access + refresh tokens
   │
2. Protected Routes
   ├── Request with JWT Bearer token
   │   ├── JwtStrategy validates token
   │   ├── AppAuthGuard checks authentication
   │   ├── CASL Guards check permissions (optional)
   │   └── Request proceeds to controller
   │
3. Token Refresh
   └── POST /v1/auth/refresh
       ├── Validates refresh token
       └── Issues new access token
```

---

## Data Flow Example: User Problem Workflow

```
1. User selects a problem from Master Problems
   └── GET /v1/master-problems
       └── Returns template problems

2. User adds problem to their list
   └── POST /v1/user-problems
       ├── Creates UserProblemEntity
       ├── Links to MasterProblemEntity
       └── Sets initial status (TODO)

3. User starts solving
   └── PATCH /v1/user-problems/:id
       └── Updates status (IN_PROGRESS)

4. User submits attempt
   └── POST /v1/problem-attempts
       ├── Creates ProblemAttemptEntity
       ├── Tracks time spent, solution
       └── Updates UserProblem status

5. System tracks progress
   └── Background processes update:
       ├── StreakEntity (daily consistency)
       ├── StudySessionEntity (session data)
       └── GoalEntity progress
```

---

## Key Design Patterns

### 1. **Master-User Pattern**
Template entities (Master*) serve as blueprints that users instantiate (User*):
- `MasterLearningPath` → `UserLearningPath`
- `MasterTopic` → `UserTopic`
- `MasterProblem` → `UserProblem`

### 2. **Module-Controller-Entity Pattern**
Each feature follows:
```
FeatureModule
├── controllers/v1/feature.controller.ts
├── dtos/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── get-feature.dto.ts
└── feature.module.ts (imports TypeOrmModule with entities)
```

### 3. **Shared Package Pattern**
Common functionality extracted into workspace packages:
- `@growthos/nestjs-database`: Entities and database config
- `@growthos/nestjs-casl`: Authorization logic
- `@growthos/api-client`: Generated TypeScript client

### 4. **Guard-Based Security**
Layered security approach:
- `AppAuthGuard`: Global JWT authentication
- `PublicGuard`: Bypass auth for public routes
- CASL Guards: Fine-grained permission checks

---

## Configuration Management

All configurations are centralized using NestJS ConfigModule:

```
config/
├── database.config.ts    # TypeORM connection
├── jwt.config.ts        # JWT settings
├── logger.config.ts     # Pino logger
├── otp.config.ts        # OTP/2FA
├── queue.config.ts      # BullMQ
└── redis.config.ts      # Redis connection
```

---

## Queue System (BullMQ)

```
┌──────────────┐
│ Mail Queue   │
├──────────────┤
│ - Welcome    │
│   emails     │
│ - Password   │
│   reset      │
│ - Streaks    │
│   reminders  │
└──────────────┘
      │
      ├─── Processed by QueueModule
      └─── Monitored via BullBoard (/admin/queues)
```

---

## API Versioning

All APIs are versioned under `/v1/`:
- `/v1/auth/*`
- `/v1/user-learning-paths/*`
- `/v1/master-problems/*`
- etc.

This allows for future API evolution without breaking existing clients.

---

## Database Schema Overview

### Relationships
```
User ─┬─ UserProfile (1:1)
      ├─ RefreshToken (1:many)
      ├─ UserLearningPath (1:many)
      │   └─ MasterLearningPath (many:1)
      ├─ UserTopic (1:many)
      │   └─ MasterTopic (many:1)
      ├─ UserProblem (1:many)
      │   ├─ MasterProblem (many:1)
      │   └─ ProblemAttempt (1:many)
      ├─ Goal (1:many)
      ├─ Note (1:many)
      ├─ Resource (1:many)
      ├─ Streak (1:many)
      └─ StudySession (1:many)

MasterProblem ─── MasterProblemTag ─── Tag
UserProblem ─── UserProblemTag ─── Tag
```

---

## Monitoring & Observability

- **Logging**: Pino logger with structured JSON logs
- **Queue Monitoring**: BullBoard dashboard at `/admin/queues`
- **API Documentation**: Scalar/Swagger documentation available

---

## Security Features

1. **JWT Authentication**: Stateless token-based auth
2. **Password Hashing**: bcrypt for secure password storage
3. **Refresh Tokens**: Secure token rotation
4. **CASL Authorization**: Attribute-based access control
5. **Global Guards**: AppAuthGuard protects all routes by default
6. **Public Routes**: Explicit @Public() decorator for open endpoints

---

## Future Considerations

Based on the codebase structure:
- The old `LearningPathModule` is likely being phased out in favor of `UserLearningPathsModule`
- Queue system is ready for expansion (currently only handles mail)
- Modular architecture allows easy addition of new features
- API versioning enables backward-compatible evolution

---

## Summary

GrowthOS backend is a well-architected NestJS application following:
- ✅ Clean separation of concerns
- ✅ Domain-driven design (Master-User pattern)
- ✅ Modular structure for scalability
- ✅ Comprehensive authentication & authorization
- ✅ Progress tracking and gamification features
- ✅ Background job processing
- ✅ Type-safe API contracts

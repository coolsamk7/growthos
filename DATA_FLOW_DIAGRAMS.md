# GrowthOS Backend - Data Flow Diagrams

This document provides detailed data flow diagrams for all major user journeys in the GrowthOS system.

---

## Table of Contents
1. [Authentication Flow](#1-authentication-flow)
2. [User Profile Management Flow](#2-user-profile-management-flow)
3. [Learning Path Creation Flow](#3-learning-path-creation-flow)
4. [Problem Solving Workflow](#4-problem-solving-workflow)
5. [Topic Learning Flow](#5-topic-learning-flow)
6. [Goal Tracking Flow](#6-goal-tracking-flow)
7. [Study Session Flow](#7-study-session-flow)
8. [Note & Resource Management Flow](#8-note--resource-management-flow)
9. [Streak Tracking Flow](#9-streak-tracking-flow)
10. [Background Job Processing Flow](#10-background-job-processing-flow)

---

## 1. Authentication Flow

### 1.1 User Registration & Email Verification

```
┌─────────┐                                  ┌─────────────────┐
│  User   │                                  │  Auth           │
│ (Client)│                                  │  Controller     │
└────┬────┘                                  └────────┬────────┘
     │                                                 │
     │ POST /v1/auth/signup                           │
     │ { email, password, name }                      │
     ├────────────────────────────────────────────────>
     │                                                 │
     │                               ┌─────────────────▼────────┐
     │                               │ 1. Validate input        │
     │                               │ 2. Check if email exists │
     │                               └─────────────────┬────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 3. Hash password (bcrypt)    │
     │                               │ 4. Create UserEntity         │
     │                               │    - status: PENDING         │
     │                               │    - email, password, name   │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 5. Save to Database          │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 6. Generate OTP              │
     │                               │    - OtpService.generate()   │
     │                               │    - Store in cache/DB       │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 7. Queue welcome email       │
     │                               │    - MailQueue.add()         │
     │                               │    - Contains OTP code       │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │ { message: "Check email for OTP" }             │
     │<────────────────────────────────────────────────┤
     │                                                 │
     │                                                 │
     │ POST /v1/auth/verify-otp                       │
     │ { email, otp }                                 │
     ├────────────────────────────────────────────────>
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 8. Verify OTP                │
     │                               │    - OtpService.verify()     │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 9. Update UserEntity         │
     │                               │    - status: ACTIVE          │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 10. Create UserProfileEntity │
     │                               │     - Default preferences    │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │                               ┌─────────────────▼────────────┐
     │                               │ 11. Generate JWT tokens      │
     │                               │     - Access token           │
     │                               │     - Refresh token          │
     │                               └─────────────────┬────────────┘
     │                                                 │
     │ { accessToken, refreshToken, user }            │
     │<────────────────────────────────────────────────┤
     │                                                 │
```

### 1.2 User Login

```
┌─────────┐                    ┌──────────────┐              ┌──────────┐
│  User   │                    │    Auth      │              │ Database │
│ (Client)│                    │  Controller  │              │          │
└────┬────┘                    └──────┬───────┘              └────┬─────┘
     │                                │                           │
     │ POST /v1/auth/login           │                           │
     │ { email, password }           │                           │
     ├───────────────────────────────>│                           │
     │                                │                           │
     │                                │ Find user by email        │
     │                                ├──────────────────────────>│
     │                                │                           │
     │                                │<──────────────────────────┤
     │                                │ UserEntity                │
     │                                │                           │
     │                   ┌────────────▼──────────┐               │
     │                   │ Validate password     │               │
     │                   │ - bcrypt.compare()    │               │
     │                   └────────────┬──────────┘               │
     │                                │                           │
     │                   ┌────────────▼──────────┐               │
     │                   │ Check user status     │               │
     │                   │ - PENDING? → Error    │               │
     │                   │ - INACTIVE? → Error   │               │
     │                   │ - ACTIVE → Proceed    │               │
     │                   └────────────┬──────────┘               │
     │                                │                           │
     │                   ┌────────────▼──────────┐               │
     │                   │ Generate JWT tokens   │               │
     │                   │ - Access token        │               │
     │                   │ - Refresh token       │               │
     │                   └────────────┬──────────┘               │
     │                                │                           │
     │                                │ Save RefreshTokenEntity   │
     │                                ├──────────────────────────>│
     │                                │                           │
     │                                │<──────────────────────────┤
     │                                │                           │
     │ { accessToken, refreshToken,  │                           │
     │   user: { id, email, name } } │                           │
     │<───────────────────────────────┤                           │
     │                                │                           │
```

### 1.3 Protected API Request Flow

```
┌─────────┐          ┌─────────┐       ┌──────────────┐      ┌────────────┐
│  User   │          │  Guard  │       │  Controller  │      │  Service/  │
│ (Client)│          │  Layer  │       │              │      │   Database │
└────┬────┘          └────┬────┘       └──────┬───────┘      └─────┬──────┘
     │                    │                    │                    │
     │ GET /v1/user-problems                   │                    │
     │ Header: Authorization: Bearer <token>   │                    │
     ├────────────────────>│                   │                    │
     │                    │                    │                    │
     │        ┌───────────▼──────────┐         │                    │
     │        │ JwtStrategy          │         │                    │
     │        │ - Extract token      │         │                    │
     │        │ - Validate signature │         │                    │
     │        │ - Check expiration   │         │                    │
     │        └───────────┬──────────┘         │                    │
     │                    │                    │                    │
     │        ┌───────────▼──────────┐         │                    │
     │        │ AppAuthGuard         │         │                    │
     │        │ - Check auth status  │         │                    │
     │        └───────────┬──────────┘         │                    │
     │                    │                    │                    │
     │        ┌───────────▼──────────┐         │                    │
     │        │ AbilitiesGuard       │         │                    │
     │        │ (CASL - optional)    │         │                    │
     │        │ - Check permissions  │         │                    │
     │        └───────────┬──────────┘         │                    │
     │                    │                    │                    │
     │                    │ Request with       │                    │
     │                    │ currentUser injected│                   │
     │                    ├────────────────────>│                    │
     │                    │                    │                    │
     │                    │                    │ Query Database     │
     │                    │                    │ (filtered by user) │
     │                    │                    ├───────────────────>│
     │                    │                    │                    │
     │                    │                    │<───────────────────┤
     │                    │                    │ UserProblemEntity[]│
     │                    │                    │                    │
     │ { data, total, page, limit }           │                    │
     │<───────────────────┴────────────────────┤                    │
     │                                         │                    │
```

---

## 2. User Profile Management Flow

```
┌─────────┐              ┌──────────────┐            ┌──────────────┐
│  User   │              │  Profile     │            │  Database    │
│ (Client)│              │  Controller  │            │              │
└────┬────┘              └──────┬───────┘            └──────┬───────┘
     │                          │                           │
     │ GET /v1/user/profile     │                           │
     ├──────────────────────────>│                           │
     │                          │                           │
     │                          │ ProfileService            │
     │                          │  .getProfile(userId)      │
     │                          │                           │
     │                          │ Find UserProfileEntity    │
     │                          ├──────────────────────────>│
     │                          │  + User relation          │
     │                          │                           │
     │                          │<──────────────────────────┤
     │                          │ UserProfile + User        │
     │                          │                           │
     │ { message, data: {      │                           │
     │   personalInfo,          │                           │
     │   location,              │                           │
     │   professionalInfo,      │                           │
     │   education,             │                           │
     │   goals,                 │                           │
     │   socialLinks } }        │                           │
     │<──────────────────────────┤                           │
     │                          │                           │
     │                          │                           │
     │ PUT /v1/user/profile/personal-info                   │
     │ { firstName, lastName, bio, avatar }                 │
     ├──────────────────────────>│                           │
     │                          │                           │
     │                          │ ProfileService            │
     │                          │  .updatePersonalInfo()    │
     │                          │                           │
     │                          │ Update UserProfileEntity  │
     │                          ├──────────────────────────>│
     │                          │                           │
     │                          │<──────────────────────────┤
     │                          │ Updated Profile           │
     │                          │                           │
     │ { message, data }        │                           │
     │<──────────────────────────┤                           │
     │                          │                           │
```

**Other Profile Update Endpoints** (similar flow):
- `PUT /v1/user/profile/location` - Update city, country, timezone
- `PUT /v1/user/profile/professional-info` - Update company, title, experience
- `PUT /v1/user/profile/education` - Update degree, institution, graduation
- `PUT /v1/user/profile/goals` - Update learning goals
- `PUT /v1/user/profile/social-links` - Update GitHub, LinkedIn, etc.

---

## 3. Learning Path Creation Flow

### 3.1 Create User Learning Path from Scratch

```
┌─────────┐                  ┌─────────────────┐           ┌──────────┐
│  User   │                  │ UserLearning    │           │ Database │
│ (Client)│                  │ PathsController │           │          │
└────┬────┘                  └────────┬────────┘           └────┬─────┘
     │                                │                         │
     │ POST /v1/user-learning-paths   │                         │
     │ {                              │                         │
     │   name: "FAANG Prep",         │                         │
     │   description: "...",          │                         │
     │   targetDate: "2026-12-31",    │                         │
     │   targetProblems: 150          │                         │
     │ }                              │                         │
     ├────────────────────────────────>│                         │
     │                                │                         │
     │                  ┌─────────────▼──────────┐              │
     │                  │ 1. Validate input      │              │
     │                  │ 2. Check abilities     │              │
     │                  └─────────────┬──────────┘              │
     │                                │                         │
     │                  ┌─────────────▼────────────────┐        │
     │                  │ 3. Create                    │        │
     │                  │    UserLearningPathEntity    │        │
     │                  │    - userId (from JWT)       │        │
     │                  │    - name, description       │        │
     │                  │    - targetDate, target...   │        │
     │                  └─────────────┬────────────────┘        │
     │                                │                         │
     │                                │ Save entity             │
     │                                ├────────────────────────>│
     │                                │                         │
     │                                │<────────────────────────┤
     │                                │ Created entity          │
     │                                │                         │
     │ { message: "Created",         │                         │
     │   data: {                      │                         │
     │     id, name, description,     │                         │
     │     targetDate, targetProblems │                         │
     │   }                            │                         │
     │ }                              │                         │
     │<────────────────────────────────┤                         │
     │                                │                         │
```

### 3.2 Create Learning Path from Master Template

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │ Controllers │         │ Database │
│ (Client)│              │             │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Browse master templates                     │
     │ GET /v1/master-learning-paths                  │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find all published  │
     │                          │ MasterLearningPath  │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │ MasterLearningPath[]│
     │                          │                     │
     │ { data: [                │                     │
     │   {id, name, description}│                     │
     │ ]}                       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. Create user instance  │                     │
     │ POST /v1/user-learning-paths                   │
     │ {                        │                     │
     │   name: "My DSA Path",   │                     │
     │   masterLearningPathId: "xyz",                 │
     │   targetDate: "2026-12-31"                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼───────────┐         │
     │             │ Create                 │         │
     │             │ UserLearningPathEntity │         │
     │             │ - Links to Master      │         │
     │             │ - User customizations  │         │
     │             └────────────┬───────────┘         │
     │                          │                     │
     │                          │ Save                │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 3. Fetch associated topics                     │
     │ GET /v1/master-topics?masterLearningPathId=xyz │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find MasterTopics   │
     │                          │ linked to path      │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [topics] }       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

### 3.3 Add Topics & Problems to Learning Path

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │ Controllers │         │ Database │
│ (Client)│              │             │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Browse master topics  │                     │
     │ GET /v1/master-topics    │                     │
     │    ?masterLearningPathId=xyz                   │
     ├──────────────────────────>│                     │
     │                          │                     │
     │ { data: [topics] }       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. Add topic to user's path                    │
     │ POST /v1/user-topics     │                     │
     │ {                        │                     │
     │   masterTopicId: "123",  │                     │
     │   userLearningPathId: "xyz"                    │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼───────────┐         │
     │             │ Create UserTopicEntity │         │
     │             │ - userId               │         │
     │             │ - masterTopicId        │         │
     │             │ - userLearningPathId   │         │
     │             │ - status: NOT_STARTED  │         │
     │             │ - proficiency: 0       │         │
     │             └────────────┬───────────┘         │
     │                          │                     │
     │                          │ Save                │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 3. Browse problems for topic                   │
     │ GET /v1/master-problems  │                     │
     │    ?masterTopicId=123    │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │ { data: [problems] }     │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 4. Add problem to practice                     │
     │ POST /v1/user-problems   │                     │
     │ {                        │                     │
     │   masterProblemId: "456",│                     │
     │   userTopicId: "789"     │                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────┐          │
     │             │ Create                │          │
     │             │ UserProblemEntity     │          │
     │             │ - masterProblemId     │          │
     │             │ - userTopicId         │          │
     │             │ - status: TODO        │          │
     │             │ - attempts: 0         │          │
     │             └────────────┬──────────┘          │
     │                          │                     │
     │                          │ Save                │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## 4. Problem Solving Workflow

This is the core workflow for practicing and tracking problem-solving progress.

```
┌─────────┐         ┌─────────────┐       ┌──────────────┐      ┌──────────┐
│  User   │         │  User       │       │  Problem     │      │ Database │
│ (Client)│         │  Problems   │       │  Attempts    │      │          │
│         │         │  Controller │       │  Controller  │      │          │
└────┬────┘         └──────┬──────┘       └──────┬───────┘      └────┬─────┘
     │                     │                      │                   │
     │ 1. Get problems to solve                   │                   │
     │ GET /v1/user-problems?status=TODO          │                   │
     ├─────────────────────>│                      │                   │
     │                     │                      │                   │
     │                     │ Find UserProblemEntity                    │
     │                     │ with status=TODO     │                   │
     │                     ├──────────────────────────────────────────>│
     │                     │                      │                   │
     │                     │<──────────────────────────────────────────┤
     │                     │ UserProblem[] with   │                   │
     │                     │ MasterProblem details│                   │
     │                     │                      │                   │
     │ { data: [problems] }│                      │                   │
     │<─────────────────────┤                      │                   │
     │                     │                      │                   │
     │ 2. Start solving    │                      │                   │
     │ PATCH /v1/user-problems/:id                │                   │
     │ { status: "IN_PROGRESS" }                  │                   │
     ├─────────────────────>│                      │                   │
     │                     │                      │                   │
     │                     │ Update UserProblem   │                   │
     │                     │ - status: IN_PROGRESS│                   │
     │                     │ - lastAttemptedAt: now                    │
     │                     ├──────────────────────────────────────────>│
     │                     │                      │                   │
     │ { message, data }   │                      │                   │
     │<─────────────────────┤                      │                   │
     │                     │                      │                   │
     │                     │                      │                   │
     │ 3. Submit attempt   │                      │                   │
     │ POST /v1/problem-attempts                  │                   │
     │ {                   │                      │                   │
     │   userProblemId: "123",                    │                   │
     │   timeSpent: 45,    │                      │                   │
     │   solution: "code...",                     │                   │
     │   result: "ACCEPTED",                      │                   │
     │   notes: "Used DP..." │                    │                   │
     │ }                   │                      │                   │
     ├──────────────────────────────────────────────>│                   │
     │                     │                      │                   │
     │                     │         ┌────────────▼─────────┐         │
     │                     │         │ 1. Create            │         │
     │                     │         │    ProblemAttempt    │         │
     │                     │         │    Entity            │         │
     │                     │         └────────────┬─────────┘         │
     │                     │                      │                   │
     │                     │                      │ Save attempt      │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │                     │         ┌────────────▼─────────┐         │
     │                     │         │ 2. Update            │         │
     │                     │         │    UserProblem       │         │
     │                     │         │    - attempts++      │         │
     │                     │         │    - If ACCEPTED:    │         │
     │                     │         │      status=COMPLETED│         │
     │                     │         └────────────┬─────────┘         │
     │                     │                      │                   │
     │                     │                      │ Update problem    │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │                     │         ┌────────────▼─────────┐         │
     │                     │         │ 3. Update UserTopic  │         │
     │                     │         │    - Update progress │         │
     │                     │         │    - Proficiency     │         │
     │                     │         └────────────┬─────────┘         │
     │                     │                      │                   │
     │                     │                      │ Update topic      │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │                     │         ┌────────────▼─────────┐         │
     │                     │         │ 4. Update Goal       │         │
     │                     │         │    progress          │         │
     │                     │         │    (if goal exists)  │         │
     │                     │         └────────────┬─────────┘         │
     │                     │                      │                   │
     │                     │                      │ Update goal       │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │                     │         ┌────────────▼─────────┐         │
     │                     │         │ 5. Update or Create  │         │
     │                     │         │    Streak            │         │
     │                     │         │    - Daily activity  │         │
     │                     │         └────────────┬─────────┘         │
     │                     │                      │                   │
     │                     │                      │ Update streak     │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │                     │                      │<──────────────────┤
     │                     │                      │                   │
     │ { message, data }   │                      │                   │
     │<──────────────────────────────────────────────┤                   │
     │                     │                      │                   │
     │                     │                      │                   │
     │ 4. View attempt history                    │                   │
     │ GET /v1/problem-attempts?userProblemId=123 │                   │
     ├──────────────────────────────────────────────>│                   │
     │                     │                      │                   │
     │                     │                      │ Find all attempts │
     │                     │                      ├──────────────────>│
     │                     │                      │                   │
     │ { data: [attempts] }│                      │                   │
     │<──────────────────────────────────────────────┤                   │
     │                     │                      │                   │
```

### Problem Status Flow

```
┌──────────┐
│   TODO   │  Initial state when problem added
└────┬─────┘
     │
     │ User starts solving
     │ (PATCH /v1/user-problems/:id)
     │
     ▼
┌──────────────┐
│ IN_PROGRESS  │  User is actively working on it
└──────┬───────┘
     │
     │ Submit attempt
     │ (POST /v1/problem-attempts)
     │
     ├──────────────┬──────────────┐
     │              │              │
     │ ACCEPTED     │ WRONG_ANSWER │ TIME_LIMIT_EXCEEDED
     │              │              │ RUNTIME_ERROR
     │              │              │
     ▼              ▼              ▼
┌──────────┐   ┌──────────────┐   ┌──────────────┐
│COMPLETED │   │ IN_PROGRESS  │   │ IN_PROGRESS  │
└──────────┘   │ (retry)      │   │ (retry)      │
               └──────────────┘   └──────────────┘
```

---

## 5. Topic Learning Flow

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │ User Topics │         │ Database │
│ (Client)│              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Get topics to study   │                     │
     │ GET /v1/user-topics      │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find UserTopics     │
     │                          │ with MasterTopic    │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [                │                     │
     │   {id, name, status,     │                     │
     │    proficiency, ...}     │                     │
     │ ]}                       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. Start learning        │                     │
     │ PATCH /v1/user-topics/:id│                     │
     │ { status: "IN_PROGRESS" }│                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Update status       │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 3. Get problems for topic│                     │
     │ GET /v1/user-problems    │                     │
     │    ?userTopicId=123      │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find problems       │
     │                          │ for this topic      │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [problems] }     │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ [User solves problems - see Problem Flow]      │
     │                          │                     │
     │ 4. System auto-updates   │                     │
     │    proficiency based on  │                     │
     │    problem completion    │                     │
     │                          │                     │
     │           ┌──────────────▼─────────┐           │
     │           │ Background calculation:│           │
     │           │ - Total problems: N    │           │
     │           │ - Completed: C         │           │
     │           │ - Proficiency = C/N    │           │
     │           └──────────────┬─────────┘           │
     │                          │                     │
     │                          │ Update proficiency  │
     │                          ├────────────────────>│
     │                          │                     │
     │ 5. Mark topic as mastered│                     │
     │ PATCH /v1/user-topics/:id│                     │
     │ { status: "COMPLETED",   │                     │
     │   proficiency: 95 }      │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Update topic        │
     │                          │ lastPracticedAt     │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## 6. Goal Tracking Flow

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │   Goals     │         │ Database │
│ (Client)│              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Create a goal         │                     │
     │ POST /v1/goals           │                     │
     │ {                        │                     │
     │   title: "Solve 100 problems",                 │
     │   description: "...",    │                     │
     │   targetValue: 100,      │                     │
     │   currentValue: 0,       │                     │
     │   targetDate: "2026-12-31",                    │
     │   category: "PROBLEMS"   │                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────┐          │
     │             │ Create GoalEntity    │          │
     │             │ - userId (from JWT)  │          │
     │             │ - title, description │          │
     │             │ - target, current    │          │
     │             │ - isCompleted: false │          │
     │             └────────────┬──────────┘          │
     │                          │                     │
     │                          │ Save goal           │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. User completes a problem (triggers update)  │
     │ [See Problem Solving Flow]                     │
     │                          │                     │
     │           ┌──────────────▼─────────┐           │
     │           │ After problem attempt: │           │
     │           │ - Find relevant goals  │           │
     │           │ - Increment progress   │           │
     │           │ - Check if completed   │           │
     │           └──────────────┬─────────┘           │
     │                          │                     │
     │                          │ Update GoalEntity   │
     │                          │ - currentValue++    │
     │                          │ - If current >=     │
     │                          │   target:           │
     │                          │   isCompleted=true  │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │                     │
     │ 3. Check goal progress   │                     │
     │ GET /v1/goals            │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find user's goals   │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [                │                     │
     │   {id, title,            │                     │
     │    current: 45,          │                     │
     │    target: 100,          │                     │
     │    progress: 45%,        │                     │
     │    isCompleted: false}   │                     │
     │ ]}                       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 4. Update goal manually  │                     │
     │ PUT /v1/goals/:id        │                     │
     │ { currentValue: 50 }     │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Update goal         │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## 7. Study Session Flow

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │ Study       │         │ Database │
│ (Client)│              │ Sessions    │         │          │
│         │              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Start study session   │                     │
     │ POST /v1/study-sessions  │                     │
     │ {                        │                     │
     │   topicId: "123",        │                     │
     │   sessionType: "PRACTICE"│                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────────┐      │
     │             │ Create                    │      │
     │             │ StudySessionEntity        │      │
     │             │ - userId                  │      │
     │             │ - topicId (optional)      │      │
     │             │ - startTime: now          │      │
     │             │ - sessionType             │      │
     │             └────────────┬──────────────┘      │
     │                          │                     │
     │                          │ Save session        │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message,               │                     │
     │   data: {id, startTime} }│                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. User studies...       │                     │
     │    (solving problems,    │                     │
     │     reading notes, etc.) │                     │
     │                          │                     │
     │ 3. End study session     │                     │
     │ PATCH /v1/study-sessions/:id                   │
     │ {                        │                     │
     │   problemsSolved: 5,     │                     │
     │   topicsCovered: 2,      │                     │
     │   notes: "Good session..." │                   │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────────┐      │
     │             │ Update session:           │      │
     │             │ - endTime: now            │      │
     │             │ - duration = end - start  │      │
     │             │ - problemsSolved          │      │
     │             │ - topicsCovered           │      │
     │             │ - notes                   │      │
     │             └────────────┬──────────────┘      │
     │                          │                     │
     │                          │ Update session      │
     │                          ├────────────────────>│
     │                          │                     │
     │             ┌────────────▼──────────────┐      │
     │             │ Update Streak:            │      │
     │             │ - Mark today as active    │      │
     │             │ - Increment count         │      │
     │             └────────────┬──────────────┘      │
     │                          │                     │
     │                          │ Update/Create streak│
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 4. View session history  │                     │
     │ GET /v1/study-sessions?page=1&limit=20         │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find user's sessions│
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [sessions],      │                     │
     │   total, page, limit }   │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## 8. Note & Resource Management Flow

### 8.1 Note Management

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │   Notes     │         │ Database │
│ (Client)│              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Create note           │                     │
     │ POST /v1/notes           │                     │
     │ {                        │                     │
     │   title: "DP Pattern",   │                     │
     │   content: "markdown...",│                     │
     │   problemId: "123",      │                     │
     │   topicId: "456"         │                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────┐          │
     │             │ Create NoteEntity    │          │
     │             │ - userId             │          │
     │             │ - title, content     │          │
     │             │ - problemId (opt)    │          │
     │             │ - topicId (opt)      │          │
     │             └────────────┬──────────┘          │
     │                          │                     │
     │                          │ Save note           │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. Get notes for problem │                     │
     │ GET /v1/notes?problemId=123                    │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find notes filtered │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [notes] }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 3. Update note           │                     │
     │ PUT /v1/notes/:id        │                     │
     │ { content: "updated..." }│                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Update note         │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

### 8.2 Resource Management

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │ Resources   │         │ Database │
│ (Client)│              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. Add resource          │                     │
     │ POST /v1/resources       │                     │
     │ {                        │                     │
     │   title: "NeetCode video",                     │
     │   url: "youtube.com/...", │                    │
     │   type: "VIDEO",         │                     │
     │   problemId: "123"       │                     │
     │ }                        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │             ┌────────────▼──────────┐          │
     │             │ Create               │          │
     │             │ ResourceEntity       │          │
     │             │ - userId             │          │
     │             │ - title, url, type   │          │
     │             │ - problemId (opt)    │          │
     │             │ - topicId (opt)      │          │
     │             └────────────┬──────────┘          │
     │                          │                     │
     │                          │ Save resource       │
     │                          ├────────────────────>│
     │                          │                     │
     │ { message, data }        │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
     │ 2. Get resources         │                     │
     │ GET /v1/resources?problemId=123                │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find resources      │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: [resources] }    │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## 9. Streak Tracking Flow

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  User   │              │  Streaks    │         │ Database │
│ (Client)│              │ Controller  │         │          │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ 1. User completes activity (problem, session)  │
     │    [Triggered by other flows]                  │
     │                          │                     │
     │           ┌──────────────▼─────────┐           │
     │           │ Check today's streak:  │           │
     │           │ - Find streak for user │           │
     │           │ - Check lastActivityDate│          │
     │           └──────────────┬─────────┘           │
     │                          │                     │
     │                          │ Find active streak  │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │ StreakEntity or null│
     │                          │                     │
     │           ┌──────────────▼─────────┐           │
     │           │ Decision:              │           │
     │           │ - No streak? Create    │           │
     │           │ - Same day? Update     │           │
     │           │ - Next day? Increment  │           │
     │           │ - Gap? Reset to 1      │           │
     │           └──────────────┬─────────┘           │
     │                          │                     │
     │           ┌──────────────▼─────────┐           │
     │           │ Update/Create streak:  │           │
     │           │ - currentStreak        │           │
     │           │ - longestStreak        │           │
     │           │ - lastActivityDate     │           │
     │           │ - totalActiveDays++    │           │
     │           └──────────────┬─────────┘           │
     │                          │                     │
     │                          │ Save streak         │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │                     │
     │ 2. Get current streak    │                     │
     │ GET /v1/streaks          │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Find user's streak  │
     │                          ├────────────────────>│
     │                          │                     │
     │ { data: {                │                     │
     │   currentStreak: 15,     │                     │
     │   longestStreak: 45,     │                     │
     │   lastActivityDate: "...",                     │
     │   totalActiveDays: 120   │                     │
     │ }}                       │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

### Streak Logic

```
Last Activity Date      Today's Date       Action
─────────────────────────────────────────────────────
null (no streak)        any                Create new streak (count=1)
today                   today              Update activities (count same)
yesterday               today              Increment streak (count++)
2+ days ago             today              Reset streak (count=1)
```

---

## 10. Background Job Processing Flow

### 10.1 Email Queue (BullMQ)

```
┌─────────────┐         ┌─────────────┐         ┌─────────┐         ┌──────────┐
│   Trigger   │         │    Mail     │         │  Redis  │         │  Email   │
│   Event     │         │    Queue    │         │  Queue  │         │  Service │
└──────┬──────┘         └──────┬──────┘         └────┬────┘         └────┬─────┘
       │                       │                     │                    │
       │ User signup           │                     │                    │
       │ (AuthController)      │                     │                    │
       ├──────────────────────>│                     │                    │
       │                       │                     │                    │
       │         ┌─────────────▼──────────┐          │                    │
       │         │ MailQueue.add()        │          │                    │
       │         │ {                      │          │                    │
       │         │   type: 'welcome',     │          │                    │
       │         │   to: user.email,      │          │                    │
       │         │   data: { name, otp }  │          │                    │
       │         │ }                      │          │                    │
       │         └─────────────┬──────────┘          │                    │
       │                       │                     │                    │
       │                       │ Add job to queue    │                    │
       │                       ├────────────────────>│                    │
       │                       │                     │                    │
       │                       │<────────────────────┤                    │
       │                       │ Job queued          │                    │
       │                       │                     │                    │
       │ Response sent         │                     │                    │
       │<──────────────────────┤                     │                    │
       │                       │                     │                    │
       │                       │                     │                    │
       │                       │    Background Process (Worker)           │
       │                       │                     │                    │
       │                       │                     │ Fetch job          │
       │                       │<────────────────────┤                    │
       │                       │ Job data            │                    │
       │                       │                     │                    │
       │         ┌─────────────▼──────────┐          │                    │
       │         │ Process email job:     │          │                    │
       │         │ - Parse data           │          │                    │
       │         │ - Render template      │          │                    │
       │         │ - Send email           │          │                    │
       │         └─────────────┬──────────┘          │                    │
       │                       │                     │                    │
       │                       │ Send email via SMTP/API                  │
       │                       ├─────────────────────────────────────────>│
       │                       │                     │                    │
       │                       │<─────────────────────────────────────────┤
       │                       │ Email sent          │                    │
       │                       │                     │                    │
       │                       │ Mark job complete   │                    │
       │                       ├────────────────────>│                    │
       │                       │                     │                    │
       │                       │                     │                    │
```

### 10.2 BullBoard Monitoring

```
┌─────────┐              ┌─────────────┐         ┌──────────┐
│  Admin  │              │ BullBoard   │         │  Redis   │
│  User   │              │  Dashboard  │         │  Queue   │
└────┬────┘              └──────┬──────┘         └────┬─────┘
     │                          │                     │
     │ GET /admin/queues        │                     │
     ├──────────────────────────>│                     │
     │                          │                     │
     │                          │ Fetch queue stats   │
     │                          ├────────────────────>│
     │                          │                     │
     │                          │<────────────────────┤
     │                          │ - Active jobs       │
     │                          │ - Completed jobs    │
     │                          │ - Failed jobs       │
     │                          │ - Waiting jobs      │
     │                          │                     │
     │ Dashboard showing:       │                     │
     │ - Job counts            │                     │
     │ - Failed jobs           │                     │
     │ - Retry buttons         │                     │
     │ - Job details           │                     │
     │<──────────────────────────┤                     │
     │                          │                     │
```

---

## Summary of Key Data Flows

### Request Flow Pattern
All requests follow this general pattern:
```
Client → Guards → Controller → Service → Database → Controller → Client
         ↓
    - AppAuthGuard (JWT)
    - AbilitiesGuard (CASL)
```

### Entity Relationships in Flows
```
User creates → UserLearningPath
            ↓
User adds → UserTopic
         ↓
User adds → UserProblem
         ↓
User solves → ProblemAttempt
           ↓
System updates → UserProblem.status
              ↓
System updates → UserTopic.proficiency
              ↓
System updates → Goal.progress
              ↓
System updates → Streak.currentStreak
```

### Async Operations
- Email sending (signup, password reset, reminders)
- Potential future: Analytics calculation, Report generation, Data export

### Real-time Updates (Future Enhancement)
Currently, the system uses REST APIs. Future enhancements could add:
- WebSocket connections for real-time streak updates
- Server-sent events for goal progress notifications
- Real-time collaboration on notes

---

## API Response Patterns

All API responses follow consistent patterns:

### Single Resource Response
```json
{
  "message": "Created successfully",
  "data": {
    "id": "...",
    "...": "..."
  }
}
```

### List Response
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### Error Response
```json
{
  "message": "Not found",
  "statusCode": 404,
  "error": "Not Found"
}
```

---

## Security Checkpoints in Data Flow

1. **Authentication**: JWT token validation on every protected request
2. **Authorization**: CASL ability checks for specific actions
3. **Data Isolation**: User-specific data filtered by `userId` from JWT
4. **Input Validation**: TypeBox schema validation on all inputs
5. **Password Security**: bcrypt hashing for password storage

---

This comprehensive set of data flow diagrams should help you understand how data moves through the GrowthOS backend system for all major user journeys.

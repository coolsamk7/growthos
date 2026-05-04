# GrowthOS - User Flow Diagrams

This document illustrates the complete user journey through the GrowthOS application from a user's perspective, showing screen flows, interactions, and decision points.

---

## Table of Contents
1. [User Onboarding Flow](#1-user-onboarding-flow)
2. [Authentication Flows](#2-authentication-flows)
3. [Dashboard & Navigation Flow](#3-dashboard--navigation-flow)
4. [Learning Path Management Flow](#4-learning-path-management-flow)
5. [Problem Practice Flow](#5-problem-practice-flow)
6. [Profile Management Flow](#6-profile-management-flow)
7. [Goal Setting & Tracking Flow](#7-goal-setting--tracking-flow)
8. [Study Session Flow](#8-study-session-flow)
9. [Progress & Analytics Flow](#9-progress--analytics-flow)

---

## 1. User Onboarding Flow

### New User Journey (First Time Experience)

```
┌─────────────────┐
│   Land on       │
│   Homepage      │
│   /             │
└────────┬────────┘
         │
         │ User reads about features:
         │ - Custom Paths
         │ - Templates
         │ - Progress Tracking
         │ - Streaks & Goals
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
    [Get Started]    [Sign In]         [Browse More]
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  Scroll to:
│   Signup Page   │  │   Login Page    │  - How it Works
│   /signup       │  │   /signIn       │  - Use Cases
└────────┬────────┘  └─────────────────┘  - Features
         │
         │ Fill form:
         │ - First Name
         │ - Last Name
         │ - Email
         │ - Password
         │
         │ [Create Account]
         ▼
┌─────────────────┐
│   OTP Page      │
│   /otp          │
└────────┬────────┘
         │
         │ Enter OTP from email
         │ [Verify]
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│   /app/dashboard│ ← User is now logged in
└────────┬────────┘
         │
         │ First time experience:
         │ - Empty state
         │ - "Create your first learning path"
         │ - Dashboard stats (all zeros)
         │
         ▼
┌─────────────────┐
│ Start Creating  │
│ Learning Path   │
└─────────────────┘
```

---

## 2. Authentication Flows

### 2.1 User Login Flow

```
┌─────────────────┐
│   Login Page    │
│   /signIn       │
└────────┬────────┘
         │
         │ Enter credentials:
         │ - Email
         │ - Password
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
    [Sign In]        [Forgot Password?]  [Create Account]
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Dashboard     │  │ Forgot Password │  │   Signup Page   │
│   /app/dashboard│  │ /forgot-password│  │   /signup       │
└────────┬────────┘  └────────┬────────┘  └─────────────────┘
         │                    │
         │                    │ Enter email
         │                    │ [Send Reset Link]
         │                    ▼
         │           ┌─────────────────┐
         │           │  Check Email    │
         │           │  (Reset Link)   │
         │           └────────┬────────┘
         │                    │
         │                    │ Click link
         │                    ▼
         │           ┌─────────────────┐
         │           │ Restore Password│
         │           │ /restore-password│
         │           └────────┬────────┘
         │                    │
         │                    │ Enter new password
         │                    │ [Reset Password]
         │                    │
         │                    ▼
         └────────────────────┤
                              │
                              ▼
                     ┌─────────────────┐
                     │   Login Page    │
                     │   /signIn       │
                     └─────────────────┘
```

### 2.2 Signup & Email Verification Flow

```
┌─────────────────┐
│   Signup Page   │
│   /signup       │
└────────┬────────┘
         │
         │ Fill form:
         │ □ First Name
         │ □ Last Name
         │ □ Email
         │ □ Password
         │ □ Show/Hide Password
         │
         │ [Create Account]
         │
         ├────────────────────┐
         │                    │
         ▼                    ▼
    Success              Error
         │                    │
         │                    └─► Show error toast
         │                        User corrects info
         │
         ▼
┌─────────────────┐
│   OTP Page      │
│   /otp          │
└────────┬────────┘
         │
         │ Display:
         │ "Check your email"
         │ "Enter the 6-digit code"
         │
         │ Enter OTP: [_][_][_][_][_][_]
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
    [Verify OTP]    [Resend Code]    [Back to Signup]
         │                 │                 │
         ▼                 │                 ▼
    Success               │            ┌─────────────────┐
         │                 │            │   Signup Page   │
         │                 │            └─────────────────┘
         │                 └─► New OTP sent
         │                     Show toast
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│   /app/dashboard│
│                 │
│ Welcome Message │
│ "Get started by │
│  creating your  │
│  first path"    │
└─────────────────┘
```

---

## 3. Dashboard & Navigation Flow

### Main Application Layout

```
┌───────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                    ┌──────────┐ │
│  │   Logo   │         GrowthOS                   │ Profile  │ │
│  └──────────┘                                    │ Avatar   │ │
│                                                  └────┬─────┘ │
├───────────────────────────────────────────────────────┼───────┤
│                                                       │       │
│  ┌──────────────┐                              Dropdown:     │
│  │   Sidebar    │                              - Profile     │
│  │              │                              - Settings    │
│  │ • Dashboard  │◄─ Current                    - Theme      │
│  │ • Learning   │                              - Logout     │
│  │   Paths      │                                           │
│  │ • Profile    │                                           │
│  │              │                                           │
│  └──────────────┘                                           │
│                                                              │
│       Main Content Area                                     │
│       (Dynamic based on selected menu)                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Dashboard Page Content

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                   │
│  Track your learning progress and stay consistent.          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────┐│
│  │ Total Study  │ │   Current    │ │  Completed   │ │... ││
│  │    Hours     │ │    Streak    │ │    Items     │ │    ││
│  │    45 hrs    │ │   15 days    │ │     127      │ │    ││
│  │    +12% ↑    │ │    +3 ↑     │ │     +8 ↑     │ │    ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────┘│
│                                                              │
│  ┌────────────────────────────┐  ┌─────────────────────────┐│
│  │  Weekly Study Hours        │  │  Progress by Category   ││
│  │                            │  │                         ││
│  │  [Bar Chart]               │  │  [Pie Chart]            ││
│  │   Mon Tue Wed Thu Fri ...  │  │  - DSA: 40%            ││
│  │                            │  │  - System Design: 30%   ││
│  └────────────────────────────┘  │  - Behavioral: 20%      ││
│                                   │  - Other: 10%           ││
│  ┌────────────────────────────┐  └─────────────────────────┘│
│  │  Recent Activity           │                             │
│  │  • Completed "Two Sum"     │                             │
│  │  • Started "Binary Search" │                             │
│  │  • Added "System Design"   │                             │
│  │  • Milestone: 100 problems │                             │
│  └────────────────────────────┘                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Navigation Flow

```
┌─────────────────┐
│   Dashboard     │
│   /app/dashboard│
└────────┬────────┘
         │
         │ Click sidebar menu
         │
         ├──────────┬───────────┬──────────┐
         │          │           │          │
         ▼          ▼           ▼          ▼
┌─────────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
│ Dashboard   │ │ Learning │ │Profile │ │Settings│
│             │ │ Paths    │ │        │ │        │
│ (stay here) │ │          │ │        │ │        │
└─────────────┘ └────┬─────┘ └───┬────┘ └───┬────┘
                     │            │          │
                     ▼            ▼          ▼
            /app/learning-paths   │    [Future]
                              /app/profile
```

---

## 4. Learning Path Management Flow

### 4.1 View Learning Paths

```
┌─────────────────────────────────────────────────────────────┐
│  Learning Paths                                              │
│  Manage your structured learning journeys.                   │
│                                                [+ Add New]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  FAANG Interview Prep                    [View Details]│ │
│  │  Comprehensive preparation for big tech interviews      │ │
│  │                                                         │ │
│  │  Overall Progress                              75%     │ │
│  │  [████████████████░░░░░░]                              │ │
│  │                                                         │ │
│  │  Completed: 150    Remaining: 50                       │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Module: Data Structures            85%   [▼]     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Module: Algorithms                 65%   [►]     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Module: System Design             40%   [►]     │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Full Stack Development                 [View Details]│ │
│  │  ...                                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Create New Learning Path Flow

```
┌─────────────────┐
│ Learning Paths  │
│     Page        │
└────────┬────────┘
         │
         │ Click [+ Add New]
         │
         ▼
┌─────────────────────────────────┐
│  Add Learning Path Dialog       │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Title                     │ │
│  │ [FAANG Prep 2024        ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Description               │ │
│  │ [Comprehensive prep for  ] │ │
│  │ [technical interviews... ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Target Date               │ │
│  │ [📅 12/31/2024]          │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Target Problems           │ │
│  │ [150                    ] │ │
│  └───────────────────────────┘ │
│                                 │
│       [Cancel]  [Create Path]  │
└─────────────────┬───────────────┘
                  │
                  │ [Create Path]
                  │
                  ▼
┌─────────────────────────────────┐
│  Success!                       │
│  Learning path created          │
│                                 │
│  Next steps:                    │
│  1. Add topics to your path     │
│  2. Add problems to practice    │
│  3. Start learning!             │
│                                 │
│       [Got it]                  │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  Learning Paths Page            │
│  (Shows new path in list)       │
└─────────────────────────────────┘
```

### 4.3 Expand Module & View Items Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Module: Data Structures                85%        [▼]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  15 of 20 completed                                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ✓ Arrays - Two Sum                        Easy     ✓  │ │
│  │   Status: Completed                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ▶ Linked Lists - Reverse                  Medium   ▶  │ │
│  │   Status: In Progress                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ○ Binary Trees - Max Depth                Easy     ○  │ │
│  │   Status: Todo                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ...                                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Legend:
✓ = Completed (Green)
▶ = In Progress (Blue)
○ = Todo (Gray)
```

---

## 5. Problem Practice Flow

### 5.1 Select & Start Problem

```
┌─────────────────┐
│ Learning Path   │
│   Dashboard     │
└────────┬────────┘
         │
         │ Expand module
         │ View problem list
         │
         ▼
┌─────────────────────────────────┐
│  ○ Binary Search                │
│     Difficulty: Medium           │
│     Status: Todo                │
│     [Start Problem]             │
└─────────────────┬───────────────┘
                  │
                  │ [Start Problem]
                  │ (Updates status to IN_PROGRESS)
                  │
                  ▼
┌─────────────────────────────────┐
│  ▶ Binary Search                │
│     Difficulty: Medium           │
│     Status: In Progress          │
│     Last Attempted: Just now    │
│                                 │
│  User opens LeetCode/IDE        │
│  and starts solving...          │
└─────────────────────────────────┘
```

### 5.2 Submit Attempt Flow

```
┌─────────────────┐
│  User solves    │
│  problem on     │
│  LeetCode/IDE   │
└────────┬────────┘
         │
         │ Returns to GrowthOS
         │
         ▼
┌─────────────────────────────────┐
│  ▶ Binary Search                │
│     Status: In Progress          │
│                                 │
│     [Submit Attempt]            │
└─────────────────┬───────────────┘
                  │
                  │ Click [Submit Attempt]
                  │
                  ▼
┌─────────────────────────────────┐
│  Submit Problem Attempt         │
│                                 │
│  Problem: Binary Search         │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Time Spent (minutes)      │ │
│  │ [45                     ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Result                    │ │
│  │ ○ Accepted                │ │
│  │ ○ Wrong Answer            │ │
│  │ ○ Time Limit Exceeded     │ │
│  │ ○ Runtime Error           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Solution Code (optional)  │ │
│  │ [def binary_search(...):] │ │
│  │ [    ...                ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Notes (optional)          │ │
│  │ [Used two pointers...   ] │ │
│  └───────────────────────────┘ │
│                                 │
│     [Cancel]  [Submit Attempt] │
└─────────────────┬───────────────┘
                  │
                  │ If Result = Accepted
                  ▼
┌─────────────────────────────────┐
│  🎉 Congratulations!            │
│                                 │
│  Problem completed!             │
│                                 │
│  Your Updates:                  │
│  ✓ Problem marked as COMPLETED  │
│  ✓ Streak updated (+1 day)      │
│  ✓ Goal progress updated        │
│  ✓ Topic proficiency updated    │
│                                 │
│       [Continue Learning]       │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  ✓ Binary Search                │
│     Difficulty: Medium           │
│     Status: Completed ✓         │
│     Attempts: 1                 │
│     Time: 45 min                │
│                                 │
│     [View Attempts History]     │
│     [Add Note]                  │
│     [Add Resource]              │
└─────────────────────────────────┘
```

### 5.3 Problem Status Journey

```
        New Problem Added
               │
               ▼
        ┌─────────────┐
        │    TODO     │ ← Initial State
        │      ○      │
        └──────┬──────┘
               │
               │ User clicks [Start Problem]
               ▼
        ┌─────────────┐
        │IN_PROGRESS  │ ← Working on it
        │      ▶      │
        └──────┬──────┘
               │
               │ Submit attempt
               │
        ┌──────┴───────┬──────────────┐
        │              │              │
        ▼              ▼              ▼
  ┌──────────┐   ┌──────────┐  ┌──────────┐
  │ACCEPTED  │   │  WRONG   │  │  ERROR   │
  │          │   │ ANSWER   │  │          │
  └────┬─────┘   └────┬─────┘  └────┬─────┘
       │              │              │
       │              │              │
       ▼              └──────┬───────┘
  ┌──────────┐              │
  │COMPLETED │              │ User can retry
  │    ✓     │              │
  └──────────┘              ▼
                     ┌─────────────┐
                     │IN_PROGRESS  │
                     │  (retry)    │
                     └─────────────┘
```

---

## 6. Profile Management Flow

### 6.1 View Profile

```
┌─────────────────┐
│   Navbar        │
│   [Avatar ▼]    │
└────────┬────────┘
         │
         │ Click avatar dropdown
         │ Select "Profile"
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Profile                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  [Avatar]  John Doe                                    │ │
│  │            john.doe@example.com                        │ │
│  │            Member since: Jan 2024                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Personal Information                           [Edit] │ │
│  │  ─────────────────────────────────────────────────────│ │
│  │  First Name: John                                      │ │
│  │  Last Name: Doe                                        │ │
│  │  Email: john.doe@example.com                          │ │
│  │  Phone: +1 234 567 8900                               │ │
│  │  Date of Birth: 01/15/1995                            │ │
│  │  Bio: Software engineer passionate about...           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Location                                       [Edit] │ │
│  │  ─────────────────────────────────────────────────────│ │
│  │  City: San Francisco                                   │ │
│  │  State: California                                     │ │
│  │  Country: United States                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Professional Information                       [Edit] │ │
│  │  ─────────────────────────────────────────────────────│ │
│  │  Occupation: Software Engineer                         │ │
│  │  Company: TechCorp Inc.                                │ │
│  │  Experience: 3-5 years                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Education                                      [Edit] │ │
│  │  Social Links                                   [Edit] │ │
│  │  Learning Goals                                 [Edit] │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Edit Profile Section

```
┌─────────────────────────────────┐
│  Personal Information    [Edit] │
└─────────────────┬───────────────┘
                  │
                  │ Click [Edit]
                  │
                  ▼
┌─────────────────────────────────┐
│  Edit Personal Information      │
│                                 │
│  ┌───────────────────────────┐ │
│  │ First Name                │ │
│  │ [John                   ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Last Name                 │ │
│  │ [Doe                    ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Email                     │ │
│  │ [john.doe@example.com   ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Phone                     │ │
│  │ [+1 234 567 8900        ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Date of Birth             │ │
│  │ [📅 01/15/1995]          │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Bio                       │ │
│  │ [Software engineer...   ] │ │
│  │ [passionate about...    ] │ │
│  └───────────────────────────┘ │
│                                 │
│     [Cancel]  [Save Changes]   │
└─────────────────┬───────────────┘
                  │
                  │ [Save Changes]
                  │
                  ▼
┌─────────────────────────────────┐
│  ✓ Success!                     │
│  Profile updated successfully   │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  Profile Page                   │
│  (Shows updated information)    │
└─────────────────────────────────┘
```

---

## 7. Goal Setting & Tracking Flow

### 7.1 Create Goal Flow

```
┌─────────────────┐
│   Dashboard     │
└────────┬────────┘
         │
         │ Navigate to Goals section
         │ (or from sidebar if available)
         │
         ▼
┌─────────────────────────────────┐
│  Goals                          │
│                          [+ New]│
├─────────────────────────────────┤
│                                 │
│  Active Goals (2)               │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Solve 100 Problems        │ │
│  │ Progress: 45/100 (45%)    │ │
│  │ [███████░░░░░░░░]        │ │
│  │ Deadline: Dec 31, 2024    │ │
│  └───────────────────────────┘ │
│                                 │
│  ...                            │
│                                 │
└─────────────────┬───────────────┘
                  │
                  │ Click [+ New]
                  │
                  ▼
┌─────────────────────────────────┐
│  Create New Goal                │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Goal Title                │ │
│  │ [Solve 150 Problems     ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Description               │ │
│  │ [Focus on medium to     ] │ │
│  │ [hard level problems... ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Category                  │ │
│  │ ○ Problems                │ │
│  │ ○ Study Hours             │ │
│  │ ○ Learning Paths          │ │
│  │ ○ Custom                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Target Value              │ │
│  │ [150                    ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Current Value             │ │
│  │ [0                      ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Target Date               │ │
│  │ [📅 12/31/2024]          │ │
│  └───────────────────────────┘ │
│                                 │
│     [Cancel]  [Create Goal]    │
└─────────────────┬───────────────┘
                  │
                  │ [Create Goal]
                  │
                  ▼
┌─────────────────────────────────┐
│  ✓ Goal Created!                │
│                                 │
│  Your goal will automatically   │
│  update as you complete         │
│  problems.                      │
│                                 │
│       [Got it]                  │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  Goals Page                     │
│  (Shows new goal)               │
└─────────────────────────────────┘
```

### 7.2 Goal Auto-Update Flow

```
┌─────────────────┐
│  User completes │
│  a problem      │
│  (submits       │
│   attempt)      │
└────────┬────────┘
         │
         │ System processes
         │
         ▼
┌─────────────────────────────────┐
│  Backend Updates:               │
│  1. Problem status → COMPLETED  │
│  2. Finds relevant goals        │
│  3. Increments goal progress    │
│                                 │
│  Goal: "Solve 150 Problems"     │
│  Current: 45 → 46              │
│  Progress: 30% → 30.7%         │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│  🎯 Goal Progress Updated!      │
│                                 │
│  Solve 150 Problems             │
│  46/150 completed (30.7%)       │
│                                 │
│  Keep going! You're on track!   │
│                                 │
│       [View Goal]               │
└─────────────────────────────────┘
```

---

## 8. Study Session Flow

### Start & End Study Session

```
┌─────────────────┐
│   Dashboard     │
│   or any page   │
└────────┬────────┘
         │
         │ User wants to study
         │ Click [Start Session]
         │
         ▼
┌─────────────────────────────────┐
│  Start Study Session            │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Session Type              │ │
│  │ ○ Practice                │ │
│  │ ○ Learning                │ │
│  │ ○ Review                  │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Topic (optional)          │ │
│  │ [Select topic...        ▼]│ │
│  └───────────────────────────┘ │
│                                 │
│     [Cancel]  [Start Session]  │
└─────────────────┬───────────────┘
                  │
                  │ [Start Session]
                  │
                  ▼
┌─────────────────────────────────┐
│  📚 Session Active              │
│                                 │
│  ⏱️ Timer: 00:15:23             │
│                                 │
│  Type: Practice                 │
│  Topic: Data Structures         │
│                                 │
│  [End Session]                  │
└─────────────────┬───────────────┘
                  │
                  │ User studies...
                  │ Solves problems...
                  │
                  │ Click [End Session]
                  │
                  ▼
┌─────────────────────────────────┐
│  End Study Session              │
│                                 │
│  Duration: 45 minutes           │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Problems Solved           │ │
│  │ [5                      ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Topics Covered            │ │
│  │ [2                      ] │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Session Notes             │ │
│  │ [Great session! Made    ] │ │
│  │ [good progress on...    ] │ │
│  └───────────────────────────┘ │
│                                 │
│     [Cancel]  [End Session]    │
└─────────────────┬───────────────┘
                  │
                  │ [End Session]
                  │
                  ▼
┌─────────────────────────────────┐
│  ✓ Session Saved!               │
│                                 │
│  Duration: 45 minutes           │
│  Problems: 5                    │
│                                 │
│  Your streak has been updated!  │
│  Current streak: 16 days 🔥    │
│                                 │
│       [Continue]                │
└─────────────────────────────────┘
```

---

## 9. Progress & Analytics Flow

### 9.1 View Progress on Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quick Stats                                          │  │
│  │                                                       │  │
│  │  Total Study Hours: 145 hrs                          │  │
│  │  Current Streak: 23 days 🔥                          │  │
│  │  Longest Streak: 45 days                             │  │
│  │  Problems Completed: 287                             │  │
│  │  Active Learning Paths: 3                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────┐  ┌─────────────────────────┐│
│  │  Weekly Activity           │  │  Category Breakdown     ││
│  │                            │  │                         ││
│  │  [Bar Chart showing        │  │  [Pie Chart showing     ││
│  │   hours per day]           │  │   distribution]         ││
│  │                            │  │                         ││
│  │  Mon: 2hrs                 │  │  DSA: 45%              ││
│  │  Tue: 3hrs                 │  │  System Design: 25%     ││
│  │  Wed: 1.5hrs               │  │  Algorithms: 20%        ││
│  │  ...                       │  │  Other: 10%             ││
│  └────────────────────────────┘  └─────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Recent Achievements                                  │  │
│  │                                                       │  │
│  │  🏆 Completed 100 problems milestone                 │  │
│  │  🔥 30-day streak achieved                           │  │
│  │  ✓ Finished "Arrays & Strings" module                │  │
│  │  ⭐ Earned "Problem Solver" badge                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Learning Path Progress                               │  │
│  │                                                       │  │
│  │  FAANG Prep          [██████████░░░░] 75%           │  │
│  │  Full Stack Dev      [████░░░░░░░░░░] 30%           │  │
│  │  System Design       [████████░░░░░░] 60%           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 9.2 Streak Visualization

```
┌─────────────────────────────────┐
│  🔥 Streak Dashboard            │
│                                 │
│  Current Streak: 23 days        │
│  Longest Streak: 45 days        │
│  Total Active Days: 187         │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Calendar View            │ │
│  │                           │ │
│  │  Mo Tu We Th Fr Sa Su     │ │
│  │  ══ ══ ══ ══ ══ ══ ══     │ │
│  │                           │ │
│  │   1  2  3  4  5  6  7     │ │
│  │  🔥 🔥 ⬜ 🔥 🔥 🔥 🔥     │ │
│  │                           │ │
│  │   8  9 10 11 12 13 14     │ │
│  │  🔥 🔥 🔥 🔥 🔥 🔥 🔥     │ │
│  │                           │ │
│  │  15 16 17 18 19 20 21     │ │
│  │  🔥 🔥 🔥 🔥 🔥 🔥 🔥     │ │
│  │                           │ │
│  │  22 23 24 25 26 27 28     │ │
│  │  🔥 🔥 ⬜ ⬜ ⬜ ⬜ ⬜     │ │
│  └───────────────────────────┘ │
│                                 │
│  🔥 = Active Day                │
│  ⬜ = Inactive Day              │
│                                 │
│  Keep it up! Don't break        │
│  your streak!                   │
└─────────────────────────────────┘
```

---

## User Journey Summary

### Complete User Flow (High Level)

```
                    ┌─────────────┐
                    │   Landing   │
                    │    Page     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
        [New User]                [Returning User]
              │                         │
              ▼                         ▼
      ┌───────────────┐        ┌───────────────┐
      │    Sign Up    │        │     Login     │
      │      +        │        └───────┬───────┘
      │  Email Verify │                │
      └───────┬───────┘                │
              │                        │
              └────────────┬───────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Dashboard     │
                  │   (Main Hub)    │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Learning    │  │    Profile    │  │   Settings    │
│    Paths      │  │  Management   │  │   (Future)    │
└───────┬───────┘  └───────────────┘  └───────────────┘
        │
        ├─► Create Path
        ├─► Add Topics
        ├─► Add Problems
        │
        ▼
┌───────────────┐
│    Solve      │
│   Problems    │
└───────┬───────┘
        │
        ├─► Submit Attempts
        ├─► Track Progress
        ├─► Add Notes
        │
        ▼
┌───────────────┐
│   Track       │
│   Progress    │
└───────┬───────┘
        │
        ├─► View Stats
        ├─► Check Streaks
        ├─► Monitor Goals
        │
        ▼
┌───────────────┐
│   Achieve     │
│    Goals      │
└───────────────┘
```

---

## Key User Interactions

### Primary Actions
1. **Authentication**: Sign up → Verify email → Login
2. **Setup**: Create learning path → Add topics → Add problems
3. **Practice**: Start problem → Submit attempt → Track progress
4. **Track**: View dashboard → Check streaks → Monitor goals
5. **Manage**: Update profile → Edit paths → Add notes/resources

### State Transitions
- **Problem**: TODO → IN_PROGRESS → COMPLETED
- **Goal**: Created → In Progress → Completed
- **Session**: Not Started → Active → Completed
- **Streak**: New → Active → Broken/Extended

### Feedback Mechanisms
- **Success Toasts**: "Profile updated!", "Problem completed!"
- **Progress Bars**: Visual representation of completion
- **Badges/Icons**: ✓ Completed, ▶ In Progress, ○ Todo
- **Statistics**: Real-time updates on dashboard
- **Notifications**: Streak reminders, goal achievements

---

## Mobile Responsive Considerations

### Navigation Adaptations
```
Desktop:                        Mobile:
┌────────────────────┐         ┌──────────────┐
│ Sidebar + Content  │         │   Content    │
│                    │         │              │
│ [Sidebar]  [Main]  │    →    │   [Main]     │
│                    │         │              │
│                    │         │  [☰ Menu]    │
└────────────────────┘         └──────────────┘
```

### Key Mobile Optimizations
- Hamburger menu for navigation
- Collapsible sections
- Touch-friendly buttons (min 44x44px)
- Simplified forms (one field per row)
- Bottom navigation bar for main actions
- Swipe gestures for module expansion

---

This comprehensive user flow document captures the complete journey users take through the GrowthOS application, from initial landing to daily practice and progress tracking.

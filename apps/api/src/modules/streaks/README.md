# Streak Implementation

This module provides a complete streak tracking system for user activity and problem-solving.

## Features

- **Daily Activity Tracking**: Automatically tracks when users are active
- **Streak Calculation**: Maintains current and longest streak counts
- **Problem Solving Counter**: Tracks total problems solved
- **Automatic Streak Reset**: Resets streaks when broken (>1 day gap)
- **Same-Day Protection**: Prevents multiple updates on the same day

## API Endpoints

### Get Current User Streak Stats
```
GET /api/v1/streaks/stats/current
```
Returns comprehensive streak statistics for the authenticated user including:
- Current streak count
- Longest streak achieved
- Total study days
- Total problems solved
- Last activity date
- Whether user is active today

### Track Daily Activity
```
POST /api/v1/streaks/activity/track
```
Call this endpoint when a user performs any learning activity. It will:
- Create a streak if it's the user's first activity
- Increment the streak if it's a consecutive day
- Reset the streak if it was broken
- Do nothing if already tracked today

### Increment Problems Solved
```
POST /api/v1/streaks/problems/increment
```
Call this endpoint when a user successfully completes a problem. It will:
- Update the daily streak (if needed)
- Increment the total problems solved counter

### Standard CRUD Operations
The module also supports standard CRUD operations:
- `GET /api/v1/streaks` - List all streaks (admin only)
- `GET /api/v1/streaks/:id` - Get specific streak
- `POST /api/v1/streaks` - Create streak (manual)
- `PUT /api/v1/streaks/:id` - Update streak (manual)
- `DELETE /api/v1/streaks/:id` - Delete streak

## Service Methods

### `updateStreakForUser(userId: string)`
Updates the streak for a user based on their activity. Handles:
- First-time streak creation
- Consecutive day detection
- Streak breaking
- Longest streak tracking

### `incrementProblemsSolved(userId: string)`
Combines streak update with problem counter increment.

### `getCurrentStreak(userId: string)`
Returns the current valid streak count (0 if broken).

### `getStreakStats(userId: string)`
Returns comprehensive statistics object with all streak data.

## Integration Example

### In a Study Session Module
```typescript
import { StreaksService } from '../streaks/services';

@Injectable()
export class StudySessionsService {
    constructor(private readonly streaksService: StreaksService) {}

    async completeSession(userId: string) {
        // Complete the study session
        // ...
        
        // Track the activity for streak
        await this.streaksService.updateStreakForUser(userId);
    }
}
```

### In a Problem Solving Module
```typescript
import { StreaksService } from '../streaks/services';

@Injectable()
export class ProblemsService {
    constructor(private readonly streaksService: StreaksService) {}

    async submitSolution(userId: string, problemId: string) {
        // Validate and save solution
        // ...
        
        if (isCorrect) {
            // Increment both streak and problems counter
            await this.streaksService.incrementProblemsSolved(userId);
        }
    }
}
```

## Database Schema

The `streaks` table contains:
- `id`: Primary key
- `user_id`: Foreign key to users table (unique)
- `current_streak`: Current consecutive days count
- `longest_streak`: Highest streak ever achieved
- `last_activity_date`: Date of last tracked activity
- `total_study_days`: Total number of days with activity
- `total_problems_solved`: Total problems completed
- `created_at`: Record creation timestamp
- `deleted_at`: Soft delete timestamp

## Streak Logic

### Consecutive Days
If a user is active today and was active yesterday, their streak increments.

### Broken Streak
If more than 1 day passes without activity, the streak resets to 1.

### Same Day
Multiple activities on the same day don't affect the streak count.

### Longest Streak
Automatically tracked and updated whenever current streak exceeds it.

## Testing

Run the service tests:
```bash
npm test streaks.service.spec.ts
```

## Notes

- All date comparisons use midnight (00:00:00) to avoid time-of-day issues
- Streaks are calculated based on calendar days, not 24-hour periods
- The service is exported from the module for use in other modules
- All endpoints require authentication via Bearer token

# User Learning Paths API

This document describes the request and response payloads for the User Learning Paths API endpoints.

## Base URL
`/v1/user-learning-paths`

## Authentication
All endpoints require Bearer token authentication.

---

## Endpoints

### 1. Create User Learning Path

**POST** `/v1/user-learning-paths`

Creates a new learning path for the authenticated user.

#### Request Body
```json
{
  "name": "Full Stack Development Path",
  "description": "Master full stack development with focus on React and Node.js",
  "targetDate": "2026-12-31T23:59:59.000Z",
  "targetProblems": 100,
  "masterLearningPathId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Fields:**
- `name` (string, required): Name of the learning path (1-255 characters)
- `description` (string, optional): Detailed description of the learning path
- `targetDate` (string, optional): Target completion date in ISO 8601 format
- `targetProblems` (number, optional): Target number of problems to complete (minimum 0)
- `masterLearningPathId` (string, optional): ID of the master learning path to clone from

#### Response (201 Created)
```json
{
  "message": "User learning path created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987e6543-e21b-12d3-a456-426614174000",
    "name": "Full Stack Development Path",
    "description": "Master full stack development with focus on React and Node.js",
    "targetDate": "2026-12-31T23:59:59.000Z",
    "targetProblems": 100,
    "masterLearningPathId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-21T18:20:00.000Z",
    "updatedAt": "2026-04-21T18:20:00.000Z",
    "deletedAt": null
  }
}
```

---

### 2. Get All User Learning Paths

**GET** `/v1/user-learning-paths?page=1&limit=20`

Retrieves a paginated list of learning paths. Regular users see only their own paths; admins see all paths.

#### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

#### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "987e6543-e21b-12d3-a456-426614174000",
      "name": "Full Stack Development Path",
      "description": "Master full stack development with focus on React and Node.js",
      "targetDate": "2026-12-31T23:59:59.000Z",
      "targetProblems": 100,
      "masterLearningPathId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-04-21T18:20:00.000Z",
      "updatedAt": "2026-04-21T18:20:00.000Z",
      "deletedAt": null
    },
    {
      "id": "234e5678-e89b-12d3-a456-426614174001",
      "userId": "987e6543-e21b-12d3-a456-426614174000",
      "name": "Data Structures & Algorithms",
      "description": "Complete DSA fundamentals",
      "targetDate": "2026-09-30T23:59:59.000Z",
      "targetProblems": 150,
      "masterLearningPathId": null,
      "createdAt": "2026-04-20T10:15:00.000Z",
      "updatedAt": "2026-04-20T10:15:00.000Z",
      "deletedAt": null
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

### 3. Get User Learning Path by ID

**GET** `/v1/user-learning-paths/:id`

Retrieves a specific learning path by ID. Regular users can only access their own paths.

#### URL Parameters
- `id` (string, required): Learning path ID

#### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "987e6543-e21b-12d3-a456-426614174000",
  "name": "Full Stack Development Path",
  "description": "Master full stack development with focus on React and Node.js",
  "targetDate": "2026-12-31T23:59:59.000Z",
  "targetProblems": 100,
  "masterLearningPathId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-04-21T18:20:00.000Z",
  "updatedAt": "2026-04-21T18:20:00.000Z",
  "deletedAt": null
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "User learning path not found"
}
```

---

### 4. Update User Learning Path

**PUT** `/v1/user-learning-paths/:id`

Updates an existing learning path. Regular users can only update their own paths.

#### URL Parameters
- `id` (string, required): Learning path ID

#### Request Body
All fields are optional. Only provide fields you want to update.

```json
{
  "name": "Updated Full Stack Development Path",
  "description": "Updated description with new focus areas",
  "targetDate": "2027-06-30T23:59:59.000Z",
  "targetProblems": 150
}
```

**Fields:**
- `name` (string, optional): New name for the learning path (1-255 characters)
- `description` (string, optional): New description
- `targetDate` (string, optional): New target date in ISO 8601 format
- `targetProblems` (number, optional): New target number of problems (minimum 0)

#### Response (200 OK)
```json
{
  "message": "User learning path updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987e6543-e21b-12d3-a456-426614174000",
    "name": "Updated Full Stack Development Path",
    "description": "Updated description with new focus areas",
    "targetDate": "2027-06-30T23:59:59.000Z",
    "targetProblems": 150,
    "masterLearningPathId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-21T18:20:00.000Z",
    "updatedAt": "2026-04-21T18:25:00.000Z",
    "deletedAt": null
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "User learning path not found"
}
```

---

### 5. Delete User Learning Path

**DELETE** `/v1/user-learning-paths/:id`

Soft deletes a learning path. Regular users can only delete their own paths.

#### URL Parameters
- `id` (string, required): Learning path ID

#### Response (200 OK)
```json
{
  "message": "User learning path deleted successfully"
}
```

#### Error Response (404 Not Found)
```json
{
  "message": "User learning path not found"
}
```

---

## Permissions

The API uses CASL-based authorization:
- **CREATE**: Requires `CREATE` permission on `USER_LEARNING_PATH` subject
- **READ**: Requires `READ` permission on `USER_LEARNING_PATH` subject
  - Regular users can only read their own learning paths
  - Admins can read all learning paths
- **UPDATE**: Requires `UPDATE` permission on `USER_LEARNING_PATH` subject
  - Regular users can only update their own learning paths
- **DELETE**: Requires `DELETE` permission on `USER_LEARNING_PATH` subject
  - Regular users can only delete their own learning paths

---

## Error Codes

- `201`: Created successfully
- `200`: Success
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found

---

## Notes

- All timestamps are in ISO 8601 format
- Soft delete is used, so deleted items have `deletedAt` timestamp instead of being removed
- The `userId` is automatically set from the authenticated user's token
- Regular users (role: 'USER') are automatically filtered to see only their own paths

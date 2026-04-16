# API Client Setup Guide

This guide explains how to generate and use the TypeScript API client from your Swagger/OpenAPI definition.

## Setup Complete ✅

The following has been configured:
- **API Client Package**: `@growthos/api-client` in `packages/shared/api-client/`
- **Code Generator**: `@hey-api/openapi-ts` for generating TypeScript types and services
- **Web Integration**: API client is already added to the web project dependencies

## How to Generate the API Client

### Method 1: From Running API Server (Recommended)

1. **Start your API server**:
   ```bash
   yarn workspace @growthos/api dev
   ```

2. **In a new terminal, generate the client**:
   ```bash
   yarn generate:api-client
   ```

   This will:
   - Fetch the OpenAPI spec from `http://localhost:5600/openapi.json`
   - Generate TypeScript types and services in `packages/shared/api-client/src/generated/`

### Method 2: From Exported OpenAPI File

1. **Start your API server and export the spec**:
   ```bash
   yarn workspace @growthos/api dev
   # In another terminal:
   yarn workspace @growthos/api export:openapi
   ```

2. **Generate from the file**:
   ```bash
   cd packages/shared/api-client
   USE_LOCAL_SPEC=true yarn generate
   ```

## Usage in Web Project

### Basic Setup

```typescript
// src/lib/api-client.ts (already created)
import { ApiClient } from '@growthos/api-client';

const apiClient = new ApiClient('http://localhost:5600');

// Set auth token after login
apiClient.setToken('your-jwt-token');

// Clear token on logout
apiClient.clearToken();
```

### Using Generated Services

After generation, you can import and use the generated services:

```typescript
import { UserService, PostService } from '@growthos/api-client';

// Example: Fetch users
async function fetchUsers() {
  try {
    const users = await UserService.getUsers();
    console.log(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

// Example: Create a post
async function createPost(data: CreatePostDto) {
  try {
    const post = await PostService.createPost({ requestBody: data });
    return post;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
}
```

### With React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { UserService } from '@growthos/api-client';

// Fetch data with useQuery
function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getUsers(),
  });
}

// Mutate data with useMutation
function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserDto) => 
      UserService.createUser({ requestBody: data }),
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage in component
function UserList() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={() => createUser.mutate({ name: 'John' })}>
        Add User
      </button>
    </div>
  );
}
```

### TypeScript Types

All types are automatically generated and typed:

```typescript
import type { User, CreateUserDto, UpdateUserDto } from '@growthos/api-client';

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
};

const createDto: CreateUserDto = {
  name: 'Jane Doe',
  email: 'jane@example.com',
};
```

## Configuration

### API Client Config (`packages/shared/api-client/openapi-ts.config.ts`)

```typescript
export default defineConfig({
  client: 'axios',                    // HTTP client (axios, fetch, etc.)
  input: 'http://localhost:5600/openapi.json',  // API spec URL
  output: {
    path: './src/generated',          // Output directory
    format: 'prettier',               // Auto-format with Prettier
    lint: 'eslint',                   // Auto-lint with ESLint
  },
  types: {
    enums: 'javascript',              // Generate enums as JS objects
  },
  services: {
    asClass: true,                    // Generate services as classes
  },
});
```

### Environment Variables (Web)

Create `.env` in `apps/web/`:

```env
VITE_API_URL=http://localhost:5600
```

## Workflow

1. **Develop API**: Add/modify endpoints in your NestJS API
2. **Generate Client**: Run `yarn generate:api-client` (with API running)
3. **Use in Web**: Import and use the generated types/services
4. **Commit**: The generated code is gitignored, regenerate when needed

## Tips

- **Regenerate after API changes**: Always regenerate when you modify API endpoints
- **Add to CI/CD**: Add generation step to your build pipeline
- **Version control**: Consider committing generated code if you want deterministic builds
- **Type safety**: The generated client is fully typed, providing excellent DX

## Troubleshooting

**API not running?**
```bash
yarn workspace @growthos/api dev
```

**Generation failed?**
- Ensure API is running on port 5600
- Check `http://localhost:5600/openapi.json` is accessible
- Verify OpenAPI spec is valid

**Import errors in web?**
- Make sure you've generated the client first
- Check that `@growthos/api-client` is in web's dependencies
- Run `yarn install` if needed

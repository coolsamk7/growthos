# API Client

Auto-generated TypeScript API client from OpenAPI/Swagger specification.

## Usage

### Generate client from API

Make sure your API server is running, then:

```bash
yarn generate
```

This will fetch the OpenAPI spec from `http://localhost:5600/openapi.json` and generate TypeScript types and services.

### Use in your app

```typescript
import { ApiClient } from '@growthos/api-client';

// Create client instance
const apiClient = new ApiClient('http://localhost:5600', 'your-auth-token');

// Set token later
apiClient.setToken('new-token');

// Clear token
apiClient.clearToken();
```

### Use generated services

```typescript
import { UserService } from '@growthos/api-client';

// Call API endpoints
const users = await UserService.getUsers();
const user = await UserService.getUserById({ id: '123' });
```

## Configuration

Edit `openapi-ts.config.ts` to customize generation:
- Change API URL
- Customize output path
- Configure client type (axios, fetch, etc.)

# @pcstyle/auth

> Unified authentication SDK for PCSTYLE services using WorkOS AuthKit

## Quick Start

### 1. Install the package

```bash
bun add @pcstyle/auth @workos-inc/authkit-nextjs
```

### 2. Add environment variables

```bash
# .env.local
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=<32+ char password>
WORKOS_COOKIE_DOMAIN=.pcstyle.dev
```

> **Important**: `WORKOS_COOKIE_PASSWORD` must match across all subdomains!

### 3. Create middleware

```typescript
// middleware.ts
import { createAuthMiddleware } from '@pcstyle/auth/middleware';

export default createAuthMiddleware({
  publicPaths: ['/api/health', '/public'],
});

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|.*\\..*).*)'],
};
```

### 4. Wrap your app with AuthKitProvider

```tsx
// app/layout.tsx
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthKitProvider>{children}</AuthKitProvider>
      </body>
    </html>
  );
}
```

### 5. Use auth in your components

```tsx
// Server Component
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function ProtectedPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  return <h1>Welcome, {user.firstName}!</h1>;
}
```

```tsx
// Client Component
'use client';
import { useAuth } from '@pcstyle/auth';

export function ProfileButton() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <span>Loading...</span>;
  if (!isAuthenticated) return <a href="https://auth.pcstyle.dev">Sign In</a>;
  return <span>{user.email}</span>;
}
```

## Convex Integration

```typescript
// convex/auth.config.ts
import { createConvexAuthConfig } from '@pcstyle/auth/convex';

export default createConvexAuthConfig(process.env.WORKOS_CLIENT_ID);
```

## API Reference

### Middleware

| Function | Description |
|----------|-------------|
| `createAuthMiddleware(options?)` | Create configured auth middleware |

### Hooks

| Hook | Description |
|------|-------------|
| `useAuth()` | Get auth state: `{ user, isLoading, isAuthenticated }` |
| `useUser()` | Get current user (throws if unauthenticated) |
| `getSignInUrl(returnTo?)` | Get sign-in URL with optional return path |
| `getSignOutUrl()` | Get sign-out URL |

### Types

- `User` - WorkOS user object
- `AuthState` - Auth hook return type
- `AuthMiddlewareOptions` - Middleware config options
- `ConvexUser` - Convex user record type

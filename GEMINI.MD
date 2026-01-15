# auth.pcstyle.dev

Centralized authentication service for the pcstyle.dev ecosystem.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: WorkOS AuthKit
- **Database**: Convex (real-time sync)
- **Styling**: Tailwind CSS v4, Framer Motion
- **SDK**: `@pcstyle/auth-client` for child apps

## Project Structure

```
auth/
├── app/
│   ├── page.tsx          # Login UI
│   ├── callback/         # OAuth callback
│   └── api/me/           # Session verification
├── convex/
│   ├── schema.ts         # Users table
│   ├── auth.ts           # Internal auth functions
│   └── workos.ts         # Event handlers
├── packages/auth-client/ # Shared SDK
└── middleware.ts         # AuthKit middleware
```

## Development

```bash
# Start dev server
bun dev

# Run Convex dev
bunx convex dev

# Build for production  
bun run build
```

## Environment Variables

Copy `env.example` to `.env.local` and configure:

- `WORKOS_CLIENT_ID` - WorkOS client ID
- `WORKOS_API_KEY` - WorkOS API key  
- `WORKOS_REDIRECT_URI` - OAuth callback URL
- `WORKOS_COOKIE_DOMAIN` - `.pcstyle.dev` for production
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `WORKOS_WEBHOOK_SECRET` - For Convex sync

## Cross-Subdomain Auth

Child apps use `@pcstyle/auth-client`:

```typescript
import { useUser, login, logout } from '@pcstyle/auth-client';

function App() {
  const { user, isLoading } = useUser();
  
  if (!user) return <button onClick={() => login()}>Sign In</button>;
  return <p>Welcome, {user.firstName}</p>;
}
```

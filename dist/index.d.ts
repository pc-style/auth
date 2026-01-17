import { A as AuthState, U as User } from './types-BYtvyN1m.js';
export { b as AuthConfig, a as AuthMiddlewareOptions, C as ConvexUser, D as DEFAULT_AUTH_CONFIG } from './types-BYtvyN1m.js';

/**
 * Hook to get current authentication state
 *
 * @example
 * function ProfileButton() {
 *   const { user, isLoading, isAuthenticated } = useAuth();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isAuthenticated) return <LoginButton />;
 *   return <Avatar user={user} />;
 * }
 */
declare function useAuth(): AuthState;
/**
 * Hook to get current user (throws if not authenticated)
 *
 * @example
 * function Dashboard() {
 *   const user = useUser();
 *   return <h1>Welcome, {user.firstName}</h1>;
 * }
 */
declare function useUser(): User;
/**
 * Helper to get sign-out URL
 */
declare function getSignOutUrl(): string;
/**
 * Helper to get sign-in URL with optional return path
 */
declare function getSignInUrl(returnTo?: string): string;

export { AuthState, User, getSignInUrl, getSignOutUrl, useAuth, useUser };

/**
 * User type from WorkOS AuthKit
 */
interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profilePictureUrl: string | null;
    createdAt: string;
    updatedAt: string;
}
/**
 * Session state returned by auth hooks
 */
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
/**
 * Options for auth middleware configuration
 */
interface AuthMiddlewareOptions {
    /**
     * Paths that don't require authentication
     * @default []
     */
    publicPaths?: string[];
    /**
     * Custom redirect URI for OAuth callback
     * @default 'https://auth.pcstyle.dev/callback'
     */
    redirectUri?: string;
    /**
     * Sign-in URL
     * @default 'https://auth.pcstyle.dev'
     */
    signInUrl?: string;
}
/**
 * Convex user record
 */
interface ConvexUser {
    _id: string;
    authId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role: string;
    createdAt: number;
    updatedAt: number;
}
/**
 * Configuration for the auth SDK
 */
interface AuthConfig {
    /**
     * The auth domain
     * @default 'https://auth.pcstyle.dev'
     */
    authDomain?: string;
    /**
     * Cookie domain for cross-subdomain auth
     * @default '.pcstyle.dev'
     */
    cookieDomain?: string;
}
declare const DEFAULT_AUTH_CONFIG: AuthConfig;

export { type AuthState as A, type ConvexUser as C, DEFAULT_AUTH_CONFIG as D, type User as U, type AuthMiddlewareOptions as a, type AuthConfig as b };

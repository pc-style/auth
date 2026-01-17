/**
 * User type from WorkOS AuthKit
 */
export interface User {
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
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

/**
 * Options for auth middleware configuration
 */
export interface AuthMiddlewareOptions {
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
export interface ConvexUser {
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
export interface AuthConfig {
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

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
    authDomain: 'https://auth.pcstyle.dev',
    cookieDomain: '.pcstyle.dev',
};

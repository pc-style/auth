'use client';

import { useAuth as useWorkOSAuth } from '@workos-inc/authkit-nextjs/components';
import type { AuthState } from './types';

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
export function useAuth(): AuthState {
    const { user, loading } = useWorkOSAuth();

    return {
        user: user ?? null,
        isLoading: loading,
        isAuthenticated: !!user,
    };
}

/**
 * Hook to get current user (throws if not authenticated)
 *
 * @example
 * function Dashboard() {
 *   const user = useUser();
 *   return <h1>Welcome, {user.firstName}</h1>;
 * }
 */
export function useUser() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        throw new Error('useUser must be used within an authenticated context');
    }

    return user;
}

/**
 * Helper to get sign-out URL
 */
export function getSignOutUrl(): string {
    return 'https://auth.pcstyle.dev/signout';
}

/**
 * Helper to get sign-in URL with optional return path
 */
export function getSignInUrl(returnTo?: string): string {
    const base = 'https://auth.pcstyle.dev';
    if (!returnTo) return base;

    const state = btoa(JSON.stringify({ returnTo }));
    return `${base}?state=${encodeURIComponent(state)}`;
}

import { useState, useEffect, useCallback } from 'react';

/**
 * User data returned from auth.pcstyle.dev
 */
export interface AuthUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
}

/**
 * Response from /api/me endpoint
 */
interface MeResponse {
    status: 'success' | 'error';
    user?: AuthUser;
    code?: string;
    message?: string;
}

/**
 * Hook state for useUser
 */
interface UseUserState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
}

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.pcstyle.dev';

/**
 * React hook to get the current authenticated user.
 * Fetches from auth.pcstyle.dev/api/me with credentials included.
 * 
 * @example
 * ```tsx
 * const { user, isLoading, error, refresh } = useUser();
 * 
 * if (isLoading) return <Spinner />;
 * if (!user) return <LoginButton />;
 * return <p>Hello, {user.firstName}</p>;
 * ```
 */
export function useUser(): UseUserState & { refresh: () => Promise<void> } {
    const [state, setState] = useState<UseUserState>({
        user: null,
        isLoading: true,
        error: null,
    });

    const fetchUser = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(`${AUTH_URL}/api/me`, {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            });

            const data: MeResponse = await response.json();

            if (data.status === 'success' && data.user) {
                setState({ user: data.user, isLoading: false, error: null });
            } else {
                setState({ user: null, isLoading: false, error: null });
            }
        } catch (err) {
            setState({
                user: null,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch user',
            });
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { ...state, refresh: fetchUser };
}

/**
 * Redirect to auth.pcstyle.dev login page.
 * 
 * @param returnTo - URL to redirect back to after login
 * 
 * @example
 * ```tsx
 * <button onClick={() => login('/dashboard')}>Sign In</button>
 * ```
 */
export function login(returnTo?: string): void {
    const url = new URL(AUTH_URL);
    if (returnTo) {
        url.searchParams.set('returnTo', returnTo);
    }
    window.location.href = url.toString();
}

/**
 * Sign out and clear the session.
 * 
 * @param returnTo - URL to redirect to after logout
 * 
 * @example
 * ```tsx
 * <button onClick={() => logout('/')}>Sign Out</button>
 * ```
 */
export function logout(returnTo?: string): void {
    const url = new URL(`${AUTH_URL}/api/auth/signout`);
    if (returnTo) {
        url.searchParams.set('returnTo', returnTo);
    }
    window.location.href = url.toString();
}

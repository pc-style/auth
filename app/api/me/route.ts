import { withAuth } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';

/**
 * Session verification endpoint for child apps.
 * Returns user data if authenticated, 401 otherwise.
 * 
 * Child apps call this with credentials: 'include' to check session.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const { user } = await withAuth();

        if (!user) {
            return NextResponse.json(
                { status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            status: 'success',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePictureUrl: user.profilePictureUrl,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { status: 'error', code: 'INTERNAL_ERROR', message: 'Session check failed' },
            { status: 500 }
        );
    }
}

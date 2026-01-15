import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
    redirectUri: process.env.WORKOS_REDIRECT_URI,
    middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ['/', '/callback', '/api/me'],
    },
});

export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)'],
};

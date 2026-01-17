import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import type { AuthMiddlewareOptions } from './types';

/**
 * Create pre-configured auth middleware for PCSTYLE services
 *
 * @example
 * // middleware.ts
 * import { createAuthMiddleware } from '@pcstyle/auth/middleware';
 *
 * export default createAuthMiddleware({
 *   publicPaths: ['/api/health', '/public'],
 * });
 *
 * export const config = {
 *   matcher: ['/((?!_next|static|favicon.ico|.*\\..*).*)'],
 * };
 */
export function createAuthMiddleware(options?: AuthMiddlewareOptions) {
    return authkitMiddleware({
        middlewareAuth: {
            enabled: true,
            unauthenticatedPaths: options?.publicPaths ?? [],
        },
    });
}

/**
 * Default middleware export for quick setup
 *
 * @example
 * // middleware.ts
 * export { default } from '@pcstyle/auth/middleware';
 */
export default createAuthMiddleware();

/**
 * Recommended matcher config for Next.js
 */
export const matcherConfig = {
    matcher: ['/((?!_next|static|favicon.ico|.*\\..*).*)'],
};

import * as next_server from 'next/server';
import { a as AuthMiddlewareOptions } from './types-BYtvyN1m.js';

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
declare function createAuthMiddleware(options?: AuthMiddlewareOptions): next_server.NextMiddleware;
/**
 * Default middleware export for quick setup
 *
 * @example
 * // middleware.ts
 * export { default } from '@pcstyle/auth/middleware';
 */
declare const _default: next_server.NextMiddleware;

/**
 * Recommended matcher config for Next.js
 */
declare const matcherConfig: {
    matcher: string[];
};

export { createAuthMiddleware, _default as default, matcherConfig };

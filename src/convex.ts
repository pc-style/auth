/**
 * Create Convex auth config for WorkOS integration
 *
 * @example
 * // convex/auth.config.ts
 * import { createConvexAuthConfig } from '@pcstyle/auth/convex';
 *
 * export default createConvexAuthConfig(process.env.WORKOS_CLIENT_ID);
 */
export function createConvexAuthConfig(clientId: string | undefined) {
    if (!clientId) {
        throw new Error('WORKOS_CLIENT_ID is required for Convex auth config');
    }

    return {
        providers: [
            {
                type: 'customJwt' as const,
                issuer: 'https://api.workos.com/',
                algorithm: 'RS256' as const,
                applicationID: clientId,
                jwks: `https://api.workos.com/sso/jwks/${clientId}`,
            },
            {
                type: 'customJwt' as const,
                issuer: `https://api.workos.com/user_management/${clientId}`,
                algorithm: 'RS256' as const,
                jwks: `https://api.workos.com/sso/jwks/${clientId}`,
                applicationID: clientId,
            },
        ],
    };
}

/**
 * Default export using environment variable
 */
export default createConvexAuthConfig(process.env.WORKOS_CLIENT_ID);

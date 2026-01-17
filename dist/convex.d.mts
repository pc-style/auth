/**
 * Create Convex auth config for WorkOS integration
 *
 * @example
 * // convex/auth.config.ts
 * import { createConvexAuthConfig } from '@pcstyle/auth/convex';
 *
 * export default createConvexAuthConfig(process.env.WORKOS_CLIENT_ID);
 */
declare function createConvexAuthConfig(clientId: string | undefined): {
    providers: {
        type: "customJwt";
        issuer: string;
        algorithm: "RS256";
        applicationID: string;
        jwks: string;
    }[];
};
/**
 * Default export using environment variable
 */
declare const _default: {
    providers: {
        type: "customJwt";
        issuer: string;
        algorithm: "RS256";
        applicationID: string;
        jwks: string;
    }[];
};

export { createConvexAuthConfig, _default as default };

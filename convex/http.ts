import { httpRouter } from 'convex/server';

const http = httpRouter();

/**
 * WorkOS webhooks are handled by the @convex-dev/workos-authkit component
 * which automatically sets up the /workos/webhook endpoint.
 * 
 * This router can be extended for additional HTTP endpoints.
 */

export default http;

import { httpRouter } from "convex/server";
import { authKit, authKitEvent } from "./auth";

const http = httpRouter();

// Register WorkOS webhook routes at /workos/webhook
// We pass the eventHandlers to ensure our custom user sync logic runs
authKit.registerRoutes(http, {
    webhook: {
        eventHandlers: authKitEvent,
    },
});

export default http;

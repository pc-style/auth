// src/middleware.ts
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
function createAuthMiddleware(options) {
  return authkitMiddleware({
    middlewareAuth: {
      enabled: true,
      unauthenticatedPaths: options?.publicPaths ?? []
    }
  });
}
var middleware_default = createAuthMiddleware();
var matcherConfig = {
  matcher: ["/((?!_next|static|favicon.ico|.*\\..*).*)"]
};
export {
  createAuthMiddleware,
  middleware_default as default,
  matcherConfig
};
//# sourceMappingURL=middleware.mjs.map
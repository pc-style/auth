"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware.ts
var middleware_exports = {};
__export(middleware_exports, {
  createAuthMiddleware: () => createAuthMiddleware,
  default: () => middleware_default,
  matcherConfig: () => matcherConfig
});
module.exports = __toCommonJS(middleware_exports);
var import_authkit_nextjs = require("@workos-inc/authkit-nextjs");
function createAuthMiddleware(options) {
  return (0, import_authkit_nextjs.authkitMiddleware)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAuthMiddleware,
  matcherConfig
});
//# sourceMappingURL=middleware.js.map
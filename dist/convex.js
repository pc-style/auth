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

// src/convex.ts
var convex_exports = {};
__export(convex_exports, {
  createConvexAuthConfig: () => createConvexAuthConfig,
  default: () => convex_default
});
module.exports = __toCommonJS(convex_exports);
function createConvexAuthConfig(clientId) {
  if (!clientId) {
    throw new Error("WORKOS_CLIENT_ID is required for Convex auth config");
  }
  return {
    providers: [
      {
        type: "customJwt",
        issuer: "https://api.workos.com/",
        algorithm: "RS256",
        applicationID: clientId,
        jwks: `https://api.workos.com/sso/jwks/${clientId}`
      },
      {
        type: "customJwt",
        issuer: `https://api.workos.com/user_management/${clientId}`,
        algorithm: "RS256",
        jwks: `https://api.workos.com/sso/jwks/${clientId}`,
        applicationID: clientId
      }
    ]
  };
}
var convex_default = createConvexAuthConfig(process.env.WORKOS_CLIENT_ID);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createConvexAuthConfig
});
//# sourceMappingURL=convex.js.map
// src/convex.ts
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
export {
  createConvexAuthConfig,
  convex_default as default
};
//# sourceMappingURL=convex.mjs.map
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DEFAULT_AUTH_CONFIG: () => DEFAULT_AUTH_CONFIG,
  getSignInUrl: () => getSignInUrl,
  getSignOutUrl: () => getSignOutUrl,
  useAuth: () => useAuth,
  useUser: () => useUser
});
module.exports = __toCommonJS(src_exports);

// src/types.ts
var DEFAULT_AUTH_CONFIG = {
  authDomain: "https://auth.pcstyle.dev",
  cookieDomain: ".pcstyle.dev"
};

// src/hooks.ts
var import_components = require("@workos-inc/authkit-nextjs/components");
function useAuth() {
  const { user, loading } = (0, import_components.useAuth)();
  return {
    user: user ?? null,
    isLoading: loading,
    isAuthenticated: !!user
  };
}
function useUser() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    throw new Error("useUser must be used within an authenticated context");
  }
  return user;
}
function getSignOutUrl() {
  return "https://auth.pcstyle.dev/signout";
}
function getSignInUrl(returnTo) {
  const base = "https://auth.pcstyle.dev";
  if (!returnTo) return base;
  const state = btoa(JSON.stringify({ returnTo }));
  return `${base}?state=${encodeURIComponent(state)}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_AUTH_CONFIG,
  getSignInUrl,
  getSignOutUrl,
  useAuth,
  useUser
});
//# sourceMappingURL=index.js.map
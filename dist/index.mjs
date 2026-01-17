// src/types.ts
var DEFAULT_AUTH_CONFIG = {
  authDomain: "https://auth.pcstyle.dev",
  cookieDomain: ".pcstyle.dev"
};

// src/hooks.ts
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-nextjs/components";
function useAuth() {
  const { user, loading } = useWorkOSAuth();
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
export {
  DEFAULT_AUTH_CONFIG,
  getSignInUrl,
  getSignOutUrl,
  useAuth,
  useUser
};
//# sourceMappingURL=index.mjs.map
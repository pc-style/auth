import Link from "next/link";
import { getSignInUrl, getSignUpUrl, withAuth, signOut } from "@workos-inc/authkit-nextjs";
import { LogIn, Mail, LogOut } from "lucide-react";

/**
 * Cybernetic login page for auth.pcstyle.dev
 * Server Component - handles authenticated and unauthenticated states
 * 
 * OAuth provider selection is handled by WorkOS hosted UI.
 */
export default async function LoginPage() {
  const { user } = await withAuth();

  // User is already logged in - show welcome screen
  if (user) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center p-8 relative z-10"
        role="main"
        aria-label="Authenticated"
      >
        <div className="w-full max-w-md text-center">
          <header className="mb-10">
            <h1 className="text-4xl font-bold mb-2 font-mono">
              <span className="text-[#ff00ff]">&lt;</span>
              AUTH
              <span className="text-[#ff00ff]"> /&gt;</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              pcstyle.dev identity protocol
            </p>
          </header>

          <section className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-6">
              {user.profilePictureUrl && (
                <img
                  src={user.profilePictureUrl}
                  alt={`${user.firstName ?? "User"}'s profile`}
                  className="w-20 h-20 rounded-full mx-auto border-2 border-[#ff00ff]"
                />
              )}
              <div>
                <p className="text-white font-mono text-lg">
                  Welcome back{user.firstName ? `, ${user.firstName}` : ""}
                </p>
                <p className="text-gray-400 font-mono text-sm mt-1">
                  {user.email}
                </p>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 hover:border-[#ff00ff] text-white hover:text-[#ff00ff] transition-all duration-300 font-mono text-sm"
                  aria-label="Sign out"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Sign Out
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Get auth URLs for unauthenticated users
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8 relative z-10"
      role="main"
      aria-label="Authentication"
    >
      <div className="w-full max-w-md">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 font-mono">
            <span className="text-[#ff00ff]">&lt;</span>
            AUTH
            <span className="text-[#ff00ff]"> /&gt;</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            pcstyle.dev identity protocol
          </p>
        </header>

        <section
          className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/30 p-8 relative overflow-hidden"
          aria-labelledby="login-heading"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/5 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 id="login-heading" className="sr-only">
              Sign in or create an account
            </h2>

            {/* Sign In Button - redirects to WorkOS hosted UI */}
            <Link
              href={signInUrl}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#ff00ff] text-black hover:bg-[#ff00ff]/80 transition-all duration-300 font-mono text-sm font-bold"
              aria-label="Sign in to your account"
            >
              <Mail size={18} aria-hidden="true" />
              Sign In
            </Link>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-800">
              <p className="text-gray-500 font-mono text-xs mb-2">
                New to pcstyle.dev?
              </p>
              <Link
                href={signUpUrl}
                className="text-[#ff00ff] hover:underline font-mono text-sm inline-flex items-center gap-2"
                aria-label="Create a new account"
              >
                <LogIn size={14} aria-hidden="true" />
                Create an account
              </Link>
            </div>
          </div>
        </section>

        <footer className="text-center mt-8">
          <p className="text-gray-600 font-mono text-xs">
            Secured by{" "}
            <a
              href="https://workos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff00ff] hover:underline"
            >
              WorkOS
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

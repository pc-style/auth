import { redirect } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { DashboardSidebar } from "@/components/dashboard";

/**
 * Dashboard layout with protected access and sidebar navigation
 * Requires authentication - redirects to home if not logged in
 */
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await withAuth();

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar user={user} />
            <main
                id="main-content"
                className="flex-1 p-8"
                role="main"
                aria-label="Dashboard content"
            >
                {children}
            </main>
        </div>
    );
}

import { withAuth } from "@workos-inc/authkit-nextjs";
import { DashboardOverview } from "./DashboardOverview";

/**
 * Dashboard overview page - shows account summary and recent activity
 */
export default async function DashboardPage() {
    const { user } = await withAuth();

    if (!user) {
        return null; // Layout handles redirect
    }

    return <DashboardOverview authId={user.id} user={user} />;
}

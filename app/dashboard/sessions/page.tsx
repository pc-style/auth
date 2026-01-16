import { withAuth } from "@workos-inc/authkit-nextjs";
import { SessionsList } from "./SessionsList";

/**
 * Sessions page - manage active sessions across devices
 */
export default async function SessionsPage() {
    const { user } = await withAuth();

    if (!user) {
        return null;
    }

    return <SessionsList authId={user.id} />;
}

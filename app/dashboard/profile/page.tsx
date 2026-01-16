import { withAuth } from "@workos-inc/authkit-nextjs";
import { ProfileForm } from "./ProfileForm";

/**
 * Profile page - allows users to edit their display name and avatar
 */
export default async function ProfilePage() {
    const { user } = await withAuth();

    if (!user) {
        return null;
    }

    return <ProfileForm authId={user.id} initialUser={user} />;
}

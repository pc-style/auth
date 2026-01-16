"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User, Save, Loader2 } from "lucide-react";

interface ProfileFormProps {
    authId: string;
    initialUser: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        profilePictureUrl?: string | null;
    };
}

/**
 * Profile edit form with real-time sync
 */
export function ProfileForm({ authId, initialUser }: ProfileFormProps) {
    const profile = useQuery(api.users.getProfile, { authId });
    const updateProfile = useMutation(api.users.updateProfile);

    const [name, setName] = useState(profile?.name ?? `${initialUser.firstName ?? ""} ${initialUser.lastName ?? ""}`.trim());
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? initialUser.profilePictureUrl ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            await updateProfile({
                authId,
                name: name || undefined,
                avatarUrl: avatarUrl || undefined,
            });
            setSaveMessage({ type: "success", text: "Profile updated successfully" });
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to update profile",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-mono font-bold text-white mb-2">
                    <span className="text-[#ff00ff]">&lt;</span>
                    Profile
                    <span className="text-[#ff00ff]"> /&gt;</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Manage your account settings
                </p>
            </header>

            {/* Profile Form */}
            <section
                className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6"
                aria-labelledby="profile-heading"
            >
                <h2
                    id="profile-heading"
                    className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2"
                >
                    <User size={18} className="text-[#ff00ff]" aria-hidden="true" />
                    Edit Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full border-2 border-[#ff00ff]/50 object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#ff00ff]/10 border-2 border-[#ff00ff]/50 flex items-center justify-center">
                                <User size={24} className="text-[#ff00ff]" aria-hidden="true" />
                            </div>
                        )}
                        <div className="text-sm font-mono text-gray-400">
                            Update your avatar URL below
                        </div>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block font-mono text-sm text-gray-400 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={initialUser.email ?? ""}
                            disabled
                            className="w-full bg-gray-900/50 border border-gray-700 px-4 py-3 font-mono text-sm text-gray-500 cursor-not-allowed"
                            aria-describedby="email-hint"
                        />
                        <p id="email-hint" className="mt-1 font-mono text-xs text-gray-600">
                            Email is managed by WorkOS and cannot be changed here
                        </p>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block font-mono text-sm text-gray-400 mb-2"
                        >
                            Display Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your display name"
                            className="w-full bg-black/50 border border-gray-700 focus:border-[#ff00ff] px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
                        />
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label
                            htmlFor="avatarUrl"
                            className="block font-mono text-sm text-gray-400 mb-2"
                        >
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full bg-black/50 border border-gray-700 focus:border-[#ff00ff] px-4 py-3 font-mono text-sm text-white placeholder:text-gray-600 outline-none transition-colors"
                        />
                    </div>

                    {/* Save Message */}
                    {saveMessage && (
                        <p
                            className={`font-mono text-sm ${saveMessage.type === "success" ? "text-green-400" : "text-red-400"
                                }`}
                            role={saveMessage.type === "error" ? "alert" : "status"}
                        >
                            {saveMessage.text}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff00ff] text-black font-mono text-sm font-bold hover:bg-[#ff00ff]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} aria-hidden="true" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </section>
        </div>
    );
}

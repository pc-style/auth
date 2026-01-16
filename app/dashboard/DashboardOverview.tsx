"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StatsCard } from "@/components/dashboard";
import { User, Laptop, Clock, Shield } from "lucide-react";
import Link from "next/link";

interface DashboardOverviewProps {
    authId: string;
    user: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        profilePictureUrl?: string | null;
    };
}

/**
 * Client component for dashboard overview with real-time data
 */
export function DashboardOverview({ authId, user }: DashboardOverviewProps) {
    const profile = useQuery(api.users.getProfile, { authId });
    const sessions = useQuery(api.users.getSessions, { userId: authId });

    const recentSessions = sessions?.slice(0, 5) ?? [];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-mono font-bold text-white mb-2">
                    <span className="text-[#ff00ff]">&lt;</span>
                    Dashboard
                    <span className="text-[#ff00ff]"> /&gt;</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Welcome back, {user.firstName ?? "User"}
                </p>
            </header>

            {/* Stats Grid */}
            <section aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="sr-only">
                    Account Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        label="Account Status"
                        value={profile?.role === "banned" ? "Banned" : "Active"}
                        icon={<Shield size={20} />}
                    />
                    <StatsCard
                        label="Active Sessions"
                        value={sessions?.length ?? 0}
                        icon={<Laptop size={20} />}
                    />
                    <StatsCard
                        label="Member Since"
                        value={
                            profile?.createdAt
                                ? new Date(profile.createdAt).toLocaleDateString()
                                : "—"
                        }
                        icon={<Clock size={20} />}
                    />
                </div>
            </section>

            {/* Account Summary */}
            <section
                className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6"
                aria-labelledby="summary-heading"
            >
                <h2
                    id="summary-heading"
                    className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2"
                >
                    <User size={18} className="text-[#ff00ff]" aria-hidden="true" />
                    Account Summary
                </h2>

                <div className="flex items-start gap-6">
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            alt={`${user.firstName}'s profile picture`}
                            className="w-20 h-20 rounded-full border-2 border-[#ff00ff]/50"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-[#ff00ff]/10 border-2 border-[#ff00ff]/50 flex items-center justify-center">
                            <User size={32} className="text-[#ff00ff]" aria-hidden="true" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="font-mono text-white">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="font-mono text-sm text-gray-400">{user.email}</p>
                        <p className="font-mono text-xs text-gray-500">
                            Role:{" "}
                            <span className="text-[#ff00ff]">
                                {profile?.role ?? "user"}
                            </span>
                        </p>
                        <Link
                            href="/dashboard/profile"
                            className="inline-block mt-2 text-[#ff00ff] font-mono text-sm hover:underline"
                        >
                            Edit Profile →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent Sessions */}
            <section
                className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6"
                aria-labelledby="sessions-heading"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2
                        id="sessions-heading"
                        className="text-lg font-mono font-bold text-white flex items-center gap-2"
                    >
                        <Laptop size={18} className="text-[#ff00ff]" aria-hidden="true" />
                        Recent Sessions
                    </h2>
                    <Link
                        href="/dashboard/sessions"
                        className="text-[#ff00ff] font-mono text-sm hover:underline"
                    >
                        View All →
                    </Link>
                </div>

                {recentSessions.length === 0 ? (
                    <p className="text-gray-500 font-mono text-sm">No active sessions</p>
                ) : (
                    <ul className="space-y-3" role="list" aria-label="Recent sessions list">
                        {recentSessions.map((session) => (
                            <li
                                key={session.id}
                                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <Laptop
                                        size={16}
                                        className="text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="font-mono text-sm text-gray-300">
                                        {session.deviceInfo}
                                    </span>
                                </div>
                                <span className="font-mono text-xs text-gray-500">
                                    {new Date(session.lastActive).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Laptop, Trash2, LogOut, Loader2, AlertCircle } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface SessionsListProps {
    authId: string;
}

/**
 * Sessions management component with revoke functionality
 */
export function SessionsList({ authId }: SessionsListProps) {
    const sessions = useQuery(api.users.getSessions, { userId: authId });
    const revokeSession = useMutation(api.users.revokeSession);
    const revokeAllSessions = useMutation(api.users.revokeAllSessions);

    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [isRevokingAll, setIsRevokingAll] = useState(false);
    const [showConfirmAll, setShowConfirmAll] = useState(false);

    const handleRevokeSession = async (sessionId: Id<"sessions">) => {
        setRevokingId(sessionId);
        try {
            await revokeSession({ sessionId, userId: authId });
        } finally {
            setRevokingId(null);
        }
    };

    const handleRevokeAll = async () => {
        setIsRevokingAll(true);
        try {
            await revokeAllSessions({ userId: authId });
            setShowConfirmAll(false);
        } finally {
            setIsRevokingAll(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-mono font-bold text-white mb-2">
                        <span className="text-[#ff00ff]">&lt;</span>
                        Sessions
                        <span className="text-[#ff00ff]"> /&gt;</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">
                        Manage your active sessions across devices
                    </p>
                </div>

                {sessions && sessions.length > 0 && (
                    <button
                        onClick={() => setShowConfirmAll(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono text-sm transition-colors"
                        aria-label="Sign out of all devices"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        Sign Out Everywhere
                    </button>
                )}
            </header>

            {/* Confirm All Dialog */}
            {showConfirmAll && (
                <div
                    className="bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-4"
                    role="alertdialog"
                    aria-labelledby="confirm-all-title"
                    aria-describedby="confirm-all-desc"
                >
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <div className="flex-1">
                        <p id="confirm-all-title" className="font-mono text-sm text-red-400 font-bold">
                            Sign out of all sessions?
                        </p>
                        <p id="confirm-all-desc" className="font-mono text-xs text-red-400/70 mt-1">
                            This will revoke access on all devices including this one. You will need to sign in again.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleRevokeAll}
                                disabled={isRevokingAll}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-mono text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                                {isRevokingAll ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                        Signing out...
                                    </>
                                ) : (
                                    "Yes, sign out everywhere"
                                )}
                            </button>
                            <button
                                onClick={() => setShowConfirmAll(false)}
                                className="px-4 py-2 border border-gray-700 text-gray-400 font-mono text-sm hover:border-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sessions List */}
            <section
                className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6"
                aria-labelledby="sessions-heading"
            >
                <h2
                    id="sessions-heading"
                    className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2"
                >
                    <Laptop size={18} className="text-[#ff00ff]" aria-hidden="true" />
                    Active Sessions ({sessions?.length ?? 0})
                </h2>

                {!sessions ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="text-[#ff00ff] animate-spin" aria-label="Loading sessions" />
                    </div>
                ) : sessions.length === 0 ? (
                    <p className="text-gray-500 font-mono text-sm text-center py-8">
                        No active sessions found
                    </p>
                ) : (
                    <ul className="space-y-4" role="list" aria-label="Active sessions">
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                className="flex items-center justify-between p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#ff00ff]/10 flex items-center justify-center">
                                        <Laptop size={20} className="text-[#ff00ff]" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-mono text-sm text-white">
                                            {session.deviceInfo}
                                        </p>
                                        <p className="font-mono text-xs text-gray-500 mt-1">
                                            {session.ipAddress && `${session.ipAddress} · `}
                                            Last active: {new Date(session.lastActive).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRevokeSession(session.id)}
                                    disabled={revokingId === session.id}
                                    className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-red-500/10 font-mono text-xs transition-colors disabled:opacity-50"
                                    aria-label={`Revoke session on ${session.deviceInfo}`}
                                >
                                    {revokingId === session.id ? (
                                        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Trash2 size={14} aria-hidden="true" />
                                    )}
                                    Revoke
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

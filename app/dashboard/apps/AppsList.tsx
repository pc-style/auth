"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppWindow, ExternalLink, Loader2 } from "lucide-react";

interface AppsListProps {
    authId: string;
}

/**
 * Connected apps list component
 */
export function AppsList({ authId }: AppsListProps) {
    const apps = useQuery(api.users.getConnectedApps, { userId: authId });

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-mono font-bold text-white mb-2">
                    <span className="text-[#ff00ff]">&lt;</span>
                    Connected Apps
                    <span className="text-[#ff00ff]"> /&gt;</span>
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Apps in the pcstyle.dev ecosystem you have access to
                </p>
            </header>

            {/* Apps Grid */}
            <section
                className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6"
                aria-labelledby="apps-heading"
            >
                <h2
                    id="apps-heading"
                    className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2"
                >
                    <AppWindow size={18} className="text-[#ff00ff]" aria-hidden="true" />
                    Ecosystem Apps
                </h2>

                {!apps ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="text-[#ff00ff] animate-spin" aria-label="Loading apps" />
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
                        {apps.map((app) => (
                            <li
                                key={app.id}
                                className="p-4 border border-gray-800 hover:border-[#ff00ff]/30 transition-colors group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-[#ff00ff]/10 flex items-center justify-center shrink-0">
                                        <AppWindow size={24} className="text-[#ff00ff]" aria-hidden="true" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-mono text-sm font-bold text-white group-hover:text-[#ff00ff] transition-colors">
                                            {app.name}
                                        </h3>
                                        <p className="font-mono text-xs text-gray-500 mt-1">
                                            {app.description}
                                        </p>
                                        {app.lastAccess && (
                                            <p className="font-mono text-xs text-gray-600 mt-2">
                                                Last accessed: {new Date(app.lastAccess).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={`https://${app.id}.pcstyle.dev`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 mt-4 text-[#ff00ff] font-mono text-xs hover:underline"
                                >
                                    <ExternalLink size={12} aria-hidden="true" />
                                    Open App
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Info */}
            <div className="text-center py-4">
                <p className="font-mono text-xs text-gray-600">
                    More app integrations coming soon. Your single sign-on works across all pcstyle.dev services.
                </p>
            </div>
        </div>
    );
}

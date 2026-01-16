"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, Laptop, AppWindow, Download, LogOut, ArrowLeft } from "lucide-react";
import { signOut } from "@workos-inc/authkit-nextjs";

interface DashboardSidebarProps {
    user: {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        profilePictureUrl?: string | null;
    };
}

const navItems = [
    { href: "/dashboard", label: "Overview", icon: User },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/sessions", label: "Sessions", icon: Laptop },
    { href: "/dashboard/apps", label: "Connected Apps", icon: AppWindow },
    { href: "/dashboard/data", label: "Export Data", icon: Download },
];

/**
 * Sidebar navigation component for user dashboard
 */
export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <aside
            className="w-64 min-h-screen bg-black/50 backdrop-blur-md border-r border-[#ff00ff]/20 p-6 flex flex-col"
            aria-label="Dashboard navigation"
        >
            {/* Back to Auth */}
            <Link
                href="/"
                className="flex items-center gap-2 text-gray-500 hover:text-[#ff00ff] transition-colors mb-6 font-mono text-sm"
            >
                <ArrowLeft size={14} aria-hidden="true" />
                Back to Auth
            </Link>

            {/* User Info */}
            <div className="mb-8 pb-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    {user.profilePictureUrl ? (
                        <img
                            src={user.profilePictureUrl}
                            alt={`${user.firstName ?? "User"}'s avatar`}
                            className="w-10 h-10 rounded-full border border-[#ff00ff]/50"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#ff00ff]/20 border border-[#ff00ff]/50 flex items-center justify-center">
                            <User size={20} className="text-[#ff00ff]" aria-hidden="true" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-white truncate">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="font-mono text-xs text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1" aria-label="Dashboard menu">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 font-mono text-sm transition-all duration-200 ${isActive
                                            ? "bg-[#ff00ff]/10 text-[#ff00ff] border-l-2 border-[#ff00ff]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Sign Out */}
            <div className="pt-6 border-t border-gray-800">
                <form action={handleSignOut}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 font-mono text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
                        aria-label="Sign out of your account"
                    >
                        <LogOut size={16} aria-hidden="true" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}

import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * User profile and session management functions for dashboard
 */

/**
 * Get the current user's profile
 */
export const getProfile = query({
    args: { authId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
            .unique();

        if (!user) return null;

        return {
            id: user._id,
            authId: user.authId,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            role: user.role ?? "user",
            createdAt: user.createdAt,
        };
    },
});

/**
 * Get user by Convex document ID
 */
export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) return null;

        return {
            id: user._id,
            authId: user.authId,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            role: user.role ?? "user",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
});

/**
 * Update the current user's profile (name, avatar)
 */
export const updateProfile = mutation({
    args: {
        authId: v.string(),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const updates: Record<string, unknown> = { updatedAt: Date.now() };
        if (args.name !== undefined) updates.name = args.name;
        if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

        await ctx.db.patch(user._id, updates);

        // Log the profile update
        await ctx.db.insert("auditLogs", {
            action: "profile.updated",
            userId: user.authId,
            metadata: { changes: Object.keys(updates).filter((k) => k !== "updatedAt") },
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Get all active sessions for a user
 */
export const getSessions = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        return sessions.map((session) => ({
            id: session._id,
            deviceInfo: session.deviceInfo,
            ipAddress: session.ipAddress,
            lastActive: session.lastActive,
            createdAt: session.createdAt,
            isCurrent: false, // Will be determined client-side
        }));
    },
});

/**
 * Create a new session record
 */
export const createSession = mutation({
    args: {
        userId: v.string(),
        deviceInfo: v.string(),
        ipAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const sessionId = await ctx.db.insert("sessions", {
            userId: args.userId,
            deviceInfo: args.deviceInfo,
            ipAddress: args.ipAddress,
            lastActive: now,
            createdAt: now,
        });

        return sessionId;
    },
});

/**
 * Revoke a specific session
 */
export const revokeSession = mutation({
    args: {
        sessionId: v.id("sessions"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.sessionId);

        if (!session || session.userId !== args.userId) {
            throw new Error("Session not found or unauthorized");
        }

        await ctx.db.delete(args.sessionId);

        // Log the session revocation
        await ctx.db.insert("auditLogs", {
            action: "session.revoked",
            userId: args.userId,
            metadata: { deviceInfo: session.deviceInfo },
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Revoke all sessions for a user (sign out everywhere)
 */
export const revokeAllSessions = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        for (const session of sessions) {
            await ctx.db.delete(session._id);
        }

        // Log the mass revocation
        await ctx.db.insert("auditLogs", {
            action: "sessions.revoked_all",
            userId: args.userId,
            metadata: { count: sessions.length },
            timestamp: Date.now(),
        });

        return { success: true, revokedCount: sessions.length };
    },
});

/**
 * Get connected apps for a user (placeholder for future OAuth integrations)
 */
export const getConnectedApps = query({
    args: { userId: v.string() },
    handler: async () => {
        // Currently returns static list of pcstyle.dev ecosystem apps
        // In future, will track actual OAuth grants per user
        return [
            {
                id: "learning-platform",
                name: "NexusLearn",
                description: "AI-powered learning platform",
                iconUrl: "/icons/nexuslearn.svg",
                lastAccess: null,
            },
            {
                id: "portfolio",
                name: "Portfolio",
                description: "Developer portfolio",
                iconUrl: "/icons/portfolio.svg",
                lastAccess: null,
            },
            {
                id: "stock-management",
                name: "Stock Manager",
                description: "Inventory tracking system",
                iconUrl: "/icons/stock.svg",
                lastAccess: null,
            },
        ];
    },
});

/**
 * Export all user data (GDPR compliance)
 */
export const exportUserData = action({
    args: { authId: v.string() },
    handler: async (ctx, args): Promise<{ data: string }> => {
        const user = await ctx.runQuery(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "users:getProfile" as any,
            { authId: args.authId }
        );

        if (!user) {
            throw new Error("User not found");
        }

        const sessions = await ctx.runQuery(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "users:getSessions" as any,
            { userId: args.authId }
        );

        const exportData = {
            exportedAt: new Date().toISOString(),
            profile: user,
            sessions,
            apps: [],
        };

        return { data: JSON.stringify(exportData, null, 2) };
    },
});

/**
 * Delete user account (GDPR compliance)
 */
export const deleteAccount = mutation({
    args: { authId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        // Delete all sessions
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", args.authId))
            .collect();

        for (const session of sessions) {
            await ctx.db.delete(session._id);
        }

        // Log the deletion before removing the user
        await ctx.db.insert("auditLogs", {
            action: "account.deleted",
            userId: args.authId,
            metadata: { email: user.email },
            timestamp: Date.now(),
        });

        // Delete the user
        await ctx.db.delete(user._id);

        return { success: true };
    },
});

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Admin-only functions for user management and audit logging
 */

/**
 * Get dashboard statistics for admin panel
 */
export const getStats = query({
    args: { adminAuthId: v.string() },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        // Count total users
        const allUsers = await ctx.db.query("users").collect();
        const totalUsers = allUsers.length;

        // Count active sessions (active in last 24 hours)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const allSessions = await ctx.db.query("sessions").collect();
        const activeSessions = allSessions.filter(
            (s) => s.lastActive > oneDayAgo
        ).length;

        // Count new signups this week
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const newUsersThisWeek = allUsers.filter(
            (u) => u.createdAt > oneWeekAgo
        ).length;

        // Count total admins
        const adminCount = allUsers.filter((u) => u.role === "admin").length;

        return {
            totalUsers,
            activeSessions,
            newUsersThisWeek,
            adminCount,
        };
    },
});

/**
 * List users with pagination and filtering
 */
export const listUsers = query({
    args: {
        adminAuthId: v.string(),
        search: v.optional(v.string()),
        role: v.optional(v.string()),
        cursor: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const limit = args.limit ?? 50;
        let users = await ctx.db.query("users").collect();

        // Apply search filter
        if (args.search) {
            const searchLower = args.search.toLowerCase();
            users = users.filter(
                (u) =>
                    u.email.toLowerCase().includes(searchLower) ||
                    (u.name && u.name.toLowerCase().includes(searchLower))
            );
        }

        // Apply role filter
        if (args.role) {
            users = users.filter((u) => u.role === args.role);
        }

        // Sort by creation date (newest first)
        users.sort((a, b) => b.createdAt - a.createdAt);

        // Apply pagination
        const startIndex = args.cursor ? parseInt(args.cursor, 10) : 0;
        const paginatedUsers = users.slice(startIndex, startIndex + limit);

        const nextCursor =
            startIndex + limit < users.length
                ? String(startIndex + limit)
                : undefined;

        return {
            users: paginatedUsers.map((u) => ({
                id: u._id,
                authId: u.authId,
                email: u.email,
                name: u.name,
                avatarUrl: u.avatarUrl,
                role: u.role ?? "user",
                createdAt: u.createdAt,
            })),
            nextCursor,
            totalCount: users.length,
        };
    },
});

/**
 * Get detailed user information for admin view
 */
export const getUserDetail = query({
    args: {
        adminAuthId: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Get user's sessions
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user.authId))
            .collect();

        // Get user's audit logs
        const auditLogs = await ctx.db
            .query("auditLogs")
            .withIndex("by_user", (q) => q.eq("userId", user.authId))
            .order("desc")
            .take(50);

        return {
            user: {
                id: user._id,
                authId: user.authId,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role ?? "user",
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            sessions: sessions.map((s) => ({
                id: s._id,
                deviceInfo: s.deviceInfo,
                ipAddress: s.ipAddress,
                lastActive: s.lastActive,
                createdAt: s.createdAt,
            })),
            auditLogs: auditLogs.map((log) => ({
                id: log._id,
                action: log.action,
                metadata: log.metadata,
                timestamp: log.timestamp,
            })),
        };
    },
});

/**
 * Update user role (admin only)
 */
export const updateUserRole = mutation({
    args: {
        adminAuthId: v.string(),
        userId: v.id("users"),
        newRole: v.string(),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Prevent self-demotion
        if (user.authId === args.adminAuthId && args.newRole !== "admin") {
            throw new Error("Cannot remove your own admin role");
        }

        const oldRole = user.role ?? "user";
        await ctx.db.patch(args.userId, {
            role: args.newRole,
            updatedAt: Date.now(),
        });

        // Log the role change
        await ctx.db.insert("auditLogs", {
            action: "user.role_changed",
            userId: user.authId,
            adminId: args.adminAuthId,
            metadata: { oldRole, newRole: args.newRole },
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Ban a user (sets role to "banned")
 */
export const banUser = mutation({
    args: {
        adminAuthId: v.string(),
        userId: v.id("users"),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Prevent self-ban
        if (user.authId === args.adminAuthId) {
            throw new Error("Cannot ban yourself");
        }

        // Cannot ban other admins
        if (user.role === "admin") {
            throw new Error("Cannot ban another admin");
        }

        await ctx.db.patch(args.userId, {
            role: "banned",
            updatedAt: Date.now(),
        });

        // Revoke all sessions
        const sessions = await ctx.db
            .query("sessions")
            .withIndex("by_user", (q) => q.eq("userId", user.authId))
            .collect();

        for (const session of sessions) {
            await ctx.db.delete(session._id);
        }

        // Log the ban
        await ctx.db.insert("auditLogs", {
            action: "user.banned",
            userId: user.authId,
            adminId: args.adminAuthId,
            metadata: { reason: args.reason, sessionsRevoked: sessions.length },
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Unban a user (sets role back to "user")
 */
export const unbanUser = mutation({
    args: {
        adminAuthId: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.role !== "banned") {
            throw new Error("User is not banned");
        }

        await ctx.db.patch(args.userId, {
            role: "user",
            updatedAt: Date.now(),
        });

        // Log the unban
        await ctx.db.insert("auditLogs", {
            action: "user.unbanned",
            userId: user.authId,
            adminId: args.adminAuthId,
            timestamp: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Get audit logs with filtering
 */
export const getAuditLogs = query({
    args: {
        adminAuthId: v.string(),
        action: v.optional(v.string()),
        userId: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Verify admin role
        const admin = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.adminAuthId))
            .unique();

        if (!admin || admin.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const limit = args.limit ?? 100;

        let logs = await ctx.db
            .query("auditLogs")
            .withIndex("by_time")
            .order("desc")
            .take(500);

        // Apply filters
        if (args.action) {
            logs = logs.filter((log) => log.action === args.action);
        }

        if (args.userId) {
            logs = logs.filter((log) => log.userId === args.userId);
        }

        return logs.slice(0, limit).map((log) => ({
            id: log._id,
            action: log.action,
            userId: log.userId,
            adminId: log.adminId,
            metadata: log.metadata,
            timestamp: log.timestamp,
        }));
    },
});

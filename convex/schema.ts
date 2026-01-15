import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Convex schema for auth.pcstyle.dev
 * Central user database synced via WorkOS webhooks
 */
export default defineSchema({
    users: defineTable({
        authId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
        role: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_authId', ['authId'])
        .index('by_email', ['email']),

    // Phase 2: Audit logs
    auditLogs: defineTable({
        action: v.string(),
        userId: v.optional(v.string()),
        adminId: v.optional(v.string()),
        metadata: v.optional(v.any()),
        timestamp: v.number(),
    })
        .index('by_user', ['userId'])
        .index('by_time', ['timestamp']),

    // Phase 2: Active sessions
    sessions: defineTable({
        userId: v.string(),
        deviceInfo: v.string(),
        ipAddress: v.optional(v.string()),
        lastActive: v.number(),
        createdAt: v.number(),
    }).index('by_user', ['userId']),
});

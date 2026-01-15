import { internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';

/**
 * Internal auth functions for WorkOS AuthKit component
 * These are called by the AuthKit component during webhook processing
 */

export const getAuthAccount = internalQuery({
    args: { authId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('users')
            .withIndex('by_authId', (q) => q.eq('authId', args.authId))
            .unique();
    },
});

export const createAuthAccount = internalMutation({
    args: {
        authId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert('users', {
            authId: args.authId,
            email: args.email,
            name: args.name,
            avatarUrl: args.avatarUrl,
            role: 'user',
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const updateAuthAccount = internalMutation({
    args: {
        authId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_authId', (q) => q.eq('authId', args.authId))
            .unique();

        if (!user) {
            return null;
        }

        const updates: Record<string, unknown> = { updatedAt: Date.now() };
        if (args.email !== undefined) updates.email = args.email;
        if (args.name !== undefined) updates.name = args.name;
        if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

        await ctx.db.patch(user._id, updates);
        return user._id;
    },
});

export const deleteAuthAccount = internalMutation({
    args: { authId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_authId', (q) => q.eq('authId', args.authId))
            .unique();

        if (user) {
            await ctx.db.delete(user._id);
        }
    },
});

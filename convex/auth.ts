import { AuthKit, type AuthFunctions } from "@convex-dev/workos-authkit";
import { internalMutation, internalQuery } from "./_generated/server";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { v } from "convex/values";

/**
 * Internal auth functions for WorkOS AuthKit component
 * These are called by the AuthKit component during webhook processing
 * to sync its internal tables.
 */
export const getAuthAccount = internalQuery({
    args: { authId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
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
        return await ctx.db.insert("users", {
            authId: args.authId,
            email: args.email,
            name: args.name,
            avatarUrl: args.avatarUrl,
            role: "user",
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
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
            .unique();

        if (!user) return null;

        const updates: Record<string, any> = { updatedAt: Date.now() };
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
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", args.authId))
            .unique();

        if (user) {
            await ctx.db.delete(user._id);
        }
    },
});

const authFunctions: AuthFunctions = internal.auth;

/**
 * WorkOS AuthKit client for auth.pcstyle.dev
 */
export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
    authFunctions,
});

/**
 * Export event handlers for WorkOS webhooks
 * This ensures that when WorkOS sends a webhook, our application's `users` table
 * is kept in sync with the AuthKit component's data.
 */
export const { authKitEvent } = authKit.events({
    "user.created": async (ctx, event) => {
        await ctx.db.insert("users", {
            authId: event.data.id,
            email: event.data.email,
            name: `${event.data.firstName ?? ""} ${event.data.lastName ?? ""}`.trim() || undefined,
            avatarUrl: event.data.profilePictureUrl ?? undefined,
            role: "user",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
    "user.updated": async (ctx, event) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", event.data.id))
            .unique();
        if (user) {
            await ctx.db.patch(user._id, {
                email: event.data.email,
                name: `${event.data.firstName ?? ""} ${event.data.lastName ?? ""}`.trim() || undefined,
                avatarUrl: event.data.profilePictureUrl ?? undefined,
                updatedAt: Date.now(),
            });
        }
    },
    "user.deleted": async (ctx, event) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authId", (q) => q.eq("authId", event.data.id))
            .unique();
        if (user) {
            await ctx.db.delete(user._id);
        }
    },
});

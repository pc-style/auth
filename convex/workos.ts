import { AuthKit, type AuthFunctions } from '@convex-dev/workos-authkit';
import { components, internal } from './_generated/api';
import type { DataModel } from './_generated/dataModel';

/**
 * WorkOS AuthKit component configuration
 * Handles user lifecycle events from WorkOS webhooks
 */

const authFunctions: AuthFunctions = internal.auth;

const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
    authFunctions,
});

/**
 * Export event handlers for WorkOS webhooks
 * Endpoint: https://<deployment>.convex.site/workos/webhook
 */
export const { authKitEvent } = authKit.events({
    'user.created': async (ctx, event) => {
        await ctx.db.insert('users', {
            authId: event.data.id,
            email: event.data.email,
            name: `${event.data.firstName ?? ''} ${event.data.lastName ?? ''}`.trim() || undefined,
            avatarUrl: event.data.profilePictureUrl ?? undefined,
            role: 'user',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },

    'user.updated': async (ctx, event) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_authId', (q) => q.eq('authId', event.data.id))
            .unique();

        if (!user) {
            console.warn(`User not found for update: ${event.data.id}`);
            return;
        }

        await ctx.db.patch(user._id, {
            email: event.data.email,
            name: `${event.data.firstName ?? ''} ${event.data.lastName ?? ''}`.trim() || undefined,
            avatarUrl: event.data.profilePictureUrl ?? undefined,
            updatedAt: Date.now(),
        });
    },

    'user.deleted': async (ctx, event) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_authId', (q) => q.eq('authId', event.data.id))
            .unique();

        if (!user) {
            console.warn(`User not found for deletion: ${event.data.id}`);
            return;
        }

        await ctx.db.delete(user._id);
    },
});

import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    accountName: v.string(),
    accountType: v.string(),
    balance: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    return await ctx.db.insert('accounts', {
      userId,
      accountName: args.accountName,
      accountType: args.accountType,
      balance: args.balance,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('accounts'),
    accountName: v.string(),
    accountType: v.string(),
    balance: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const account = await ctx.db.get(args.id);
    if (!account || account.userId !== userId) throw new Error('Account not found');

    await ctx.db.patch(args.id, {
      accountName: args.accountName,
      accountType: args.accountType,
      balance: args.balance,
    });
  },
});

export const remove = mutation({
  args: { id: v.id('accounts') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const account = await ctx.db.get(args.id);
    if (!account || account.userId !== userId) throw new Error('Account not found');

    await ctx.db.delete(args.id);
  },
});

import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const isActiveBudget = (endDate: string, now: number) => new Date(endDate).getTime() >= now;

export const add = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    if (args.amount <= 0) throw new Error('Amount must be greater than 0');

    const now = Date.now();

    const allBudgets = await ctx.db
      .query('budgets')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const activeCategoryBudget = allBudgets
      .filter((b) => b.category === args.category && b.amount > 0 && isActiveBudget(b.endDate, now))
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!activeCategoryBudget) {
      throw new Error(`No active budget found for category "${args.category}". Set a budget first.`);
    }

    if (activeCategoryBudget.amount < args.amount) {
      throw new Error('Expense exceeds remaining budget for this category');
    }

    await ctx.db.patch(activeCategoryBudget._id, {
      amount: activeCategoryBudget.amount - args.amount,
    });

    return await ctx.db.insert('expenses', {
      userId,
      category: args.category,
      amount: args.amount,
      budgetId: activeCategoryBudget._id,
      note: args.note,
      createdAt: now,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query('expenses')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
  },
});

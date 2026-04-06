import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const getTime = (isoDate: string) => new Date(isoDate).getTime();

const isActiveBudget = (endDate: string, now: number) => getTime(endDate) >= now;

export const currentSetting = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const budgets = await ctx.db
      .query('budgets')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const now = Date.now();
    const activeBudgets = budgets.filter((budget) => budget.amount > 0 && isActiveBudget(budget.endDate, now));

    const latestActiveBudget = activeBudgets.sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!latestActiveBudget) return null;

    const sameCycleBudgets = activeBudgets.filter(
      (budget) =>
        budget.period === latestActiveBudget.period &&
        budget.startDate === latestActiveBudget.startDate &&
        budget.endDate === latestActiveBudget.endDate,
    );

    const totalAmount = sameCycleBudgets.reduce((sum, budget) => sum + budget.amount, 0);

    return {
      amount: totalAmount,
      period: latestActiveBudget.period,
      category: latestActiveBudget.category,
      startDate: latestActiveBudget.startDate,
      endDate: latestActiveBudget.endDate,
      items: sameCycleBudgets
        .sort((a, b) => a.category.localeCompare(b.category))
        .map((budget) => ({
          id: budget._id,
          category: budget.category,
          amount: budget.amount,
        })),
    };
  },
});

export const addAndDeduct = mutation({
  args: {
    period: v.union(v.literal('Weekly'), v.literal('Monthly')),
    category: v.string(),
    amount: v.number(),
    accountId: v.id('accounts'),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    if (args.amount <= 0) throw new Error('Budget amount must be greater than 0');

    const allBudgets = await ctx.db
      .query('budgets')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const now = Date.now();
    const activeBudgets = allBudgets.filter((budget) => budget.amount > 0 && isActiveBudget(budget.endDate, now));

    const latestActiveBudget = activeBudgets.sort((a, b) => b.createdAt - a.createdAt)[0];

    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== userId) throw new Error('Account not found');
    if (account.balance < args.amount) throw new Error('Insufficient balance in selected account');

    if (latestActiveBudget && latestActiveBudget.period !== args.period) {
      throw new Error(
        `You already set a ${latestActiveBudget.period} budget. You can change it after ${latestActiveBudget.endDate}.`,
      );
    }

    const cycleStartDate = latestActiveBudget ? latestActiveBudget.startDate : args.startDate;
    const cycleEndDate = latestActiveBudget ? latestActiveBudget.endDate : args.endDate;

    if (!latestActiveBudget && getTime(cycleEndDate) < getTime(cycleStartDate)) {
      throw new Error('Invalid budget date range.');
    }

    await ctx.db.patch(account._id, {
      balance: account.balance - args.amount,
    });

    return await ctx.db.insert('budgets', {
      userId,
      period: args.period,
      category: args.category,
      amount: args.amount,
      accountId: args.accountId,
      startDate: cycleStartDate,
      endDate: cycleEndDate,
      createdAt: Date.now(),
    });
  },
});

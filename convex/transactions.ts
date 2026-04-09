import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from './_generated/server';

const buildItems = (
  expenses: Array<{ _id: any; _creationTime: number; category: string; amount: number }>,
  accounts: Array<{ _id: any; _creationTime: number; accountName: string; balance: number }>,
) => {
  const expenseItems = expenses.map((e) => ({
    id: e._id as string,
    type: 'expense' as const,
    title: e.category,
    amount: e.amount,
    createdAt: e._creationTime,
  }));

  const depositItems = accounts.map((a) => ({
    id: a._id as string,
    type: 'deposit' as const,
    title: a.accountName,
    amount: a.balance,
    createdAt: a._creationTime,
  }));

  return [...expenseItems, ...depositItems].sort((a, b) => b.createdAt - a.createdAt);
};

export const recent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const [expenses, accounts] = await Promise.all([
      ctx.db
        .query('expenses')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .order('desc')
        .take(3),
      ctx.db
        .query('accounts')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .order('desc')
        .take(3),
    ]);

    return buildItems(expenses, accounts).slice(0, 3);
  },
});

export const all = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const [expenses, accounts] = await Promise.all([
      ctx.db
        .query('expenses')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .order('desc')
        .collect(),
      ctx.db
        .query('accounts')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .order('desc')
        .collect(),
    ]);

    return buildItems(expenses, accounts);
  },
});

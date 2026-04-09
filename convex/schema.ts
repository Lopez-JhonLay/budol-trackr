// convex/schema.ts
import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  accounts: defineTable({
    userId: v.id('users'),
    accountName: v.string(),
    accountType: v.string(),
    balance: v.number(),
  }).index('by_user', ['userId']),
  budgets: defineTable({
    userId: v.id('users'),
    period: v.union(v.literal('Weekly'), v.literal('Monthly')),
    category: v.string(),
    amount: v.number(),
    accountId: v.id('accounts'),
    startDate: v.string(),
    endDate: v.string(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_period', ['userId', 'period']),
  expenses: defineTable({
    userId: v.id('users'),
    category: v.string(),
    amount: v.number(),
    budgetId: v.id('budgets'),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_category', ['userId', 'category']),
});

export default schema;

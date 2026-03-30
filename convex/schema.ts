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
});

export default schema;

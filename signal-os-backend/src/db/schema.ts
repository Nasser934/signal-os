import { pgTable, serial, varchar, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  plan: varchar('plan', { length: 20 }).notNull().default('free'),
  nangoConnectionId: varchar('nango_connection_id', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const scores = pgTable('scores', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  overallScore: integer('overall_score').notNull(),
  dimensions: jsonb('dimensions').notNull().default({}),
  feedback: jsonb('feedback').notNull().default([]),
  estimatedEngagement: varchar('estimated_engagement', { length: 20 }),
  processingTime: varchar('processing_time', { length: 20 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const drafts = pgTable('drafts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  scoreId: integer('score_id').references(() => scores.id),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const publishedPosts = pgTable('published_posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  draftId: integer('draft_id').references(() => drafts.id),
  xPostId: varchar('x_post_id', { length: 50 }),
  content: text('content').notNull(),
  scoreAtPublish: integer('score_at_publish'),
  likeCount: integer('like_count').default(0),
  retweetCount: integer('retweet_count').default(0),
  replyCount: integer('reply_count').default(0),
  impressionCount: integer('impression_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Score = typeof scores.$inferSelect;
export type Draft = typeof drafts.$inferSelect;
export type PublishedPost = typeof publishedPosts.$inferSelect;

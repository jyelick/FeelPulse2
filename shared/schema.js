// Database schema for FeelPulse app
const { pgTable, serial, varchar, text, timestamp, boolean, integer, json, real } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  hasDiagnosis: boolean('has_diagnosis').default(false),
  diagnosisType: varchar('diagnosis_type', { length: 50 }),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  darkMode: boolean('dark_mode').default(false)
});

// HRV data table
const hrvData = pgTable('hrv_data', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  value: real('value').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  sourceName: varchar('source_name', { length: 100 }).default('Manual'),
  metadata: json('metadata')
});

// Mood entries table
const moodEntries = pgTable('mood_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  mood: varchar('mood', { length: 20 }).notNull(),
  notes: text('notes'),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// Define relations
const usersRelations = relations(users, ({ many }) => ({
  hrvData: many(hrvData),
  moodEntries: many(moodEntries)
}));

const hrvDataRelations = relations(hrvData, ({ one }) => ({
  user: one(users, {
    fields: [hrvData.userId],
    references: [users.id]
  })
}));

const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id]
  })
}));

module.exports = {
  users,
  hrvData,
  moodEntries,
  usersRelations,
  hrvDataRelations,
  moodEntriesRelations
};
// drizzle/schema.js
const { sqliteTable, text, integer, serial } = require('drizzle-orm/sqlite-core');
const { sql } = require('drizzle-orm');

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('livreur'), // 'admin' ou 'livreur'
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

const deliveries = sqliteTable('deliveries', {
  id: text('id').primaryKey(),
  customerName: text('customer_name'),
  address: text('address').notNull(),
  status: text('status').default('pending'), // pending, in-process, delivered
  assignedTo: text('assigned_to').references(() => users.id),
  createdAt: text('created_at').notNull().default(sql`(current_timestamp)`),
});

module.exports = { users, deliveries };

import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

// Cars table
export const cars = sqliteTable('cars', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  model: text('model').notNull(),
  brand: text('brand').notNull(),
  year: integer('year'),
  pricePerDay: real('price_per_day').notNull(),
  imageUrl: text('image_url'),
  available: integer('available', { mode: 'boolean' }).default(true),
  category: text('category'),
  createdAt: text('created_at').notNull(),
});

// Rentals table
export const rentals = sqliteTable('rentals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerId: integer('customer_id').references(() => customers.id),
  carId: integer('car_id').references(() => cars.id),
  rentalDate: text('rental_date').notNull(),
  returnDate: text('return_date'),
  expectedReturnDate: text('expected_return_date').notNull(),
  totalPrice: real('total_price'),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
});
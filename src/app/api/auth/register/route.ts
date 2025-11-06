import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: 'Name, email, and password are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT',
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: 'Password must be at least 6 characters',
          code: 'PASSWORD_TOO_SHORT',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email.toLowerCase()))
      .limit(1);

    if (existingCustomer.length > 0) {
      return NextResponse.json(
        {
          error: 'Email already exists',
          code: 'EMAIL_ALREADY_EXISTS',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer
    const newCustomer = await db
      .insert(customers)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = newCustomer[0];

    return NextResponse.json(customerWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);

    // Handle unique constraint error (in case of race condition)
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        {
          error: 'Email already exists',
          code: 'EMAIL_ALREADY_EXISTS',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error: ' + error.message,
      },
      { status: 500 }
    );
  }
}
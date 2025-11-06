import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Start building the query - select specific fields excluding password
    let query = db.select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      isAdmin: customers.isAdmin,
      createdAt: customers.createdAt
    }).from(customers);

    // Apply search filter if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(customers.name, searchTerm),
          like(customers.email, searchTerm)
        )
      );
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET customers error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}
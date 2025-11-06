import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentals, cars } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerIdParam = searchParams.get('customerId');
    const statusParam = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    let query = db.select().from(rentals);

    const conditions = [];

    if (customerIdParam) {
      const customerId = parseInt(customerIdParam);
      if (isNaN(customerId)) {
        return NextResponse.json(
          { error: 'Invalid customerId parameter', code: 'INVALID_CUSTOMER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(rentals.customerId, customerId));
    }

    if (statusParam) {
      conditions.push(eq(rentals.status, statusParam));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, carId, rentalDate, expectedReturnDate } = body;

    // Validate required fields
    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId is required', code: 'MISSING_CUSTOMER_ID' },
        { status: 400 }
      );
    }

    if (!carId) {
      return NextResponse.json(
        { error: 'carId is required', code: 'MISSING_CAR_ID' },
        { status: 400 }
      );
    }

    if (!rentalDate) {
      return NextResponse.json(
        { error: 'rentalDate is required', code: 'MISSING_RENTAL_DATE' },
        { status: 400 }
      );
    }

    if (!expectedReturnDate) {
      return NextResponse.json(
        { error: 'expectedReturnDate is required', code: 'MISSING_EXPECTED_RETURN_DATE' },
        { status: 400 }
      );
    }

    // Validate date formats
    const rentalDateObj = new Date(rentalDate);
    const expectedReturnDateObj = new Date(expectedReturnDate);

    if (isNaN(rentalDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid rentalDate format', code: 'INVALID_RENTAL_DATE' },
        { status: 400 }
      );
    }

    if (isNaN(expectedReturnDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid expectedReturnDate format', code: 'INVALID_EXPECTED_RETURN_DATE' },
        { status: 400 }
      );
    }

    // Validate expectedReturnDate is after rentalDate
    if (expectedReturnDateObj <= rentalDateObj) {
      return NextResponse.json(
        { error: 'expectedReturnDate must be after rentalDate', code: 'INVALID_DATE_RANGE' },
        { status: 400 }
      );
    }

    // Check if car exists and is available
    const carResult = await db.select().from(cars).where(eq(cars.id, carId)).limit(1);

    if (carResult.length === 0) {
      return NextResponse.json(
        { error: 'Car not found', code: 'CAR_NOT_FOUND' },
        { status: 404 }
      );
    }

    const car = carResult[0];

    if (!car.available) {
      return NextResponse.json(
        { error: 'Car is not available', code: 'CAR_NOT_AVAILABLE' },
        { status: 400 }
      );
    }

    // Calculate total price
    const days = Math.ceil(
      (expectedReturnDateObj.getTime() - rentalDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * car.pricePerDay;

    // Create rental
    const newRental = await db.insert(rentals).values({
      customerId,
      carId,
      rentalDate,
      expectedReturnDate,
      returnDate: null,
      totalPrice,
      status: 'active',
      createdAt: new Date().toISOString(),
    }).returning();

    // Update car availability
    await db.update(cars).set({ available: false }).where(eq(cars.id, carId));

    return NextResponse.json(newRental[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
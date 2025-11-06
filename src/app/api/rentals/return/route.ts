import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentals, cars } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid rental ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const rentalId = parseInt(id);

    // Query rental by ID
    const rentalResult = await db
      .select()
      .from(rentals)
      .where(eq(rentals.id, rentalId))
      .limit(1);

    // Check if rental exists
    if (rentalResult.length === 0) {
      return NextResponse.json(
        { 
          error: 'Rental not found',
          code: 'RENTAL_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    const rental = rentalResult[0];

    // Validate rental status
    if (rental.status === 'completed' || rental.status === 'cancelled') {
      return NextResponse.json(
        { 
          error: `Rental is already ${rental.status}`,
          code: 'INVALID_RENTAL_STATUS' 
        },
        { status: 400 }
      );
    }

    const currentDate = new Date().toISOString();

    // Update rental with return date and completed status
    const updatedRental = await db
      .update(rentals)
      .set({
        returnDate: currentDate,
        status: 'completed'
      })
      .where(eq(rentals.id, rentalId))
      .returning();

    // Update car availability back to true
    await db
      .update(cars)
      .set({ available: true })
      .where(eq(cars.id, rental.carId));

    return NextResponse.json(updatedRental[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
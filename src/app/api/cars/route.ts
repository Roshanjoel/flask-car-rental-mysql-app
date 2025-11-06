import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cars } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single car by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const car = await db
        .select()
        .from(cars)
        .where(eq(cars.id, parseInt(id)))
        .limit(1);

      if (car.length === 0) {
        return NextResponse.json(
          { error: 'Car not found', code: 'CAR_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(car[0], { status: 200 });
    }

    // List cars with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const availableParam = searchParams.get('available');
    const category = searchParams.get('category');

    let query = db.select().from(cars);
    const conditions = [];

    // Filter by available status
    if (availableParam !== null) {
      const available = availableParam === 'true';
      conditions.push(eq(cars.available, available));
    }

    // Filter by category
    if (category) {
      conditions.push(eq(cars.category, category));
    }

    // Search in model and brand
    if (search) {
      conditions.push(
        or(
          like(cars.model, `%${search}%`),
          like(cars.brand, `%${search}%`)
        )
      );
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(cars.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, brand, year, pricePerDay, imageUrl, category, available } = body;

    // Validate required fields
    if (!model || !model.trim()) {
      return NextResponse.json(
        { error: 'Model is required', code: 'MISSING_MODEL' },
        { status: 400 }
      );
    }

    if (!brand || !brand.trim()) {
      return NextResponse.json(
        { error: 'Brand is required', code: 'MISSING_BRAND' },
        { status: 400 }
      );
    }

    if (pricePerDay === undefined || pricePerDay === null) {
      return NextResponse.json(
        { error: 'Price per day is required', code: 'MISSING_PRICE_PER_DAY' },
        { status: 400 }
      );
    }

    // Validate pricePerDay is a positive number
    if (isNaN(parseFloat(pricePerDay)) || parseFloat(pricePerDay) <= 0) {
      return NextResponse.json(
        { error: 'Price per day must be a positive number', code: 'INVALID_PRICE_PER_DAY' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData = {
      model: model.trim(),
      brand: brand.trim(),
      year: year ? parseInt(year) : null,
      pricePerDay: parseFloat(pricePerDay),
      imageUrl: imageUrl?.trim() || null,
      category: category?.trim() || null,
      available: available !== undefined ? available : true,
      createdAt: new Date().toISOString(),
    };

    const newCar = await db.insert(cars).values(insertData).returning();

    return NextResponse.json(newCar[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if car exists
    const existingCar = await db
      .select()
      .from(cars)
      .where(eq(cars.id, parseInt(id)))
      .limit(1);

    if (existingCar.length === 0) {
      return NextResponse.json(
        { error: 'Car not found', code: 'CAR_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { model, brand, year, pricePerDay, imageUrl, category, available } = body;

    // Validate pricePerDay if provided
    if (pricePerDay !== undefined && pricePerDay !== null) {
      if (isNaN(parseFloat(pricePerDay)) || parseFloat(pricePerDay) <= 0) {
        return NextResponse.json(
          { error: 'Price per day must be a positive number', code: 'INVALID_PRICE_PER_DAY' },
          { status: 400 }
        );
      }
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};

    if (model !== undefined) updateData.model = model.trim();
    if (brand !== undefined) updateData.brand = brand.trim();
    if (year !== undefined) updateData.year = year ? parseInt(year) : null;
    if (pricePerDay !== undefined) updateData.pricePerDay = parseFloat(pricePerDay);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
    if (category !== undefined) updateData.category = category?.trim() || null;
    if (available !== undefined) updateData.available = available;

    const updatedCar = await db
      .update(cars)
      .set(updateData)
      .where(eq(cars.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedCar[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if car exists
    const existingCar = await db
      .select()
      .from(cars)
      .where(eq(cars.id, parseInt(id)))
      .limit(1);

    if (existingCar.length === 0) {
      return NextResponse.json(
        { error: 'Car not found', code: 'CAR_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedCar = await db
      .delete(cars)
      .where(eq(cars.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Car deleted successfully',
        car: deletedCar[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
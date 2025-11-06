import { db } from '@/db';
import { rentals, cars } from '@/db/schema';
import { inArray } from 'drizzle-orm';

async function main() {
    const sampleRentals = [
        {
            customerId: 2,
            carId: 1,
            rentalDate: '2024-01-15',
            returnDate: null,
            expectedReturnDate: '2024-01-20',
            totalPrice: 225.00,
            status: 'active',
            createdAt: new Date().toISOString(),
        },
        {
            customerId: 3,
            carId: 3,
            rentalDate: '2024-01-16',
            returnDate: null,
            expectedReturnDate: '2024-01-23',
            totalPrice: 595.00,
            status: 'active',
            createdAt: new Date().toISOString(),
        },
        {
            customerId: 4,
            carId: 6,
            rentalDate: '2024-01-17',
            returnDate: null,
            expectedReturnDate: '2024-01-20',
            totalPrice: 330.00,
            status: 'active',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(rentals).values(sampleRentals);
    
    await db.update(cars).set({ available: false }).where(inArray(cars.id, [1, 3, 6]));
    
    console.log('✅ Rentals seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
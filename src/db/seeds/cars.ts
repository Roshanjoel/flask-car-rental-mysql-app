import { db } from '@/db';
import { cars } from '@/db/schema';

async function main() {
    const sampleCars = [
        {
            model: 'Camry',
            brand: 'Toyota',
            year: 2023,
            pricePerDay: 45.00,
            category: 'Sedan',
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'CR-V',
            brand: 'Honda',
            year: 2024,
            pricePerDay: 55.00,
            category: 'SUV',
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'Model 3',
            brand: 'Tesla',
            year: 2023,
            pricePerDay: 85.00,
            category: 'Electric',
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'X5',
            brand: 'BMW',
            year: 2024,
            pricePerDay: 95.00,
            category: 'SUV',
            imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'C-Class',
            brand: 'Mercedes',
            year: 2023,
            pricePerDay: 75.00,
            category: 'Sedan',
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'Mustang',
            brand: 'Ford',
            year: 2024,
            pricePerDay: 110.00,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f1f3e1e0?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'Tahoe',
            brand: 'Chevrolet',
            year: 2023,
            pricePerDay: 80.00,
            category: 'SUV',
            imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'A4',
            brand: 'Audi',
            year: 2024,
            pricePerDay: 70.00,
            category: 'Sedan',
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: '911',
            brand: 'Porsche',
            year: 2023,
            pricePerDay: 200.00,
            category: 'Sports',
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        },
        {
            model: 'Altima',
            brand: 'Nissan',
            year: 2023,
            pricePerDay: 40.00,
            category: 'Sedan',
            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
            available: true,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(cars).values(sampleCars);
    
    console.log('✅ Cars seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
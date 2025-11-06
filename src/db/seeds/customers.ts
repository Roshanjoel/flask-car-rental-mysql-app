import { db } from '@/db';
import { customers } from '@/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('password123', 10);
    
    const sampleCustomers = [
        {
            name: 'Admin User',
            email: 'admin@carrental.com',
            password: hashedAdminPassword,
            phone: '+1-555-0100',
            isAdmin: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'John Smith',
            email: 'john.smith@email.com',
            password: hashedUserPassword,
            phone: '+1-555-0101',
            isAdmin: false,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            password: hashedUserPassword,
            phone: '+1-555-0102',
            isAdmin: false,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Michael Brown',
            email: 'michael.brown@email.com',
            password: hashedUserPassword,
            phone: '+1-555-0103',
            isAdmin: false,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(customers).values(sampleCustomers);
    
    console.log('✅ Customers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
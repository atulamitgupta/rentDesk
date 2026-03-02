import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DB Connection Test ---');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

    try {
        await prisma.$connect();
        console.log('✅ Connection successful!');

        const counts = await prisma.landlord.count();
        console.log('Landlord count:', counts);

    } catch (e) {
        console.error('❌ Connection failed!');
        console.error('Error Code:', e.code);
        console.error('Error Message:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();

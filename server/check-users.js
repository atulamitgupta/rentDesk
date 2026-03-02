
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.landlord.findMany();
    console.log('LANDLORDS:', users.map(u => ({ email: u.email, role: u.role })));
    await prisma.$disconnect();
}
check();

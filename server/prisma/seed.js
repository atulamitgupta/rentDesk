// =============================================================
//  Cloud Bass Rent Management — Database Seeder
//  File : server/prisma/seed.js
//
//  Creates the initial landlord account for the MVP.
//  Run with: npx prisma db seed
//
//  Default credentials:
//    Email    : admin@rentdesk.in
//    Password : Admin@123
//
//  CHANGE THESE before going to production!
// =============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('\n[Seed] Starting database seed...\n');

    // ── 1. Create or update authorized founder accounts ────────
    const authorizedUsers = [
        { email: 'admin@rentdesk.in', name: 'Cloud Bass Admin', role: 'founder' },
        { email: 'owner@rentdesk.in', name: 'Test Landlord', role: 'owner' },
    ];
    const password = process.env.SEED_PASSWORD || 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 12);

    let mainLandlord = null;

    for (const user of authorizedUsers) {
        const landlord = await prisma.landlord.upsert({
            where: { email: user.email },
            update: { password_hash: passwordHash, full_name: user.name, role: user.role },
            create: {
                email: user.email,
                password_hash: passwordHash,
                full_name: user.name,
                role: user.role,
                phone: '9876543210',
                whatsapp_no: '9876543210',
            },
        });
        console.log(`[Seed] ✅ Landlord created: ${landlord.full_name} (${landlord.email})`);
        if (!mainLandlord) mainLandlord = landlord;
    }

    const landlord = mainLandlord;

    // ── 2. Create a sample property ─────────────────────────────
    const property = await prisma.property.upsert({
        where: { id: 'seed-property-001' },
        update: {},
        create: {
            id: 'seed-property-001',
            landlord_id: landlord.id,
            name: 'Sunshine Apartments',
            address: '12, MG Road, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400053',
            type: 'RESIDENTIAL',
        },
    });

    console.log(`[Seed] ✅ Property: ${property.name}`);

    // ── 3. Create sample units ───────────────────────────────────
    const unitsData = [
        { id: 'seed-unit-101', unit_number: 'Flat 101', floor: '1st', monthly_rent: 15000, status: 'OCCUPIED' },
        { id: 'seed-unit-102', unit_number: 'Flat 102', floor: '1st', monthly_rent: 15000, status: 'VACANT' },
        { id: 'seed-unit-201', unit_number: 'Flat 201', floor: '2nd', monthly_rent: 18000, status: 'OCCUPIED' },
        { id: 'seed-unit-202', unit_number: 'Flat 202', floor: '2nd', monthly_rent: 18000, status: 'VACANT' },
        { id: 'seed-unit-301', unit_number: 'Flat 301', floor: '3rd', monthly_rent: 20000, status: 'OCCUPIED' },
    ];

    for (const u of unitsData) {
        await prisma.unit.upsert({
            where: { id: u.id },
            update: {},
            create: { ...u, property_id: property.id },
        });
    }
    console.log(`[Seed] ✅ Units: ${unitsData.length} created`);

    // ── 4. Create sample tenants (for OCCUPIED units) ────────────
    const tenantsData = [
        {
            id: 'seed-tenant-001',
            unit_id: 'seed-unit-101',
            full_name: 'Priya Sharma',
            phone: '9123456789',
            whatsapp_no: '9123456789',
            email: 'priya.sharma@gmail.com',
            move_in_date: new Date('2025-01-01'),
            security_deposit: 30000,
        },
        {
            id: 'seed-tenant-002',
            unit_id: 'seed-unit-201',
            full_name: 'Mohammed Ali Khan',
            phone: '9988776655',
            whatsapp_no: '9988776655',
            email: 'mak@email.com',
            move_in_date: new Date('2024-06-15'),
            security_deposit: 36000,
        },
        {
            id: 'seed-tenant-003',
            unit_id: 'seed-unit-301',
            full_name: 'Anita Patel',
            phone: '9871234560',
            whatsapp_no: '9871234560',
            email: null,
            move_in_date: new Date('2025-03-01'),
            security_deposit: 40000,
        },
    ];

    for (const t of tenantsData) {
        await prisma.tenant.upsert({
            where: { id: t.id },
            update: {},
            create: t,
        });
    }
    console.log(`[Seed] ✅ Tenants: ${tenantsData.length} created`);

    // ── 5. Create sample rent payments for March 2026 ───────────
    const rentMonth = new Date('2026-03-01');
    const dueDate = new Date('2026-03-05');

    const paymentsData = [
        { id: 'seed-pay-001', unit_id: 'seed-unit-101', tenant_id: 'seed-tenant-001', amount_due: 15000, status: 'PAID', payment_date: new Date('2026-03-02'), amount_paid: 15000, payment_note: 'UPI' },
        { id: 'seed-pay-002', unit_id: 'seed-unit-201', tenant_id: 'seed-tenant-002', amount_due: 18000, status: 'PENDING', payment_date: null, amount_paid: 0 },
        { id: 'seed-pay-003', unit_id: 'seed-unit-301', tenant_id: 'seed-tenant-003', amount_due: 20000, status: 'OVERDUE', payment_date: null, amount_paid: 0 },
    ];

    for (const p of paymentsData) {
        await prisma.rentPayment.upsert({
            where: { unit_id_rent_month: { unit_id: p.unit_id, rent_month: rentMonth } },
            update: {},
            create: { ...p, rent_month: rentMonth, due_date: dueDate },
        });
    }
    console.log(`[Seed] ✅ Rent Payments: ${paymentsData.length} created for March 2026`);

    console.log('\n[Seed] 🎉 Database seeded successfully!');
    console.log(`[Seed]    Login: ${landlord.email} / ${password}\n`);
}

main()
    .catch((e) => {
        console.error('[Seed] ❌ Error:', e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

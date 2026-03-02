// =============================================================
//  Cloud Bass Rent Management — Rent Engine Service
//  File : server/services/rentEngine.js
//
//  PURPOSE:
//    Automatically generates one RentPayment record per OCCUPIED
//    unit on the 1st of every calendar month.
//
//  IDEMPOTENCY:
//    Uses Prisma's upsert() with the @@unique([unit_id, rent_month])
//    constraint as the key. Running this function 10 times on the
//    same day will always produce exactly ONE record per unit —
//    never duplicates.
//
//  SCHEDULING:
//    A node-cron job calls generateMonthlyRent() automatically.
//    The landlord can also trigger it manually via the API route:
//    POST /api/rent-payments/generate
//
//  USAGE:
//    import { startRentEngineScheduler, generateMonthlyRent } from './services/rentEngine.js';
//    startRentEngineScheduler(); // call once at server startup
// =============================================================

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

// ── Prisma singleton ──────────────────────────────────────────
// Re-use the same Prisma instance to avoid exhausting DB connections.
// In production you'd import this from a shared db.js module.
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// =============================================================
//  HELPER: buildRentMonth
//  Returns a Date object normalized to the FIRST day of the
//  specified month at 00:00:00 UTC — our idempotency key.
//
//  @param {number} year  - Full year, e.g. 2026
//  @param {number} month - 1-indexed month, e.g. 3 for March
//  @returns {Date}
// =============================================================
function buildRentMonth(year, month) {
    // new Date(year, month - 1, 1) creates a LOCAL-time date.
    // We then derive an ISO string (UTC midnight) to avoid
    // timezone-shifted date mismatches in PostgreSQL DATE columns.
    const local = new Date(year, month - 1, 1);
    return new Date(
        Date.UTC(local.getFullYear(), local.getMonth(), local.getDate())
    );
}

// =============================================================
//  HELPER: buildDueDate
//  Returns the payment due date — by convention, the 5th of
//  the billing month. Configurable via env var DUE_DAY_OF_MONTH.
//
//  @param {number} year
//  @param {number} month
//  @returns {Date}
// =============================================================
function buildDueDate(year, month) {
    const dueDay = parseInt(process.env.DUE_DAY_OF_MONTH || '5', 10);
    return new Date(Date.UTC(year, month - 1, dueDay));
}

// =============================================================
//  CORE: generateMonthlyRent
//
//  @param {object} [options]
//  @param {number} [options.year]  - Override year  (default: now)
//  @param {number} [options.month] - Override month (default: now, 1-indexed)
//  @param {string} [options.landlordId] - Scope to one landlord (optional)
//
//  @returns {Promise<{ created: number, skipped: number, errors: number, details: Array }>}
//
//  IDEMPOTENCY STRATEGY:
//    prisma.rentPayment.upsert() uses the @@unique([unit_id, rent_month])
//    index as the WHERE clause. On conflict it runs the `update` branch,
//    which is a no-op (we don't overwrite existing records).
//    This makes the function safe to call multiple times per day.
// =============================================================
export async function generateMonthlyRent(options = {}) {
    const now = new Date();
    const year = options.year ?? now.getFullYear();
    const month = options.month ?? (now.getMonth() + 1); // convert 0-indexed → 1-indexed

    const rentMonth = buildRentMonth(year, month);
    const dueDate = buildDueDate(year, month);

    const monthLabel = `${year}-${String(month).padStart(2, '0')}`;
    console.log(`\n[RentEngine] ▶ Starting rent generation for ${monthLabel}`);
    console.log(`[RentEngine]   Rent Month : ${rentMonth.toISOString().slice(0, 10)}`);
    console.log(`[RentEngine]   Due Date   : ${dueDate.toISOString().slice(0, 10)}`);

    // ── Step 1: Fetch all OCCUPIED units with their active tenant ─
    const unitFilter = {
        status: 'OCCUPIED',
        tenant: { is: { is_active: true } }, // Only units with an active tenant
        ...(options.landlordId && {
            property: { landlord_id: options.landlordId },
        }),
    };

    const occupiedUnits = await prisma.unit.findMany({
        where: unitFilter,
        include: {
            tenant: true,    // Needed for tenant_id + WhatsApp number
            property: {        // Needed for logging context
                select: { name: true, landlord_id: true },
            },
        },
    });

    console.log(`[RentEngine]   Found ${occupiedUnits.length} occupied unit(s) to process.`);

    if (occupiedUnits.length === 0) {
        console.log('[RentEngine] ✅ Nothing to generate. Exiting.\n');
        return { created: 0, skipped: 0, errors: 0, details: [] };
    }

    // ── Step 2: Process each unit ─────────────────────────────────
    let created = 0;
    let skipped = 0;
    let errors = 0;
    const details = [];

    for (const unit of occupiedUnits) {
        const tenant = unit.tenant;

        // Safety guard: should never happen given the query above,
        // but we defensive-check to avoid a runtime crash.
        if (!tenant) {
            console.warn(`[RentEngine] ⚠ Unit ${unit.id} (${unit.unit_number}) has no active tenant. Skipping.`);
            skipped++;
            continue;
        }

        try {
            // ── IDEMPOTENT UPSERT ─────────────────────────────────
            // WHERE: the @@unique([unit_id, rent_month]) compound key
            // CREATE: insert a fresh PENDING record
            // UPDATE: do nothing (empty update = no-op on conflict)
            //
            // This pattern guarantees: run once = 1 record.
            //                          run 100x  = still 1 record.
            const result = await prisma.rentPayment.upsert({
                where: {
                    // Prisma auto-generates this name from @@unique([unit_id, rent_month])
                    unit_id_rent_month: {
                        unit_id: unit.id,
                        rent_month: rentMonth,
                    },
                },
                create: {
                    unit_id: unit.id,
                    tenant_id: tenant.id,
                    rent_month: rentMonth,
                    due_date: dueDate,
                    // Snapshot rent at generation time — decoupled from future changes
                    amount_due: unit.monthly_rent,
                    balance_due: unit.monthly_rent, // New
                    status: 'PENDING',
                },
                update: {
                    // NO-OP on conflict: we never overwrite an existing record.
                    // This is what makes it idempotent.
                    updated_at: new Date(), // harmless timestamp touch
                },
            });

            // Prisma upsert doesn't natively tell us "created vs updated",
            // so we compare created_at ≈ updated_at to detect a creation.
            const wasCreated =
                Math.abs(result.created_at.getTime() - result.updated_at.getTime()) < 1000;

            if (wasCreated) {
                created++;
                console.log(
                    `[RentEngine]   ✅ CREATED | ${tenant.full_name} | ${unit.unit_number} | ${unit.property.name} | ₹${unit.monthly_rent}`
                );
            } else {
                skipped++;
                console.log(
                    `[RentEngine]   ⏭ SKIPPED | ${tenant.full_name} | ${unit.unit_number} | Already exists`
                );
            }

            details.push({
                unitId: unit.id,
                unitNumber: unit.unit_number,
                property: unit.property.name,
                tenantName: tenant.full_name,
                amountDue: unit.monthly_rent,
                action: wasCreated ? 'CREATED' : 'SKIPPED',
                recordId: result.id,
            });

        } catch (err) {
            // Log and continue — one failure shouldn't abort the whole batch
            errors++;
            console.error(
                `[RentEngine]   ❌ ERROR | Unit ${unit.unit_number} | ${err.message}`
            );
            details.push({
                unitId: unit.id,
                unitNumber: unit.unit_number,
                tenantName: tenant.full_name,
                action: 'ERROR',
                error: err.message,
            });
        }
    }

    // ── Step 3: Summary log ───────────────────────────────────────
    console.log(`\n[RentEngine] ✅ Done for ${monthLabel}`);
    console.log(`[RentEngine]   Created : ${created}`);
    console.log(`[RentEngine]   Skipped : ${skipped} (already existed)`);
    console.log(`[RentEngine]   Errors  : ${errors}`);
    console.log('[RentEngine] ─────────────────────────────────────\n');

    return { created, skipped, errors, details };
}

// =============================================================
//  CRON JOB: markOverduePayments
//
//  Runs daily at 08:00 AM.
//  Finds all PENDING payments whose due_date has passed and
//  flips their status to OVERDUE.
// =============================================================
export async function markOverduePayments() {
    console.log('[RentEngine] ▶ Running overdue check...');

    try {
        const result = await prisma.rentPayment.updateMany({
            where: {
                status: 'PENDING',
                due_date: { lt: new Date() }, // lt = less than = before today
            },
            data: {
                status: 'OVERDUE',
                updated_at: new Date(),
            },
        });

        console.log(`[RentEngine] ✅ Marked ${result.count} record(s) as OVERDUE.\n`);
        return { markedOverdue: result.count };

    } catch (err) {
        console.error('[RentEngine] ❌ Overdue check failed:', err.message);
        throw err;
    }
}

// =============================================================
//  SCHEDULER: startRentEngineScheduler
//
//  Registers two node-cron tasks. Call this ONCE at server boot.
//
//  Schedule 1 — Monthly Rent Generation
//    Cron: '0 0 1 * *'  → 00:00 on the 1st of every month
//
//  Schedule 2 — Overdue Flag
//    Cron: '0 8 * * *'  → 08:00 AM every day
//
//  Cron syntax: minute hour day-of-month month day-of-week
// =============================================================
export function startRentEngineScheduler() {

    // ── Job 1: Monthly Rent Generation ───────────────────────────
    const monthlyJob = cron.schedule(
        '0 0 1 * *',          // At midnight on 1st of every month
        async () => {
            console.log('[RentEngine] 🕐 Cron triggered: Monthly Rent Generation');
            try {
                await generateMonthlyRent();
            } catch (err) {
                console.error('[RentEngine] ❌ Monthly cron job failed:', err.message);
            }
        },
        {
            scheduled: true,
            timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata', // IST by default
        }
    );

    // ── Job 2: Daily Overdue Check ────────────────────────────────
    const overdueJob = cron.schedule(
        '0 8 * * *',          // At 08:00 AM every day
        async () => {
            console.log('[RentEngine] 🕐 Cron triggered: Overdue Check');
            try {
                await markOverduePayments();
            } catch (err) {
                console.error('[RentEngine] ❌ Overdue cron job failed:', err.message);
            }
        },
        {
            scheduled: true,
            timezone: process.env.CRON_TIMEZONE || 'Asia/Kolkata',
        }
    );

    console.log('[RentEngine] ✅ Scheduled: Monthly rent generation at 00:00 on 1st of every month (IST)');
    console.log('[RentEngine] ✅ Scheduled: Overdue check at 08:00 AM daily (IST)\n');

    // Return the jobs so the caller can stop them if needed (e.g. in tests)
    return { monthlyJob, overdueJob };
}

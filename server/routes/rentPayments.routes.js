// =============================================================
//  Routes: Rent Payments
//  File : server/routes/rentPayments.routes.js
//
//  IMPORTANT: /summary and /generate must be defined BEFORE /:id
//  to prevent Express treating them as ID params.
// =============================================================

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { generateMonthlyRent } from '../services/rentEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// =============================================================
//  STATIC ROUTES FIRST (must be before /:id patterns)
// =============================================================

// GET /api/rent-payments/summary — 6-month chart data
router.get('/summary', async (req, res) => {
    try {
        const results = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const rentMonth = new Date(d.getFullYear(), d.getMonth(), 1);

            const agg = await prisma.rentPayment.aggregate({
                where: { rent_month: rentMonth, unit: { property: { landlord_id: req.landlord.id } } },
                _sum: { amount_due: true, amount_paid: true },
                _count: { _all: true },
            });

            results.push({
                month: rentMonth.toISOString().slice(0, 7),
                label: new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' }).format(rentMonth),
                totalDue: Number(agg._sum.amount_due || 0),
                totalCollected: Number(agg._sum.amount_paid || 0),
                count: agg._count._all,
            });
        }
        return res.json({ success: true, data: results });
    } catch (e) {
        console.error('[GET /rent-payments/summary]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// POST /api/rent-payments/generate — manual trigger
router.post('/generate', async (req, res) => {
    try {
        const { year, month } = req.body;
        const result = await generateMonthlyRent({
            year: year ? parseInt(year) : undefined,
            month: month ? parseInt(month) : undefined,
            landlordId: req.landlord.id,
        });
        return res.json({ success: true, ...result });
    } catch (e) {
        console.error('[POST /rent-payments/generate]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// =============================================================
//  PARTIAL PAYMENT
//  PATCH /api/rent-payments/:id/partial
//  Accumulates amount_paid, recalculates balance_due,
//  sets status to PARTIAL (balance>0) or PAID (balance=0).
//  Can be called multiple times per payment record.
// =============================================================
router.patch(
    '/:id/partial',
    [
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be > 0.'),
        body('note').optional().trim(),
    ],
    validate,
    async (req, res) => {
        try {
            const { amount, note } = req.body;
            const paid = parseFloat(amount);

            const payment = await prisma.rentPayment.findFirst({
                where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
            });
            if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
            if (payment.status === 'PAID' || payment.status === 'WAIVED') {
                return res.status(400).json({ success: false, message: `Cannot add payment to a ${payment.status} record.` });
            }

            const newTotalPaid = Number(payment.amount_paid) + paid;
            const amountDue = Number(payment.amount_due);

            if (newTotalPaid > amountDue) {
                return res.status(400).json({
                    success: false,
                    message: `₹${paid} exceeds balance due (₹${(amountDue - Number(payment.amount_paid)).toFixed(2)}).`,
                });
            }

            const balanceDue = parseFloat((amountDue - newTotalPaid).toFixed(2));
            const newStatus = balanceDue <= 0 ? 'PAID' : 'PARTIAL';
            const paymentDate = newStatus === 'PAID' ? new Date() : (payment.payment_date || null);

            const existingNote = payment.payment_note || '';
            const appendedNote = note
                ? `${existingNote}${existingNote ? ' | ' : ''}Partial ₹${paid}: ${note}`
                : existingNote;

            const updated = await prisma.rentPayment.update({
                where: { id: req.params.id },
                data: {
                    amount_paid: newTotalPaid,
                    balance_due: balanceDue,
                    status: newStatus,
                    payment_date: paymentDate,
                    payment_note: appendedNote || null,
                    updated_at: new Date(),
                },
            });

            return res.json({
                success: true,
                data: updated,
                message: newStatus === 'PAID'
                    ? `✅ ₹${paid} received — fully PAID!`
                    : `📋 Partial ₹${paid} recorded. Balance: ₹${balanceDue}.`,
                newStatus, balanceDue, totalPaid: newTotalPaid,
            });
        } catch (e) {
            console.error('[PATCH /rent-payments/:id/partial]', e.message);
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// =============================================================
//  LIST + DETAIL ROUTES
// =============================================================

// GET /api/rent-payments — filterable ledger
router.get('/', async (req, res) => {
    try {
        const { month, status, propertyId, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            unit: {
                property: {
                    landlord_id: req.landlord.id,
                    ...(propertyId && { id: propertyId }),
                },
            },
            ...(status && status !== 'ALL' && { status }),
            ...(month && { rent_month: new Date(`${month}-01`) }),
        };

        const [payments, total] = await Promise.all([
            prisma.rentPayment.findMany({
                where,
                include: {
                    tenant: { select: { id: true, full_name: true, phone: true, whatsapp_no: true } },
                    unit: {
                        select: {
                            id: true, unit_number: true, floor: true,
                            property: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: [{ status: 'asc' }, { due_date: 'asc' }],
                skip: skip,
                take: parseInt(limit),
            }),
            prisma.rentPayment.count({ where }),
        ]);

        return res.json({
            success: true,
            data: payments,
            meta: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
        });
    } catch (e) {
        console.error('[GET /rent-payments]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// PATCH /api/rent-payments/:id/pay — mark as PAID
router.patch(
    '/:id/pay',
    [
        body('amount_paid').isFloat({ min: 0 }).withMessage('amount_paid must be a positive number.'),
        body('payment_date').optional().isISO8601(),
    ],
    validate,
    async (req, res) => {
        try {
            const { amount_paid, payment_date, payment_note } = req.body;

            const payment = await prisma.rentPayment.findFirst({
                where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
            });
            if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
            if (payment.status === 'PAID') return res.status(400).json({ success: false, message: 'Already paid.' });

            const updated = await prisma.rentPayment.update({
                where: { id: req.params.id },
                data: {
                    status: 'PAID',
                    amount_paid: parseFloat(amount_paid),
                    payment_date: payment_date ? new Date(payment_date) : new Date(),
                    payment_note: payment_note || null,
                },
            });
            return res.json({ success: true, data: updated, message: 'Marked as PAID.' });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// PATCH /api/rent-payments/:id/waive
router.patch('/:id/waive', async (req, res) => {
    try {
        const { payment_note } = req.body;
        const payment = await prisma.rentPayment.findFirst({
            where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
        });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });

        const updated = await prisma.rentPayment.update({
            where: { id: req.params.id },
            data: { status: 'WAIVED', payment_note: payment_note || 'Waived by landlord' },
        });
        return res.json({ success: true, data: updated, message: 'Payment waived.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

export default router;

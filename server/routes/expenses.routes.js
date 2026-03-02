// =============================================================
//  Routes: Expenses
//  File : server/routes/expenses.routes.js
// =============================================================

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

const VALID_CATEGORIES = ['MAINTENANCE', 'UTILITY', 'TAX', 'INSURANCE', 'OTHER'];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// ─────────────────────────────────────────────────────────────
//  GET /api/expenses/summary  ← must be BEFORE /:id route
//  Returns: total expenses per category this month + grand total
// ─────────────────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
    try {
        const { month } = req.query; // YYYY-MM, defaults to current month
        const now = new Date();
        const d = month ? new Date(`${month}-01`) : new Date(now.getFullYear(), now.getMonth(), 1);

        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await prisma.expense.findMany({
            where: {
                landlord_id: req.landlord.id,
                expense_date: { gte: start, lte: end },
            },
            select: { amount: true, category: true },
        });

        const byCategory = {};
        let total = 0;
        for (const e of expenses) {
            byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
            total += Number(e.amount);
        }

        return res.json({ success: true, data: { total, byCategory, month: start.toISOString().slice(0, 7) } });
    } catch (e) {
        console.error('[GET /expenses/summary]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// ─────────────────────────────────────────────────────────────
//  GET /api/expenses  — list all
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { month, category, propertyId, limit = 50, page = 1 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            landlord_id: req.landlord.id,
            ...(category && { category }),
            ...(propertyId && { property_id: propertyId }),
            ...(month && {
                expense_date: {
                    gte: new Date(`${month}-01`),
                    lte: new Date(new Date(`${month}-01`).getFullYear(), new Date(`${month}-01`).getMonth() + 1, 0, 23, 59, 59),
                },
            }),
        };

        const [data, total] = await Promise.all([
            prisma.expense.findMany({
                where,
                include: { property: { select: { id: true, name: true } } },
                orderBy: { expense_date: 'desc' },
                skip, take: parseInt(limit),
            }),
            prisma.expense.count({ where }),
        ]);

        return res.json({ success: true, data, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
    } catch (e) {
        console.error('[GET /expenses]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// ─────────────────────────────────────────────────────────────
//  POST /api/expenses  — create
// ─────────────────────────────────────────────────────────────
router.post(
    '/',
    [
        body('description').trim().notEmpty().withMessage('Description is required.'),
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be > 0.'),
        body('category').optional().isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`),
    ],
    validate,
    async (req, res) => {
        try {
            const { description, amount, category, property_id, expense_date, notes } = req.body;

            // Verify property belongs to landlord (if provided)
            if (property_id) {
                const prop = await prisma.property.findFirst({ where: { id: property_id, landlord_id: req.landlord.id } });
                if (!prop) return res.status(400).json({ success: false, message: 'Property not found.' });
            }

            const data = await prisma.expense.create({
                data: {
                    landlord_id: req.landlord.id,
                    property_id: property_id || null,
                    description,
                    amount: parseFloat(amount),
                    category: category || 'OTHER',
                    expense_date: expense_date ? new Date(expense_date) : new Date(),
                    notes: notes || null,
                },
                include: { property: { select: { id: true, name: true } } },
            });

            return res.status(201).json({ success: true, data });
        } catch (e) {
            console.error('[POST /expenses]', e.message);
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// ─────────────────────────────────────────────────────────────
//  DELETE /api/expenses/:id
// ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await prisma.expense.deleteMany({
            where: { id: req.params.id, landlord_id: req.landlord.id },
        });
        if (deleted.count === 0) return res.status(404).json({ success: false, message: 'Expense not found.' });
        return res.json({ success: true, message: 'Expense deleted.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

export default router;

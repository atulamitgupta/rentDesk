// =============================================================
//  Routes: Tenants
//  File : server/routes/tenants.routes.js
// =============================================================

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// GET /api/tenants
router.get('/', async (req, res) => {
    try {
        const { search, propertyId, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // SQLite does NOT support mode: 'insensitive' — use plain contains
        const searchFilter = search
            ? {
                OR: [
                    { full_name: { contains: search } },
                    { phone: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {};

        const where = {
            is_active: true,
            unit: {
                property: {
                    landlord_id: req.landlord.id,
                    ...(propertyId && { id: propertyId }),
                },
            },
            ...searchFilter,
        };

        const [tenants, total] = await Promise.all([
            prisma.tenant.findMany({
                where,
                include: {
                    unit: {
                        include: { property: { select: { id: true, name: true, city: true } } },
                    },
                },
                orderBy: { full_name: 'asc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.tenant.count({ where }),
        ]);

        return res.json({
            success: true,
            data: tenants,
            meta: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
        });
    } catch (e) {
        console.error('[GET /tenants]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// GET /api/tenants/:id
router.get('/:id', async (req, res) => {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
            include: {
                unit: { include: { property: true } },
                rent_payments: { orderBy: { rent_month: 'desc' }, take: 12 },
            },
        });
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        return res.json({ success: true, data: tenant });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// POST /api/tenants — assign to a VACANT unit
router.post(
    '/',
    [
        body('unit_id').notEmpty().withMessage('unit_id is required.'),
        body('full_name').trim().notEmpty().withMessage('Name is required.'),
        body('phone').trim().notEmpty().withMessage('Phone is required.'),
        body('move_in_date').isISO8601().withMessage('move_in_date must be a valid date.'),
        body('security_deposit').optional().isFloat({ min: 0 }),
    ],
    validate,
    async (req, res) => {
        try {
            const { unit_id, full_name, phone, whatsapp_no, email, move_in_date, security_deposit, notes } = req.body;

            const unit = await prisma.unit.findFirst({
                where: { id: unit_id, status: 'VACANT', property: { landlord_id: req.landlord.id } },
            });
            if (!unit) return res.status(400).json({ success: false, message: 'Unit not found or already occupied.' });

            const [tenant] = await prisma.$transaction([
                prisma.tenant.create({
                    data: {
                        unit_id,
                        full_name,
                        phone,
                        whatsapp_no: whatsapp_no || phone,
                        email: email || null,
                        move_in_date: new Date(move_in_date),
                        security_deposit: security_deposit ? parseFloat(security_deposit) : 0,
                        notes: notes || null,
                    },
                }),
                prisma.unit.update({ where: { id: unit_id }, data: { status: 'OCCUPIED' } }),
            ]);

            return res.status(201).json({ success: true, data: tenant, message: `${full_name} assigned to ${unit.unit_number}.` });
        } catch (e) {
            if (e.code === 'P2002') return res.status(409).json({ success: false, message: 'Unit already has a tenant.' });
            console.error('[POST /tenants]', e.message);
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// PATCH /api/tenants/:id
router.patch('/:id', [body('phone').optional().trim().notEmpty()], validate, async (req, res) => {
    try {
        const { full_name, phone, whatsapp_no, email, security_deposit, notes } = req.body;
        const data = await prisma.tenant.updateMany({
            where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
            data: { full_name, phone, whatsapp_no, email, security_deposit, notes },
        });
        if (data.count === 0) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        return res.json({ success: true, message: 'Tenant updated.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// DELETE /api/tenants/:id — soft vacate
router.delete('/:id', async (req, res) => {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { id: req.params.id, unit: { property: { landlord_id: req.landlord.id } } },
        });
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        if (!tenant.is_active) return res.status(400).json({ success: false, message: 'Tenant has already vacated.' });

        await prisma.$transaction([
            prisma.tenant.update({ where: { id: tenant.id }, data: { is_active: false } }),
            prisma.unit.update({ where: { id: tenant.unit_id }, data: { status: 'VACANT' } }),
        ]);

        return res.json({ success: true, message: 'Tenant vacated. Unit is now available.' });
    } catch (e) {
        console.error('[DELETE /tenants/:id]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

export default router;

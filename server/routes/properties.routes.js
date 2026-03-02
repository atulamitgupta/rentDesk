// =============================================================
//  Routes: Properties + Units
//  File : server/routes/properties.routes.js
// =============================================================

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// =============================================================
//  PROPERTIES
// =============================================================

// GET /api/properties
router.get('/', async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            where: { landlord_id: req.landlord.id },
            include: { units: { select: { id: true, status: true, monthly_rent: true } } },
            orderBy: { created_at: 'desc' },
        });

        const data = properties.map(p => ({
            ...p,
            totalUnits: p.units.length,
            occupiedUnits: p.units.filter(u => u.status === 'OCCUPIED').length,
            vacantUnits: p.units.filter(u => u.status === 'VACANT').length,
            totalRentPotential: p.units
                .filter(u => u.status === 'OCCUPIED')
                .reduce((sum, u) => sum + Number(u.monthly_rent), 0),
        }));

        return res.json({ success: true, count: data.length, data });
    } catch (e) {
        console.error('[GET /properties]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// GET /api/properties/:id — with units + tenants
router.get('/:id', async (req, res) => {
    try {
        const property = await prisma.property.findFirst({
            where: { id: req.params.id, landlord_id: req.landlord.id },
            include: {
                units: { include: { tenant: true }, orderBy: { unit_number: 'asc' } },
            },
        });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
        return res.json({ success: true, data: property });
    } catch (e) {
        console.error('[GET /properties/:id]', e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
});

// POST /api/properties — create
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Property name is required.'),
        body('address').trim().notEmpty().withMessage('Address is required.'),
        body('city').trim().notEmpty().withMessage('City is required.'),
        body('type').optional().isIn(['RESIDENTIAL', 'COMMERCIAL', 'MIXED']),
    ],
    validate,
    async (req, res) => {
        try {
            const { name, address, city, state, pincode, type } = req.body;
            const data = await prisma.property.create({
                data: { landlord_id: req.landlord.id, name, address, city, state: state || null, pincode: pincode || null, type: type || 'RESIDENTIAL' },
            });
            return res.status(201).json({ success: true, data });
        } catch (e) {
            console.error('[POST /properties]', e.message);
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// PATCH /api/properties/:id
router.patch('/:id', [body('name').optional().trim().notEmpty()], validate, async (req, res) => {
    try {
        const { name, address, city, state, pincode, type } = req.body;
        const updated = await prisma.property.updateMany({
            where: { id: req.params.id, landlord_id: req.landlord.id },
            data: { name, address, city, state, pincode, type },
        });
        if (updated.count === 0) return res.status(404).json({ success: false, message: 'Property not found.' });
        return res.json({ success: true, message: 'Property updated.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// DELETE /api/properties/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await prisma.property.deleteMany({
            where: { id: req.params.id, landlord_id: req.landlord.id },
        });
        if (deleted.count === 0) return res.status(404).json({ success: false, message: 'Property not found.' });
        return res.json({ success: true, message: 'Property deleted.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// =============================================================
//  UNITS
// =============================================================

// GET /api/properties/:propertyId/units
router.get('/:propertyId/units', async (req, res) => {
    try {
        const property = await prisma.property.findFirst({
            where: { id: req.params.propertyId, landlord_id: req.landlord.id },
        });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

        const units = await prisma.unit.findMany({
            where: { property_id: req.params.propertyId },
            include: { tenant: true },
            orderBy: { unit_number: 'asc' },
        });
        return res.json({ success: true, count: units.length, data: units });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// POST /api/properties/:propertyId/units
router.post(
    '/:propertyId/units',
    [
        body('unit_number').trim().notEmpty().withMessage('Unit number required.'),
        body('monthly_rent').isFloat({ min: 0 }).withMessage('Monthly rent must be a positive number.'),
    ],
    validate,
    async (req, res) => {
        try {
            const property = await prisma.property.findFirst({
                where: { id: req.params.propertyId, landlord_id: req.landlord.id },
            });
            if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

            const { unit_number, floor, monthly_rent } = req.body;
            const data = await prisma.unit.create({
                data: {
                    property_id: req.params.propertyId,
                    unit_number,
                    floor: floor || null,
                    monthly_rent: parseFloat(monthly_rent),
                    status: 'VACANT',
                },
            });
            return res.status(201).json({ success: true, data });
        } catch (e) {
            console.error('[POST /units]', e.message);
            return res.status(500).json({ success: false, message: e.message });
        }
    }
);

// PATCH /api/properties/:propertyId/units/:unitId
router.patch('/:propertyId/units/:unitId', async (req, res) => {
    try {
        const { unit_number, floor, monthly_rent } = req.body;
        const data = await prisma.unit.updateMany({
            where: { id: req.params.unitId, property_id: req.params.propertyId },
            data: { unit_number, floor, monthly_rent: monthly_rent ? parseFloat(monthly_rent) : undefined },
        });
        if (data.count === 0) return res.status(404).json({ success: false, message: 'Unit not found.' });
        return res.json({ success: true, message: 'Unit updated.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// DELETE /api/properties/:propertyId/units/:unitId
router.delete('/:propertyId/units/:unitId', async (req, res) => {
    try {
        const unit = await prisma.unit.findFirst({
            where: { id: req.params.unitId, property_id: req.params.propertyId },
        });
        if (!unit) return res.status(404).json({ success: false, message: 'Unit not found.' });
        if (unit.status === 'OCCUPIED')
            return res.status(400).json({ success: false, message: 'Vacate the tenant first.' });
        await prisma.unit.delete({ where: { id: req.params.unitId } });
        return res.json({ success: true, message: 'Unit deleted.' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

export default router;

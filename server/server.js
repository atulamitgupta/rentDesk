// =============================================================
//  Cloud Bass Rent Management — Express Server
//  File : server/server.js
// =============================================================

import 'dotenv/config';           // MUST be first — loads .env before any other import
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// ── Auth middleware (in its own file to avoid circular deps) ──
import { authMiddleware } from './middleware/auth.js';

// ── Route imports ─────────────────────────────────────────────
import propertiesRouter from './routes/properties.routes.js';
import tenantsRouter from './routes/tenants.routes.js';
import rentPaymentsRouter from './routes/rentPayments.routes.js';
import expensesRouter from './routes/expenses.routes.js';

// ── Rent engine scheduler ─────────────────────────────────────
import { startRentEngineScheduler } from './services/rentEngine.js';

// ── Prisma singleton ──────────────────────────────────────────
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

// =============================================================
//  EXPRESS APP SETUP
// =============================================================
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================================================
//  HEALTH CHECK  (no auth needed)
// =============================================================
app.get('/api/health', async (_, res) => {
  let dbStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'failed: ' + e.message;
  }
  res.json({
    status: 'ok',
    database: dbStatus,
    ts: new Date().toISOString()
  });
});

// =============================================================
//  AUTH ROUTES (no auth middleware — these ARE the auth routes)
// =============================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    // 1. Normalization: Always trim and lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Database Query: Check for correct email
    const landlord = await prisma.landlord.findUnique({ where: { email: normalizedEmail } });
    if (!landlord) {
      return res.status(401).json({ success: false, message: 'Incorrect Email ID. Please check and try again.' });
    }

    // 3. Password Verification
    const isMatched = await bcrypt.compare(password, landlord.password_hash);
    if (!isMatched) {
      return res.status(401).json({ success: false, message: 'Invalid password. Try again.' });
    }

    // 4. Session/JWT Fix: Include user_role
    const token = jwt.sign(
      { id: landlord.id, email: landlord.email, role: landlord.role || 'owner' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password_hash, ...safe } = landlord;
    return res.json({ success: true, token, landlord: safe });
  } catch (e) {
    console.error('[POST /auth/login]', e.message);
    return res.status(500).json({ success: false, message: 'Internal Server error. Please contact founder.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const landlord = await prisma.landlord.findUnique({
      where: { id: req.landlord.id },
      select: { id: true, email: true, full_name: true, phone: true, whatsapp_no: true },
    });
    return res.json({ success: true, landlord });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/auth/profile
app.patch('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, phone, whatsapp_no } = req.body;
    const landlord = await prisma.landlord.update({
      where: { id: req.landlord.id },
      data: { full_name, phone, whatsapp_no },
      select: { id: true, email: true, full_name: true, phone: true, whatsapp_no: true },
    });
    return res.json({ success: true, landlord });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// =============================================================
//  DASHBOARD  (protected)
// =============================================================
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalProperties, allUnits, rentStats, overdueCount, expenseStats] = await Promise.all([
      prisma.property.count({ where: { landlord_id: req.landlord.id } }),

      prisma.unit.findMany({
        where: { property: { landlord_id: req.landlord.id } },
        select: { status: true },
      }),

      prisma.rentPayment.findMany({
        where: { rent_month: thisMonth, unit: { property: { landlord_id: req.landlord.id } } },
        select: { amount_due: true, amount_paid: true },
      }),

      prisma.rentPayment.count({
        where: { status: 'OVERDUE', unit: { property: { landlord_id: req.landlord.id } } },
      }),

      prisma.expense.findMany({
        where: { landlord_id: req.landlord.id, expense_date: { gte: thisMonth } },
        select: { amount: true },
      }),
    ]);

    const occupied = allUnits.filter(u => u.status === 'OCCUPIED').length;
    const vacant = allUnits.filter(u => u.status === 'VACANT').length;
    const due = rentStats.reduce((s, r) => s + Number(r.amount_due), 0);
    const paid = rentStats.reduce((s, r) => s + Number(r.amount_paid), 0);
    const expenses = expenseStats.reduce((s, e) => s + Number(e.amount), 0);

    return res.json({
      success: true,
      data: {
        totalProperties,
        totalUnits: occupied + vacant,
        occupiedUnits: occupied,
        vacantUnits: vacant,
        overdueCount,
        thisMonth: {
          totalDue: due,
          totalCollected: paid,
          totalExpenses: expenses, // New
          netProfit: paid - expenses, // New
          outstanding: due - paid,
          totalRecords: rentStats.length,
        },
      },
    });
  } catch (e) {
    console.error('[GET /dashboard]', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// =============================================================
//  PROTECTED ROUTERS
// =============================================================
app.use('/api/properties', authMiddleware, propertiesRouter);
app.use('/api/tenants', authMiddleware, tenantsRouter);
app.use('/api/rent-payments', authMiddleware, rentPaymentsRouter);
app.use('/api/expenses', authMiddleware, expensesRouter);

// WhatsApp — lazy-loaded to avoid crashing if Puppeteer not available
app.use('/api/whatsapp', authMiddleware, async (req, res, next) => {
  try {
    const { default: waRouter } = await import('./routes/whatsapp.js');
    waRouter(req, res, next);
  } catch (e) {
    res.status(503).json({ success: false, message: 'WhatsApp module unavailable: ' + e.message });
  }
});

// =============================================================
//  GLOBAL ERROR HANDLERS
// =============================================================
app.use((req, res) =>
  res.status(404).json({ success: false, message: `${req.method} ${req.path} not found.` })
);
app.use((err, _req, res, _next) => {
  console.error('[UNHANDLED]', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// =============================================================
//  START SERVER
// =============================================================
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, async () => {
  const dbType = process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'SQLite (local)';
  console.log(`
╔══════════════════════════════════════════════╗
║  Cloud Bass Rent Management — API Server     ║
║  Port: ${PORT}  |  DB: ${dbType}               ║
╚══════════════════════════════════════════════╝
`);
  try {
    await prisma.$connect();
    console.log('  ✅  Database connected via Prisma');
    startRentEngineScheduler();
    console.log('  ✅  Rent engine scheduler running');
    console.log('  ℹ   WhatsApp: lazy-loaded on first /api/whatsapp request\n');
  } catch (e) {
    console.error('  ❌  DB connection failed during startup:', e.message);
    console.log('  ⚠️  Server will stay alive to respond to health checks, but DB operations will fail.');
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;

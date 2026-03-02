// =============================================================
//  Cloud Bass Rent Management — WhatsApp Router
//  File : server/routes/whatsapp.js
//
//  STRATEGY: Zero-Cost WhatsApp via whatsapp-web.js
//    - Uses WhatsApp Web automation (no paid API)
//    - Landlord scans a QR code ONCE on first boot
//    - Session is saved to disk (.wwebjs_auth/) and auto-restored
//      on every server restart — no re-scanning needed
//
//  ENDPOINTS:
//    GET  /api/whatsapp/status          → Check if WA is connected
//    GET  /api/whatsapp/qr              → Get the current QR code (base64)
//    POST /api/whatsapp/send-reminder/:paymentId → Send a rent reminder
//
//  DEPENDENCIES:
//    npm install whatsapp-web.js qrcode
//
//  HOW TO USE:
//    1. Import and mount in server.js:
//       import waRouter from './routes/whatsapp.js';
//       app.use('/api/whatsapp', authMiddleware, waRouter);
//    2. Start the server — a QR code appears in the terminal
//    3. Scan with the phone you want to send reminders FROM
//    4. Session is now saved; future restarts restore silently
// =============================================================

import express from 'express';
import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const { Client, LocalAuth, MessageMedia } = pkg;
const router = express.Router();

// ── Prisma singleton ──────────────────────────────────────────
const prisma = new PrismaClient();

// =============================================================
//  WHATSAPP CLIENT — Module-Level Singleton
//
//  We create ONE Client instance for the entire process lifetime.
//  This object is shared across all incoming HTTP requests via
//  the module's variable scope (Node.js module caching ensures
//  this file is only executed once).
// =============================================================

/** The raw base64 QR string — stored so the /qr endpoint can serve it */
let currentQR = null;

/** Simple state machine: 'INITIALIZING' | 'QR_READY' | 'CONNECTED' | 'DISCONNECTED' */
let clientStatus = 'INITIALIZING';

const waClient = new Client({
    // LocalAuth saves the session to disk (default path: ./.wwebjs_auth/)
    // This means the landlord only needs to scan the QR code ONCE.
    authStrategy: new LocalAuth({
        dataPath: process.env.WWEBJS_SESSION_PATH || './.wwebjs_auth',
    }),

    puppeteer: {
        // On Linux servers (Render.com) you MUST set headless: true
        // and pass these args to avoid sandbox permission errors.
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
        ],
    },
});

// =============================================================
//  WHATSAPP CLIENT EVENTS
// =============================================================

/**
 * 'qr' — Fired when a new QR code is ready for scanning.
 * We convert it to base64 so the frontend (or terminal) can display it.
 * Once the phone scans it, this event is NOT fired again until
 * the session expires or is manually cleared.
 */
waClient.on('qr', async (qr) => {
    clientStatus = 'QR_READY';
    currentQR = qr;

    // Print QR to terminal for local development convenience
    try {
        const { default: qrcode } = await import('qrcode-terminal');
        qrcode.generate(qr, { small: true });
    } catch {
        // qrcode-terminal is optional; the /qr endpoint still works without it
    }

    console.log('\n[WhatsApp] 📱 QR code ready — scan with your phone.');
    console.log('[WhatsApp]    Or visit GET /api/whatsapp/qr for a base64 PNG.\n');
});

/**
 * 'ready' — Fired once the session is authenticated and the
 * WhatsApp Web connection is fully established.
 */
waClient.on('ready', () => {
    clientStatus = 'CONNECTED';
    currentQR = null; // QR is no longer needed
    console.log('[WhatsApp] ✅ Client is ready and connected.\n');
});

/**
 * 'authenticated' — Fired when credentials are loaded from disk
 * (i.e., no QR scan needed on this boot).
 */
waClient.on('authenticated', () => {
    console.log('[WhatsApp] 🔐 Session restored from disk (no QR scan required).');
});

/**
 * 'auth_failure' — Fired if the saved session is invalid/expired.
 * The client will emit a new 'qr' event for re-authentication.
 */
waClient.on('auth_failure', (msg) => {
    clientStatus = 'DISCONNECTED';
    console.error('[WhatsApp] ❌ Authentication failed:', msg);
    console.error('[WhatsApp]    Delete .wwebjs_auth/ and restart to re-scan QR.');
});

/**
 * 'disconnected' — Fired when the connection drops.
 * The client will attempt to reconnect automatically.
 */
waClient.on('disconnected', (reason) => {
    clientStatus = 'DISCONNECTED';
    console.warn('[WhatsApp] ⚠ Disconnected. Reason:', reason);
});

// ── Initialize the client (non-blocking) ─────────────────────
// This starts the Puppeteer browser and the QR/session flow.
// Errors here are logged but won't crash the server.
waClient.initialize().catch((err) => {
    console.error('[WhatsApp] ❌ Client initialization failed:', err.message);
    clientStatus = 'DISCONNECTED';
});

// =============================================================
//  HELPER: formatPhoneNumber
//
//  Converts an Indian mobile number to the WhatsApp Chat ID format.
//  WhatsApp requires: [countryCode][number]@c.us
//  Examples:
//    "9876543210"   → "919876543210@c.us"
//    "+919876543210"→ "919876543210@c.us"
//    "09876543210"  → "919876543210@c.us"
//
//  @param {string} rawPhone - Phone number (any common format)
//  @returns {string} WhatsApp Chat ID
// =============================================================
function formatPhoneNumber(rawPhone) {
    // Remove all non-digit characters
    let digits = rawPhone.replace(/\D/g, '');

    // Strip leading 0 (common for Indian numbers entered locally)
    if (digits.startsWith('0')) {
        digits = digits.slice(1);
    }

    // Add country code 91 (India) if not already present
    if (!digits.startsWith('91') || digits.length === 10) {
        digits = `91${digits.slice(-10)}`; // Always take last 10 digits + 91
    }

    return `${digits}@c.us`;
}

// =============================================================
//  HELPER: buildReminderMessage
//
//  Produces the WhatsApp message string for a rent reminder.
//  Uses WhatsApp's native bold (*text*) and emoji formatting.
//
//  @param {object} params
//  @param {string} params.tenantName
//  @param {string} params.unitNumber
//  @param {string} params.propertyName
//  @param {number|string} params.amountDue
//  @param {Date|string}   params.dueDate
//  @param {Date|string}   params.rentMonth
//  @param {string} params.landlordName
//  @returns {string}
// =============================================================
function buildReminderMessage({ tenantName, unitNumber, propertyName, amountDue, dueDate, rentMonth, landlordName }) {
    // Format currency in Indian style
    const amount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amountDue);

    // Format dates in DD Month YYYY style
    const fmt = (d) => new Intl.DateTimeFormat('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(d));

    const rentMonthLabel = new Intl.DateTimeFormat('en-IN', {
        month: 'long', year: 'numeric',
    }).format(new Date(rentMonth));

    return (
        `Hello ${tenantName} 👋,

This is a friendly reminder for your rent for *${rentMonthLabel}*.

🏠 *Property Details*
   • Unit     : ${unitNumber}
   • Building : ${propertyName}

💰 *Payment Details*
   • Amount Due : *${amount}*
   • Due Date   : *${fmt(dueDate)}*

Please arrange the payment at your earliest convenience.

If you have already made the payment, kindly ignore this message or inform us with the payment reference.

Thank you for your cooperation 🙏

Regards,
*${landlordName}*
_Cloud Bass Rent Management_`
    );
}

// =============================================================
//  MIDDLEWARE: requireWAConnected
//
//  Rejects requests to send-reminder if WhatsApp isn't ready.
//  Applied per-route rather than globally so /status and /qr
//  remain accessible even when disconnected.
// =============================================================
function requireWAConnected(req, res, next) {
    if (clientStatus !== 'CONNECTED') {
        return res.status(503).json({
            success: false,
            message: 'WhatsApp client is not connected.',
            status: clientStatus,
            hint: clientStatus === 'QR_READY'
                ? 'Please scan the QR code at GET /api/whatsapp/qr'
                : 'Restart the server and scan the QR code.',
        });
    }
    next();
}

// =============================================================
//  ROUTE: GET /api/whatsapp/status
//
//  Returns the current WhatsApp connection status.
//  USE ON FRONTEND: poll this on page load to show a
//  "WhatsApp Connected ✅" or "Scan QR to connect" badge.
//
//  Response:
//    { success, status, connected, message }
// =============================================================
router.get('/status', (req, res) => {
    const connected = clientStatus === 'CONNECTED';
    return res.json({
        success: true,
        status: clientStatus,      // 'INITIALIZING' | 'QR_READY' | 'CONNECTED' | 'DISCONNECTED'
        connected,
        message: connected
            ? 'WhatsApp is connected and ready to send messages.'
            : `WhatsApp is ${clientStatus.toLowerCase()}. ${clientStatus === 'QR_READY' ? 'Please scan the QR code.' : 'Restart the server to reconnect.'}`,
    });
});

// =============================================================
//  ROUTE: GET /api/whatsapp/qr
//
//  Returns the current QR code as a base64 PNG data URL.
//  Display this in an <img> tag on the settings page so the
//  landlord can scan it without accessing the server terminal.
//
//  Response:
//    204 No Content      — if already connected (no QR needed)
//    200 { qrDataUrl }   — if QR is ready to scan
//    503                 — if client hasn't initialized yet
// =============================================================
router.get('/qr', async (req, res) => {
    if (clientStatus === 'CONNECTED') {
        return res.status(204).json({
            success: true,
            message: 'WhatsApp is already connected. No QR code needed.',
        });
    }

    if (!currentQR) {
        return res.status(503).json({
            success: false,
            message: 'QR code not yet available. Client is initializing — try again in a few seconds.',
            status: clientStatus,
        });
    }

    try {
        // Convert the raw QR string to a base64 PNG (works in <img src="...">)
        const qrDataUrl = await QRCode.toDataURL(currentQR, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2,
        });

        return res.json({
            success: true,
            qrDataUrl,            // Rendered as: <img src={qrDataUrl} />
            expiresIn: '~20 seconds (WhatsApp QR codes auto-expire)',
        });
    } catch (err) {
        console.error('[WhatsApp /qr]', err.message);
        return res.status(500).json({ success: false, message: 'Failed to generate QR image.' });
    }
});

// =============================================================
//  ROUTE: POST /api/whatsapp/send-reminder/:paymentId
//
//  Sends a pre-formatted WhatsApp rent reminder to the tenant
//  linked to the given RentPayment record.
//
//  Path param:
//    :paymentId — UUID of a RentPayment record
//
//  Guards:
//    - requireWAConnected middleware
//    - Payment must exist and belong to this landlord
//    - Payment status must be PENDING or OVERDUE
//
//  Side effects:
//    - Sets reminder_sent = true and reminder_sent_at = now()
//
//  Response:
//    { success, message, sentTo, reminderCount }
// =============================================================
router.post(
    '/send-reminder/:paymentId',
    requireWAConnected,             // Guard: WA must be connected
    async (req, res) => {
        const { paymentId } = req.params;

        // req.landlord is injected by authMiddleware (JWT verification)
        // in server.js before mounting this router
        const landlordId = req.landlord?.id;

        // ── Step 1: Fetch payment with all related data ─────────────
        let payment;
        try {
            payment = await prisma.rentPayment.findFirst({
                where: {
                    id: paymentId,
                    unit: {
                        property: { landlord_id: landlordId },
                    },
                },
                include: {
                    tenant: true,
                    unit: {
                        include: {
                            property: {
                                include: { landlord: true },
                            },
                        },
                    },
                },
            });
        } catch (err) {
            console.error('[WhatsApp /send-reminder] DB error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error fetching payment.' });
        }

        // ── Step 2: Validate the payment record ─────────────────────
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found or does not belong to your account.',
            });
        }

        if (payment.status === 'PAID' || payment.status === 'WAIVED') {
            return res.status(400).json({
                success: false,
                message: `Cannot send a reminder for a ${payment.status} payment.`,
                status: payment.status,
            });
        }

        // ── Step 3: Resolve the WhatsApp number to call ─────────────
        // Preference: tenant.whatsapp_no → fallback: tenant.phone
        const rawPhone = payment.tenant.whatsapp_no || payment.tenant.phone;
        if (!rawPhone) {
            return res.status(400).json({
                success: false,
                message: 'Tenant has no phone/WhatsApp number on record.',
            });
        }
        const chatId = formatPhoneNumber(rawPhone);

        // ── Step 4: Build the message string ────────────────────────
        const message = buildReminderMessage({
            tenantName: payment.tenant.full_name,
            unitNumber: payment.unit.unit_number,
            propertyName: payment.unit.property.name,
            amountDue: payment.amount_due,
            dueDate: payment.due_date,
            rentMonth: payment.rent_month,
            landlordName: payment.unit.property.landlord?.full_name || 'Your Landlord',
        });

        // ── Step 5: Send via WhatsApp ────────────────────────────────
        try {
            // Check if the number exists on WhatsApp before sending
            // This prevents errors for non-WA numbers
            const isRegistered = await waClient.isRegisteredUser(chatId);
            if (!isRegistered) {
                return res.status(400).json({
                    success: false,
                    message: `The number ${rawPhone} is not registered on WhatsApp.`,
                    chatId,
                });
            }

            await waClient.sendMessage(chatId, message);
            console.log(
                `[WhatsApp] ✅ Reminder sent to ${payment.tenant.full_name} (${rawPhone}) for payment ${paymentId}`
            );

        } catch (err) {
            console.error('[WhatsApp /send-reminder] Send failed:', err.message);
            return res.status(502).json({
                success: false,
                message: 'WhatsApp message delivery failed.',
                error: err.message,
            });
        }

        // ── Step 6: Update the payment record ───────────────────────
        // Record that a reminder was sent so the UI can reflect it
        try {
            const updated = await prisma.rentPayment.update({
                where: { id: paymentId },
                data: {
                    reminder_sent: true,
                    reminder_sent_at: new Date(),
                },
            });

            return res.json({
                success: true,
                message: `WhatsApp reminder sent successfully to ${payment.tenant.full_name}.`,
                sentTo: rawPhone,
                chatId,
                reminderCount: updated.reminder_sent_at ? 1 : 0, // Extend to counter in Phase 2
                paymentStatus: payment.status,
            });

        } catch (err) {
            // The message was sent; only the DB update failed.
            // Return a partial success so the frontend is informed.
            console.error('[WhatsApp /send-reminder] DB update failed:', err.message);
            return res.status(207).json({
                success: true,
                message: 'WhatsApp message sent, but failed to update the reminder record in the database.',
                warning: err.message,
                sentTo: rawPhone,
            });
        }
    }
);

// =============================================================
//  EXPORT: router + waClient
//  Export waClient so server.js can gracefully shut it down
//  on process SIGTERM (clean disconnection from WA servers).
// =============================================================
export { router as default, waClient };

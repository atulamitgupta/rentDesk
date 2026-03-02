# 📋 PRD — Cloud Bass Rent Management (MVP)
**Version:** 2.0 | **Date:** 2026-03-01 | **Status:** Active

--- 

## 1. Executive Summary

**Cloud Bass Rent Management** is a zero-cost, mobile-first SaaS platform for independent landlords to:
- Manage properties, units, and tenants from a single dashboard
- Automatically generate monthly rent ledger entries via a scheduled cron job
- Send WhatsApp payment reminders with one tap — no paid API required

**Design Principle:** A landlord standing outside their property block should be able to see who has paid, who hasn't, and fire off a WhatsApp reminder — in under 30 seconds, on a mobile screen.

---

## 2. Problem Statement

| Pain Point | Current Workaround | RentDesk Solution |
|---|---|---|
| Manually calculating rent each month | Excel / paper | Auto-generated rent records on 1st of month |
| No visibility into who has paid | Calling tenants individually | Live ledger with PAID / PENDING / OVERDUE status |
| Sending reminders is tedious | Typing messages manually in WhatsApp | One-click templated WhatsApp reminder |
| Tenant records scattered | WhatsApp chats, notes, memory | Centralized tenant profile with move-in date |
| No rental history | Paper slips | Full payment history per tenant |

---

## 3. Goals

| Goal | Success Metric |
|---|---|
| Automate monthly rent creation | 0 manual entries needed after tenant setup |
| Centralize landlord data | All properties visible in one screen |
| Fast WhatsApp reminder dispatch | < 3 taps on mobile to send reminder |
| Zero-cost operation | ₹0/month infrastructure cost |
| SaaS-ready architecture | `landlord_id` on every table for future multi-tenancy |

---

## 4. User Personas

### 4.1 Primary — Ramesh (The Landlord, 54)
> *"I have 3 buildings and 18 tenants. I spend 3 days every month just chasing rent."*

- Accesses system from **Android phone** while at his properties
- Not tech-savvy — needs an interface that's **instantly understandable**
- Uses WhatsApp constantly — it's his primary communication channel
- **Key Jobs-to-be-done:**
  1. At a glance: who hasn't paid this month?
  2. Send a reminder without typing anything
  3. Mark a payment when tenant pays cash

### 4.2 Secondary — Priya (The Tenant, 27)
> *"I just need a receipt and a reminder before the due date."*

- **Interaction with MVP:** Passive — only receives WhatsApp messages
- **Future Phase:** Tenant portal to view dues and pay online

---

## 5. MVP Feature Scope

> **Iron Rule:** If a feature is not listed here as ✅, it is **NOT** being built now.

### 5.1 ✅ Authentication (Single Landlord)
- Email + Password login
- JWT-based session (7-day expiry)
- Landlord profile: name, email, phone, WhatsApp number
- Single seeded landlord account for MVP (no self-registration)

### 5.2 ✅ Property Management (CRUD)
| Field | Type | Notes |
|---|---|---|
| Name | String | e.g., "Sunshine Apartments" |
| Address | String | Full street address |
| City | String | |
| Type | Enum | RESIDENTIAL / COMMERCIAL / MIXED |

- List all properties on dashboard
- Add, Edit, Delete property
- `landlord_id` FK on every property (SaaS-ready)

### 5.3 ✅ Unit Management (CRUD)
| Field | Type | Notes |
|---|---|---|
| Unit Number | String | e.g., "Flat 101", "Shop A" |
| Floor | String | Optional |
| Monthly Rent | Decimal | In Indian Rupees (₹) |
| Status | Enum | OCCUPIED / VACANT |

- Units belong to a Property
- Cannot delete an OCCUPIED unit
- Status auto-updates when tenant is assigned/vacated

### 5.4 ✅ Tenant Management (CRUD)
| Field | Type | Notes |
|---|---|---|
| Full Name | String | |
| Phone | String | WhatsApp-capable number |
| WhatsApp No | String | Defaults to Phone |
| Move-in Date | Date | |
| Security Deposit | Decimal | ₹ |
| Notes | Text | Optional |

- One active tenant per unit at any time
- "Vacate" tenant: marks `is_active = false`, unit → VACANT
- Tenant history is preserved (never hard-deleted)

### 5.5 ✅ Automated Rent Record Generation
- **Node-cron job** runs at `00:00` on the **1st of every month**
- For every OCCUPIED unit: creates one `rent_records` entry with:
  - `amount_due` = unit's `monthly_rent`
  - `due_date` = 5th of the current month
  - `status` = `PENDING`
- **Idempotency**: skips units that already have a record for the current month
- **Manual trigger**: Landlord can click "Generate Rent" from dashboard if needed

### 5.6 ✅ Rent Ledger & Payment Tracking
- View all rent records (filter: month/year, status, property)
- **Mark as Paid**: logs `payment_date`, `amount_paid`, optional `payment_note`
- Status lifecycle: `PENDING` → `PAID` or `OVERDUE`
- **Overdue auto-flag**: daily cron flips PENDING entries to OVERDUE after `due_date` passes
- Color-coded status badges on every record

### 5.7 ✅ WhatsApp Reminder (Zero-Cost)
- Uses `whatsapp-web.js` (headless WhatsApp Web automation)
- Landlord scans a QR code once; session persists to disk
- One-click "Send Reminder" per rent record (PENDING or OVERDUE only)
- Message template:
  ```
  Hello [Tenant Name] 👋,
  
  A friendly reminder that your rent of *₹[Amount]* for 
  *[Unit No], [Property Name]* is due on *[Due Date]*.
  
  Please arrange payment at your earliest convenience.
  
  Thank you 🙏
  — [Landlord Name]
  ```
- Updates `reminder_sent = true` after sending

### 5.8 ✅ Dashboard Summary
- Total Properties / Units / Occupied / Vacant (stat cards)
- This Month: Total Due (₹) / Collected (₹) / Outstanding (₹)
- Overdue tenant list with "Send Reminder" shortcut
- Collection progress bar (% of monthly rent collected)

---

## 6. Explicitly Out of Scope (MVP)

| Feature | When |
|---|---|
| ❌ Tenant self-service portal | Phase 2 |
| ❌ Online payment (Razorpay/Stripe) | Phase 2 |
| ❌ PDF rent receipts | Phase 2 |
| ❌ Automated WhatsApp (no-click) | Phase 2 (WA Business API) |
| ❌ Email / SMS reminders | Phase 2 |
| ❌ Multi-landlord SaaS billing | Phase 3 |
| ❌ Mobile app | Phase 3 |
| ❌ Maintenance tracking | Phase 2 |

---

## 7. Design System

| Token | Value |
|---|---|
| Primary Orange | `#F97316` |
| Warm White | `#F8F8F7` |
| Dark Charcoal | `#1C1C1E` |
| Success Green | `#22C55E` |
| Danger Red | `#EF4444` |
| Border | `#E5E7EB` |
| Font | Inter (Google Fonts) |

- **Framework:** React 19 + Vite + Tailwind CSS
- **Icons:** Lucide React
- **Mobile-First:** All layouts designed for 375px → scale up to desktop
- **Component Pattern:** Functional components, custom hooks, `cn()` utility

---

## 8. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Mobile usability | All features usable on 375px screen |
| Page Load | < 2s |
| API Response | < 500ms (CRUD), < 3s (WhatsApp send) |
| Cost | ₹0/month |
| Hosting (Frontend) | Vercel (Free) |
| Hosting (Backend) | Render.com (Free) |
| Database | Neon.tech PostgreSQL (Free — 0.5GB) |
| Security | JWT, bcrypt, Prisma parameterized queries |

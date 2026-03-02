# 🗓️ Development Roadmap — RentDesk MVP
**Duration:** 4 Weeks | **Start Date:** 2026-03-01 | **Target MVP:** 2026-03-28

---

## Overview

```
Week 1: Foundation & Auth          [██████████░░░░░░░░░░░░░░░░░░░░] 25%
Week 2: Core Data CRUD             [████████████████████░░░░░░░░░░] 50%
Week 3: Rent Generation Logic      [██████████████████████████████] 75%
Week 4: WhatsApp & Deployment      [████████████████████████████  ] 100%
```

---

## ✅ Week 1: Project Setup & Authentication
**Goal:** A running full-stack skeleton with a working login system.

### Day 1-2: Project Scaffold & Environment

#### Backend Setup
```bash
# In D:\react\rentdesk\server
npm init -y
npm install express prisma @prisma/client jsonwebtoken bcryptjs \
            cors dotenv express-validator node-cron
npm install -D nodemon
npx prisma init
```

**Tasks:**
- [ ] Initialize `server/` with Express app (`app.js`, `index.js`)
- [ ] Configure `.env` with `DATABASE_URL` and `JWT_SECRET`
- [ ] Copy Prisma schema from `Technical_Architecture.md` → `server/prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name init` to create DB tables
- [ ] Run `npx prisma generate` to generate Prisma client
- [ ] Seed one landlord record (email + bcrypt hashed password) via `prisma/seed.js`
- [ ] Add `"prisma": { "seed": "node prisma/seed.js" }` to `package.json`
- [ ] Run `npx prisma db seed`

#### Frontend Setup
```bash
# In D:\react\rentdesk\client
npm create vite@latest . -- --template react
npm install axios react-router-dom react-hot-toast lucide-react recharts
```

**Tasks:**
- [ ] Set up `vite.config.js` with proxy: `/api → http://localhost:5000`
- [ ] Create `src/index.css` — Orange + Warm White global theme variables
- [ ] Install and configure Google Fonts (Inter) in `index.html`
- [ ] Create `src/api/axiosClient.js` — base URL + JWT token interceptor

---

### Day 3-4: Authentication System

#### Backend
- [ ] **POST `/api/auth/login`**
  - Accept `email`, `password`
  - Validate with `express-validator`
  - Find landlord by email, compare bcrypt hash
  - Return JWT token + landlord profile (no password hash)
- [ ] **GET `/api/auth/me`** (protected)
  - Verify JWT from `Authorization: Bearer <token>` header
  - Return current landlord object
- [ ] **PATCH `/api/auth/profile`** (protected)
  - Update `full_name`, `phone`, `whatsapp_no`
- [ ] Create `auth.middleware.js` — JWT verification middleware for all protected routes

#### Frontend
- [ ] Create `src/context/AuthContext.jsx`
  - `login()`, `logout()`, `user`, `isAuthenticated` state
  - Persist token in `localStorage`
  - Auto-restore session on page load
- [ ] Create `src/pages/Login.jsx`
  - Branded login form (Orange + Warm White)
  - Email/password fields, loading state, error toast
- [ ] Create `src/components/Layout/AppLayout.jsx`
  - Sidebar with navigation links
  - Top header with landlord name + logout button
- [ ] Set up `App.jsx` with React Router:
  - Public route: `/login`
  - Protected routes (wrapped in `<ProtectedRoute>`): all others

---

### Day 5: Testing & Polish — Week 1

- [ ] Test complete login → JWT stored → protected page access flow
- [ ] Test token expiry behavior (redirect to login)
- [ ] Add 404 Not Found page
- [ ] Verify Prisma DB connection health via a `/api/health` endpoint
- [ ] Commit: `git commit -m "feat: project scaffold + auth system"`

**✅ Week 1 Deliverable:** Landlord can log in, see a protected layout, and log out.

---

## ✅ Week 2: Core Data CRUD
**Goal:** Full CRUD for Properties, Units, and Tenants with a working dashboard shell.

### Day 6-7: Properties Module

#### Backend
- [ ] `GET /api/properties` — List properties for logged-in landlord
- [ ] `POST /api/properties` — Create (name, address, city, type)
- [ ] `GET /api/properties/:id` — Get property + its units summary
- [ ] `PATCH /api/properties/:id` — Update
- [ ] `DELETE /api/properties/:id` — Delete (cascade deletes units)
- [ ] Apply `authMiddleware` to all property routes
- [ ] Ensure `landlord_id` is always sourced from JWT (never from request body)

#### Frontend
- [ ] `src/pages/Properties.jsx`
  - Card grid view of all properties
  - "Add Property" button → opens `<Modal>` with form
  - Edit / Delete actions per card
  - Empty state illustration when no properties exist
- [ ] `src/components/common/Modal.jsx` — reusable with title + children
- [ ] `src/components/common/StatCard.jsx` — used throughout dashboard

---

### Day 8-9: Units & Tenants Module

#### Backend — Units
- [ ] `GET /api/properties/:propertyId/units` — List units
- [ ] `POST /api/properties/:propertyId/units` — Create unit
- [ ] `PATCH /api/units/:id` — Update unit (rent amount, floor, type, status)
- [ ] `DELETE /api/units/:id` — Delete unit (only if VACANT, else 400 error)

#### Backend — Tenants
- [ ] `GET /api/tenants` — List all active tenants (joined with unit + property name)
- [ ] `POST /api/tenants` — Assign tenant to unit
  - Validate: unit must exist and be VACANT
  - On success: set `unit.status = OCCUPIED`
- [ ] `GET /api/tenants/:id` — Get tenant + unit + ledger history
- [ ] `PATCH /api/tenants/:id` — Update tenant details
- [ ] `DELETE /api/tenants/:id` — Vacate
  - Set `tenant.is_active = false`
  - Set `unit.status = VACANT`
  - Do NOT delete the tenant record (preserve ledger history)

#### Frontend
- [ ] `src/pages/Units.jsx`
  - Accessible from property detail view
  - Color-coded status badges: OCCUPIED (orange), VACANT (green)
  - Form to add/edit units with monthly rent field (₹)
- [ ] `src/pages/Tenants.jsx`
  - Table view with search bar (filter by name/unit)
  - "Assign Tenant" form — property selector → unit selector (auto-filter by VACANT)
  - "Vacate" button with confirmation dialog

---

### Day 10: Dashboard & Week 2 Polish

#### Backend — Dashboard
- [ ] `GET /api/dashboard` returns:
  ```json
  {
    "totalProperties": 3,
    "totalUnits": 12,
    "occupiedUnits": 9,
    "vacantUnits": 3,
    "thisMonth": {
      "totalDue": 90000,
      "totalCollected": 45000,
      "outstanding": 45000
    },
    "overdueCount": 2
  }
  ```

#### Frontend
- [ ] `src/pages/Dashboard.jsx`
  - 4 StatCards (Properties, Units, Occupied, Vacant)
  - Financial summary bar (Due / Collected / Outstanding)
  - Bar chart (Recharts): Monthly collection trend (last 6 months)
  - Overdue alert list

- [ ] Commit: `git commit -m "feat: properties, units, tenants CRUD + dashboard"`

**✅ Week 2 Deliverable:** Landlord can fully manage properties, units, and tenants.

---

## ✅ Week 3: Rent Generation Logic
**Goal:** Automated and manual rent generation + full ledger tracking UI.

### Day 11-12: Rent Generation Service

#### Backend
- [ ] Create `src/services/rentGeneration.service.js`
  ```javascript
  // Core idempotent function
  async function generateRentForMonth(year, month) { ... }
  ```
  - Query all `OCCUPIED` units with active tenant
  - For each: check if ledger entry exists via `@@unique([unit_id, rent_month])`
  - Create new ledger entries for units without one
  - Return `{ created: N, skipped: M }` summary

- [ ] `POST /api/rent-ledger/generate`
  - Optional body: `{ year, month }` (defaults to current month)
  - Calls the generation service
  - Protected by `authMiddleware`

- [ ] Create `src/jobs/monthlyRentJob.js`
  ```javascript
  // Runs at 00:00 on 1st of every month
  cron.schedule('0 0 1 * *', generateRentForMonth);
  ```

- [ ] Create `src/jobs/overdueCheckJob.js`
  ```javascript
  // Runs daily at 08:00 AM
  // Marks PENDING entries with past due_date as OVERDUE
  cron.schedule('0 8 * * *', checkAndMarkOverdue);
  ```

---

### Day 13-14: Rent Ledger CRUD & Payment Marking

#### Backend
- [ ] `GET /api/rent-ledger`
  - Query params: `month` (YYYY-MM), `status`, `propertyId`
  - Returns ledger entries joined with tenant name, unit number, property name
- [ ] `PATCH /api/rent-ledger/:id/pay`
  - Body: `{ payment_date, amount_paid, payment_note }`
  - Sets `status = 'PAID'`
  - Validates `amount_paid >= amount_due` (or allow partial — flag for future)
- [ ] `PATCH /api/rent-ledger/:id/waive`
  - Sets `status = 'WAIVED'` with a note

#### Frontend
- [ ] `src/pages/RentLedger.jsx`
  - Month picker (default: current month)
  - Filter by: Status (All / Pending / Paid / Overdue), Property
  - Table columns: Tenant | Unit | Property | Amount | Due Date | Status | Actions
  - **"Mark as Paid"** → opens modal: payment date + amount + note
  - **"Send Reminder"** → calls WhatsApp API (disabled if WA not connected)
  - Status badges with color coding:
    - 🟠 PENDING, 🔴 OVERDUE, 🟢 PAID, ⚫ WAIVED
  - "Generate Rent" button at top → triggers manual generation with confirmation

---

### Day 15: Testing & Week 3 Polish

- [ ] Test cron job manually by calling the service directly
- [ ] Test idempotency: running generate twice should not create duplicates
- [ ] Test overdue marking logic with backdated due dates
- [ ] Add loading skeletons to Rent Ledger table
- [ ] Commit: `git commit -m "feat: rent generation cron + ledger tracking + payment marking"`

**✅ Week 3 Deliverable:** System automatically generates rent every month; landlord can mark payments.

---

## ✅ Week 4: WhatsApp Integration & Deployment
**Goal:** WhatsApp reminders working, app deployed to free hosting.

### Day 16-17: WhatsApp Integration

#### Backend
```bash
npm install whatsapp-web.js qrcode-terminal
```

- [ ] Create `src/services/whatsapp.service.js`
  - Initialize `new Client({ authStrategy: new LocalAuth() })`
  - On `qr` event: print QR to terminal
  - On `ready` event: log "WhatsApp Client Ready"
  - Export `sendMessage(phone, message)` function
  - Export `getStatus()` — returns `{ connected: boolean }`
  - Start client in `index.js` on server boot

- [ ] `GET /api/whatsapp/status`
  - Returns `{ connected: true/false }`

- [ ] `POST /api/whatsapp/send-reminder/:ledgerId`
  - Fetch ledger → tenant → unit → property
  - Check WA client is ready (else 503 error)
  - Format message:
    ```
    Hello [Name], 🏠
    
    This is a reminder for the rent due on [Date].
    
    📍 Unit: [Unit No], [Property Name]
    💰 Amount Due: ₹[Amount]
    
    Kindly arrange payment at your earliest convenience.
    
    Thank you,
    [Landlord Name]
    ```
  - Send via `client.sendMessage()`
  - Update `reminder_sent = true`, `reminder_sent_at = now()`
  - Return success response

#### Frontend
- [ ] Add `src/pages/WhatsApp.jsx`
  - Show connection status badge (Connected / Not Connected)
  - Instructions: "Scan QR code from server terminal on first run"
  - "Check Status" refresh button
- [ ] "Send Reminder" button in RentLedger table
  - Disabled if `reminder_sent` is already true (show "Sent ✓")
  - Shows loading spinner while sending
  - Success toast on completion

---

### Day 18-19: Deployment Setup

#### Database (Neon.tech — Free)
- [ ] Create account at https://neon.tech
- [ ] Create new project: `rentdesk`
- [ ] Copy connection string to `DATABASE_URL`
- [ ] Run `npx prisma migrate deploy` against production DB
- [ ] Run seed script against production DB

#### Backend (Render.com — Free)
- [ ] Push `server/` to GitHub repository
- [ ] Create new Render Web Service
  - Build Command: `npm install && npx prisma generate`
  - Start Command: `node index.js`
  - Environment variables: set all from `.env`
- [ ] Note: Free tier spins down after 15min inactivity (acceptable for MVP)
- [ ] Test all API endpoints against deployed backend

#### Frontend (Vercel — Free)
- [ ] Push `client/` to GitHub repository
- [ ] Create new Vercel project
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment Variables: `VITE_API_BASE_URL=https://your-render-app.onrender.com`
- [ ] Update `axiosClient.js` to use `import.meta.env.VITE_API_BASE_URL`
- [ ] Deploy and test end-to-end

---

### Day 20: Final Testing & Documentation

- [ ] End-to-end test: Login → Add Property → Add Units → Add Tenant → Generate Rent → Mark Paid → Send WhatsApp
- [ ] Test on mobile browser (responsive check)
- [ ] Fix any critical UI/UX bugs
- [ ] Update `README.md` with:
  - Project description & screenshots
  - Local setup instructions
  - WhatsApp QR setup guide
  - Deployment guide

- [ ] Final commit: `git commit -m "feat: MVP complete — WhatsApp + deployment"`

**✅ Week 4 Deliverable:** Fully deployed, working MVP accessible via public URL.

---

## 📦 MVP Completion Checklist

| Module | Feature | Status |
|---|---|---|
| Auth | Login / Logout / JWT | ⬜ Pending |
| Auth | Protected routes | ⬜ Pending |
| Properties | CRUD | ⬜ Pending |
| Units | CRUD + Status | ⬜ Pending |
| Tenants | CRUD + Vacate | ⬜ Pending |
| Dashboard | Summary stats + chart | ⬜ Pending |
| Rent Gen | Monthly cron job | ⬜ Pending |
| Rent Gen | Manual trigger | ⬜ Pending |
| Rent Gen | Idempotency guard | ⬜ Pending |
| Ledger | View + filter | ⬜ Pending |
| Ledger | Mark as Paid | ⬜ Pending |
| Ledger | Overdue auto-flag | ⬜ Pending |
| WhatsApp | QR auth + session | ⬜ Pending |
| WhatsApp | Send reminder | ⬜ Pending |
| WhatsApp | Status check | ⬜ Pending |
| Deploy | Neon.tech DB | ⬜ Pending |
| Deploy | Render.com backend | ⬜ Pending |
| Deploy | Vercel frontend | ⬜ Pending |

---

## 🔮 Phase 2 Backlog (Post-MVP)

| Feature | Priority |
|---|---|
| Tenant self-service portal | High |
| PDF rent receipt generation | High |
| Online payment link (Razorpay) | High |
| Email reminders | Medium |
| Automated WhatsApp (WA Business API) | Medium |
| Maintenance request tracking | Medium |
| Multi-landlord SaaS billing | Low |
| Mobile app (React Native) | Low |

---

## 💰 Cost Summary

| Service | Plan | Cost |
|---|---|---|
| Neon.tech (PostgreSQL) | Free tier (0.5 GB) | ₹0/month |
| Render.com (Node.js) | Free tier | ₹0/month |
| Vercel (React) | Free tier | ₹0/month |
| whatsapp-web.js | Open source | ₹0/month |
| **Total** | | **₹0/month** |

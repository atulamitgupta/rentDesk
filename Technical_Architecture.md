# 🏗️ Technical Architecture — Cloud Bass Rent Management
**Version:** 2.0 | **Date:** 2026-03-01

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT  (Vercel)                          │
│          React 19 + Vite + Tailwind CSS + Lucide React           │
│   Mobile-First | Orange #F97316 | Warm White #F8F8F7 Theme       │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTPS / REST  (JWT in Authorization header)
┌──────────────────────────▼──────────────────────────────────────┐
│                       SERVER  (Render.com)                        │
│                  Node.js 20 + Express + Prisma                   │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────────────┐   │
│  │ JWT Auth   │  │  node-cron  │  │   whatsapp-web.js      │   │
│  │ Middleware │  │  Scheduler  │  │   (QR Session Persist) │   │
│  └────────────┘  └─────────────┘  └────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │  Prisma ORM (Connection Pooling)
┌──────────────────────────▼──────────────────────────────────────┐
│                    DATABASE  (Neon.tech)                          │
│                     PostgreSQL 15                                 │
│  landlords │ properties │ units │ tenants │ rent_records          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Folder Structure

```
rentdesk/                                ← Monorepo root
│
├── client/                              ← Vite + React 19 Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/                         ← Centralized API layer
│   │   │   ├── axiosClient.js           ← Base URL + JWT interceptor
│   │   │   ├── auth.api.js
│   │   │   ├── properties.api.js
│   │   │   ├── units.api.js
│   │   │   ├── tenants.api.js
│   │   │   ├── rentRecords.api.js
│   │   │   └── whatsapp.api.js
│   │   │
│   │   ├── components/                  ← Reusable UI components
│   │   │   ├── ui/                      ← Primitives
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Spinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── MobileNav.jsx        ← Bottom tab bar (mobile)
│   │   │   │   └── AppLayout.jsx
│   │   │   └── features/
│   │   │       ├── RentTable.jsx
│   │   │       ├── TenantCard.jsx
│   │   │       ├── PropertyCard.jsx
│   │   │       └── WhatsAppStatus.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/                       ← Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProperties.js
│   │   │   ├── useTenants.js
│   │   │   └── useRentRecords.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── Units.jsx
│   │   │   ├── Tenants.jsx
│   │   │   ├── RentLedger.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── cn.js                    ← Tailwind class merging utility
│   │   │   └── formatters.js            ← Currency, date formatters
│   │   │
│   │   ├── App.jsx                      ← Router root
│   │   ├── main.jsx
│   │   └── index.css                    ← Tailwind directives + custom globals
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                              ← Node.js + Express Backend
│   ├── prisma/
│   │   ├── schema.prisma                ← Single source of truth for DB
│   │   ├── seed.js                      ← Seeds 1 landlord account
│   │   └── migrations/                  ← Auto-generated by Prisma
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── properties.routes.js
│   │   │   ├── units.routes.js
│   │   │   ├── tenants.routes.js
│   │   │   ├── rentRecords.routes.js
│   │   │   ├── whatsapp.routes.js
│   │   │   └── dashboard.routes.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── properties.controller.js
│   │   │   ├── units.controller.js
│   │   │   ├── tenants.controller.js
│   │   │   ├── rentRecords.controller.js
│   │   │   ├── whatsapp.controller.js
│   │   │   └── dashboard.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js       ← Verifies JWT, injects req.landlord
│   │   │   └── validate.middleware.js  ← express-validator error handler
│   │   │
│   │   ├── services/
│   │   │   ├── whatsapp.service.js     ← Singleton WA client
│   │   │   └── rentGeneration.service.js
│   │   │
│   │   └── jobs/
│   │       ├── monthlyRentJob.js       ← Cron: 0 0 1 * *
│   │       └── overdueCheckJob.js      ← Cron: 0 8 * * *
│   │
│   ├── server.js                        ← Express app entry point
│   ├── .env
│   └── package.json
│
├── PRD_MVP.md
├── Technical_Architecture.md
├── Development_Roadmap.md
└── README.md
```

---

## 3. Database Schema — PostgreSQL

### 3.1 Entity Relationship Diagram

```
landlords (1)
    │
    └──< properties (N)  [landlord_id FK]
              │
              └──< units (N)  [property_id FK]
                       │
                       ├──── tenants (1)  [unit_id FK UNIQUE]
                       │
                       └──< rent_records (N)  [unit_id FK]
                                 │
                                 └──── tenants (N) [tenant_id FK]
```

### 3.2 Table Specifications

#### `landlords`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK, default uuid |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `password_hash` | TEXT | NOT NULL |
| `full_name` | VARCHAR(255) | NOT NULL |
| `phone` | VARCHAR(20) | |
| `whatsapp_no` | VARCHAR(20) | |
| `created_at` | TIMESTAMPTZ | default NOW() |
| `updated_at` | TIMESTAMPTZ | auto-updated |

#### `properties`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `landlord_id` | UUID | FK → landlords.id CASCADE |
| `name` | VARCHAR(255) | NOT NULL |
| `address` | TEXT | NOT NULL |
| `city` | VARCHAR(100) | NOT NULL |
| `type` | ENUM | RESIDENTIAL/COMMERCIAL/MIXED |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `units`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `property_id` | UUID | FK → properties.id CASCADE |
| `unit_number` | VARCHAR(50) | NOT NULL |
| `floor` | VARCHAR(20) | |
| `type` | ENUM | RESIDENTIAL/COMMERCIAL |
| `monthly_rent` | DECIMAL(10,2) | NOT NULL |
| `status` | ENUM | OCCUPIED/VACANT, default VACANT |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `tenants`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `unit_id` | UUID | FK → units.id RESTRICT, UNIQUE |
| `full_name` | VARCHAR(255) | NOT NULL |
| `phone` | VARCHAR(20) | NOT NULL |
| `whatsapp_no` | VARCHAR(20) | |
| `email` | VARCHAR(255) | |
| `move_in_date` | DATE | NOT NULL |
| `security_deposit` | DECIMAL(10,2) | default 0 |
| `is_active` | BOOLEAN | default true |
| `notes` | TEXT | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `rent_records`
| Column | Type | Constraints |
|---|---|---|
| `id` | UUID | PK |
| `unit_id` | UUID | FK → units.id RESTRICT |
| `tenant_id` | UUID | FK → tenants.id RESTRICT |
| `rent_month` | DATE | NOT NULL (stored as YYYY-MM-01) |
| `amount_due` | DECIMAL(10,2) | NOT NULL |
| `amount_paid` | DECIMAL(10,2) | default 0 |
| `due_date` | DATE | NOT NULL |
| `payment_date` | DATE | nullable |
| `status` | ENUM | PENDING/PAID/OVERDUE/WAIVED |
| `payment_note` | TEXT | nullable |
| `reminder_sent` | BOOLEAN | default false |
| `reminder_sent_at` | TIMESTAMPTZ | nullable |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| **UNIQUE** | | `(unit_id, rent_month)` — one record per unit per month |

---

## 4. REST API Contract

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get landlord profile |
| PATCH | `/api/auth/profile` | ✅ | Update profile |

### Properties
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/properties` | ✅ | List all |
| POST | `/api/properties` | ✅ | Create |
| GET | `/api/properties/:id` | ✅ | Get with units |
| PATCH | `/api/properties/:id` | ✅ | Update |
| DELETE | `/api/properties/:id` | ✅ | Delete |

### Units
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/properties/:pid/units` | ✅ | List units |
| POST | `/api/properties/:pid/units` | ✅ | Create unit |
| PATCH | `/api/units/:id` | ✅ | Update unit |
| DELETE | `/api/units/:id` | ✅ | Delete (VACANT only) |

### Tenants
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tenants` | ✅ | List all active |
| POST | `/api/tenants` | ✅ | Assign to unit |
| GET | `/api/tenants/:id` | ✅ | Get with history |
| PATCH | `/api/tenants/:id` | ✅ | Update |
| DELETE | `/api/tenants/:id` | ✅ | Vacate (soft) |

### Rent Records
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/rent-records` | ✅ | List (filter: month, status, propertyId) |
| POST | `/api/rent-records/generate` | ✅ | Manual trigger |
| PATCH | `/api/rent-records/:id/pay` | ✅ | Mark as PAID |
| PATCH | `/api/rent-records/:id/waive` | ✅ | Mark as WAIVED |

### WhatsApp
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/whatsapp/status` | ✅ | Connection status |
| POST | `/api/whatsapp/send/:recordId` | ✅ | Send reminder |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | ✅ | Summary stats |

---

## 5. JWT Flow

```
Client                    Server
  │                          │
  │─── POST /api/auth/login ─►│
  │    { email, password }    │── bcrypt.compare ──► DB
  │                          │◄── landlord record ──
  │◄── { token, landlord } ──│── jwt.sign({ id, email })
  │                          │
  │  Store token in localStorage
  │                          │
  │─── GET /api/tenants ─────►│
  │    Authorization: Bearer  │── auth.middleware.js
  │    <token>                │── jwt.verify(token)
  │                          │── attach req.landlord
  │◄── [ tenants array ] ────│── controller executes
```

---

## 6. WhatsApp Integration Flow

```
Server Boot
  └─► whatsapp.service.js: new Client({ authStrategy: LocalAuth() })
           │
     First Run?
      YES → QR printed to terminal → Landlord scans
      NO  → Session loaded from ./.wwebjs_auth/
           │
     client.on('ready') → isConnected = true
           │
POST /api/whatsapp/send/:recordId
  └─► Fetch rent_record + tenant + unit + property + landlord
  └─► Format message string (INR template)
  └─► client.sendMessage(`${whatsapp_no}@c.us`, message)
  └─► Update rent_record: reminder_sent=true, reminder_sent_at=now()
  └─► Return { success: true }
```

---

## 7. Technology Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| react | ^19.x | UI Framework |
| vite | ^6.x | Build tool |
| tailwindcss | ^3.x | Utility CSS |
| react-router-dom | ^6.x | Routing |
| axios | ^1.x | HTTP client |
| lucide-react | latest | Icons |
| recharts | ^2.x | Charts |
| react-hot-toast | ^2.x | Toasts |
| clsx + tailwind-merge | latest | Class merging |

### Backend
| Package | Version | Purpose |
|---|---|---|
| express | ^4.x | HTTP framework |
| @prisma/client | ^5.x | DB access |
| prisma | ^5.x | ORM + migrations |
| jsonwebtoken | ^9.x | JWT auth |
| bcryptjs | ^2.x | Password hashing |
| node-cron | ^3.x | Scheduled jobs |
| whatsapp-web.js | ^1.x | WA automation |
| qrcode-terminal | ^0.x | QR in terminal |
| cors | ^2.x | CORS headers |
| dotenv | ^16.x | Env vars |
| express-validator | ^7.x | Input validation |

---

## 8. Environment Variables

```env
# ── Database ──────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host:5432/rentdesk?schema=public"

# ── JWT ───────────────────────────────────────────────
JWT_SECRET="minimum-32-character-random-secret-here"
JWT_EXPIRES_IN="7d"

# ── Server ────────────────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ── WhatsApp ──────────────────────────────────────────
WWEBJS_SESSION_PATH="./.wwebjs_auth"
```

---

## 9. Deployment Map (Zero-Cost)

| Layer | Provider | Plan | Cost |
|---|---|---|---|
| PostgreSQL | Neon.tech | Free (0.5 GB) | ₹0 |
| Backend | Render.com | Free Web Service | ₹0 |
| Frontend | Vercel | Hobby (Free) | ₹0 |
| WhatsApp | whatsapp-web.js | Open Source | ₹0 |
| **Total** | | | **₹0/month** |

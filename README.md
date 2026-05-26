# Sher-E-Punjab — Project Analysis

> Deep analysis of the `monikanogia/Sher-E-Punjab` repository.

---

## 🏗️ Project Overview

- **Project Type:** Zero-Cost QR-Based Digital Menu + WhatsApp Ordering System
- **Architecture:** **pnpm Monorepo** with multiple workspaces
- **Originally built on:** Replit
- **Repo:** https://github.com/monikanogia/Sher-E-Punjab

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, TailwindCSS 4, Radix UI (shadcn), Wouter (routing), TanStack Query |
| **Backend** | Express 5, TypeScript, JWT Auth, Pino logger |
| **Database** | PostgreSQL (Neon), Drizzle ORM |
| **API Spec** | OpenAPI 3.1 + Orval (auto-generates client + Zod schemas) |
| **Package Manager** | pnpm (workspaces) |
| **Build** | esbuild (api-server), Vite (menu-app) |

---

## 📂 Complete Directory Structure

```
Sher-E-Punjab/                          # 🏠 Monorepo Root
│
├── 📁 artifacts/                       # 🎯 RUNNABLE APPS
│   │
│   ├── 📁 api-server/                  # ◦ Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── logger.ts           # Pino logger setup
│   │   │   ├── middlewares/
│   │   │   │   └── requireAdmin.ts     # JWT auth middleware
│   │   │   ├── routes/
│   │   │   │   ├── adminCategories.ts  # Admin CRUD - Categories
│   │   │   │   ├── adminDishes.ts      # Admin CRUD - Dishes
│   │   │   │   ├── adminSettings.ts    # Restaurant settings
│   │   │   │   ├── adminStats.ts       # Dashboard stats
│   │   │   │   ├── adminTables.ts      # QR Tables management
│   │   │   │   ├── auth.ts             # Login + /me endpoint
│   │   │   │   ├── health.ts           # Health check
│   │   │   │   ├── menu.ts             # Public menu endpoints
│   │   │   │   └── index.ts            # Router aggregator
│   │   │   ├── app.ts                  # Express app setup
│   │   │   └── index.ts                # Server entry (port listener)
│   │   ├── build.mjs                   # esbuild bundler script
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── 📁 menu-app/                    # ○ Frontend (React + Vite)
│       ├── public/
│       │   ├── favicon.svg
│       │   └── opengraph.jpg
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                 # 50+ shadcn/Radix UI components
│       │   │   └── ProtectedRoute.tsx  # Auth guard
│       │   ├── contexts/
│       │   │   ├── AuthContext.tsx     # Global auth state
│       │   │   └── CartContext.tsx     # Shopping cart state
│       │   ├── hooks/
│       │   │   ├── use-mobile.tsx
│       │   │   └── use-toast.ts
│       │   ├── lib/
│       │   │   └── utils.ts            # Utility helpers
│       │   ├── pages/
│       │   │   ├── admin/
│       │   │   │   ├── Categories.tsx
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── Dishes.tsx
│       │   │   │   ├── Login.tsx
│       │   │   │   ├── Settings.tsx
│       │   │   │   └── Tables.tsx
│       │   │   ├── Landing.tsx         # Home page
│       │   │   ├── Menu.tsx            # Customer menu view
│       │   │   └── not-found.tsx
│       │   ├── App.tsx                 # Router + Providers
│       │   ├── main.tsx                # React entry
│       │   └── index.css
│       ├── components.json             # shadcn config
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts              # Has proxy /api → localhost:3000
│
├── 📁 lib/                             # ▪ SHARED LIBRARIES (workspace packages)
│   │
│   ├── 📁 api-client-react/            # 🔄 Auto-generated React Query client
│   │   ├── src/
│   │   │   ├── generated/              # ← Orval generates these
│   │   │   │   ├── api.ts              # All hooks (useListDishes, etc.)
│   │   │   │   └── api.schemas.ts      # TypeScript types
│   │   │   ├── custom-fetch.ts         # fetch wrapper + setBaseUrl()
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── 📁 api-spec/                    # ▪ OpenAPI Source of Truth
│   │   ├── openapi.yaml                # API contract (single source)
│   │   ├── orval.config.ts             # Code generator config
│   │   └── package.json
│   │
│   ├── 📁 api-zod/                     # ✓ Auto-generated Zod validators
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── types/              # Per-endpoint Zod schemas
│   │   │   │   └── api.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── 📁 db/                          # 🗄️ Database Layer (Drizzle ORM)
│       ├── src/
│       │   ├── schema/
│       │   │   ├── admins.ts           # Admin users table
│       │   │   ├── categories.ts       # Menu categories
│       │   │   ├── dishes.ts           # Menu items
│       │   │   ├── settings.ts         # Restaurant settings
│       │   │   ├── tables.ts           # QR table mappings
│       │   │   └── index.ts
│       │   └── index.ts                # DB connection (uses DATABASE_URL)
│       ├── drizzle.config.ts           # ⚠️ Has hardcoded Neon URL!
│       └── package.json
│
├── 📁 scripts/                         # 🛠️ Utility scripts
│   ├── src/
│   │   └── hello.ts
│   ├── post-merge.sh
│   └── package.json
│
├── 📁 attached_assets/                 # 📎 Original project brief
├── .gitignore
├── .npmrc                              # Windows arch support
├── package.json                        # Root workspace
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                 # Defines workspaces + catalog
├── tsconfig.base.json                  # Base TS config
└── tsconfig.json                       # References lib/* projects
```

---

## 🔄 Data Flow (Architecture)

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Browser    │ ──────> │  menu-app (Vite) │ ──────> │ api-client-  │
│   localhost: │  HTTP   │   :5173          │  hooks  │   react      │
│     5173     │         └──────────────────┘         └──────┬───────┘
└──────────────┘                                              │
                                                              │ fetch
                                                              ▼
                                                       ┌──────────────┐
                                                       │ /api/* proxy │
                                                       │ → :3000      │
                                                       └──────┬───────┘
                                                              │
                                                              ▼
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│  PostgreSQL  │ <────── │  Drizzle ORM     │ <────── │  api-server  │
│  (Neon DB)   │         │   (lib/db)       │         │ Express :3000│
└──────────────┘         └──────────────────┘         └──────────────┘
                                                              │
                                                              ▼
                                                       ┌──────────────┐
                                                       │  api-zod     │
                                                       │  schemas     │
                                                       └──────────────┘
```

---

## 🎯 Key Features (App Functionality)

### Public Side (Customer)
- 🍽️ **Landing page** (`/`)
- 📱 **Menu page** (`/menu`) — Browse dishes, search, filter veg/non-veg
- 🛒 **Cart** (CartContext) — Add items
- 💬 **WhatsApp ordering** (whatsappNumber from settings)

### Admin Side (Protected)
- 🔐 **Login** (`/admin/login`) — JWT based
- ▪ **Dashboard** (`/admin`) — Stats overview
- 📂 **Categories** (`/admin/categories`) — CRUD
- 🍕 **Dishes** (`/admin/dishes`) — CRUD + toggle stock
- ⚙️ **Settings** (`/admin/settings`) — Restaurant info
- 🪑 **Tables** (`/admin/tables`) — QR code generation

---

## 🗄️ Database Tables (5 tables)

| Table | Columns | Purpose |
|---|---|---|
| `admins` | id, username, passwordHash | Admin login |
| `categories` | id, name, displayOrder | Menu sections |
| `dishes` | id, name, description, price, isVeg, isAvailable, isFeatured, imageUrl, categoryId | Menu items |
| `restaurant_settings` | id, restaurantName, logoUrl, whatsappNumber, openingHours, isOpen, accentColor | Site config |
| `restaurant_tables` | id, tableNumber, label | QR codes |

---

## 🔑 API Endpoints (22 endpoints)

### Public (`/api/menu/*`)
- `GET /healthz`
- `GET /menu/categories`
- `GET /menu/dishes` (with search/filter)
- `GET /menu/settings`
- `GET /menu/featured`

### Admin (`/api/admin/*` — JWT protected)
- `POST /admin/login`
- `GET /admin/me`
- **Categories:** `GET / POST / PUT / DELETE /admin/categories`
- **Dishes:** `GET / POST / PUT / DELETE /admin/dishes` + `PATCH /admin/dishes/:id/toggle-stock`
- **Settings:** `GET / PUT /admin/settings`
- **Stats:** `GET /admin/stats`
- **Tables:** `GET / POST / DELETE /admin/tables`

---

## ⚠️ Issues Found in Repo

| Issue | File | Severity |
|---|---|---|
| ● **Hardcoded DB credentials exposed!** | `lib/db/drizzle.config.ts` | **CRITICAL — Security leak** |
| 🟡 Replit-specific Vite plugins | `artifacts/menu-app/vite.config.ts` | Locally won't work without env vars |
| 🟡 Requires `PORT` & `BASE_PATH` env vars | `vite.config.ts` | Crashes without them |
| 🟡 `JWT_SECRET = "change_me_secret"` default | `artifacts/api-server/src/routes/auth.ts` | Production risk |
| 🟡 Console.log in auth route | `routes/auth.ts` | Debug code in production |

---

## 💡 Summary

| Aspect | Details |
|---|---|
| **Workspaces** | 8 total (artifacts/* + lib/* + scripts) |
| **Apps to run** | 2 (api-server + menu-app) |
| **Shared libs** | 3 (db, api-client-react, api-zod) |
| **Code generation** | OpenAPI → Orval → React hooks + Zod |
| **Production-ready?** | ✗ Has hardcoded secrets, needs cleanup |

---

## → How to Run Locally

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (or Neon cloud DB)

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
# Create artifacts/api-server/.env:
#   DATABASE_URL=postgresql://user:pass@host:5432/dbname
#   PORT=3000
#   JWT_SECRET=your-secret-key

# Create artifacts/menu-app/.env:
#   PORT=5173
#   BASE_PATH=/

# 3. Push database schema
cd lib/db
pnpm drizzle-kit push

# 4. Start backend (Terminal 1)
cd artifacts/api-server
pnpm run dev
# → http://localhost:3000

# 5. Start frontend (Terminal 2)
cd artifacts/menu-app
pnpm run dev
# → http://localhost:5173
```

---

## 📝 Notes

- The project is well-structured with **clean separation of concerns**.
- **Code generation** (Orval) ensures frontend & backend stay in sync via OpenAPI.
- **Replit-specific configs** need to be removed/adjusted for local or production deployment.
- **Hardcoded credentials** in `drizzle.config.ts` should be moved to environment variables immediately.

# Portal Sekolah - Frontend Monorepo Walkthrough

Dokumen ini menjelaskan arsitektur, struktur, dan cara menjalankan frontend monorepo **Portal Sekolah**.

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript 5 (strict) |
| Monorepo | Turborepo + npm workspaces |
| Styling | Tailwind CSS 3 + CSS Variables (light/dark) |
| State Management | Zustand (client) + TanStack React Query (server) |
| Form | React Hook Form + Zod |
| HTTP Client | Axios |
| WebSocket | Socket.IO Client |
| Animasi | Framer Motion |
| Ikon | Lucide React |
| Linter | ESLint 9 (flat config) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

Dev server berjalan di `http://localhost:3000`.

---

## Struktur Monorepo

```
fe-portal-sekolah/
├── apps/
│   └── web/                    # Next.js App Router (main app)
├── packages/
│   ├── api-client/             # Axios HTTP client + endpoint modules
│   ├── auth/                   # RBAC, permissions, tenant helpers
│   ├── config/                 # Environment validation (Zod)
│   ├── constants/              # Roles, routes, API routes, socket events
│   ├── eslint-config/          # Shared ESLint configs (base, next, react)
│   ├── socket-client/          # Socket.IO client + event listeners
│   ├── ts-config/              # Shared TypeScript configs (base, next, react)
│   ├── types/                  # Shared TypeScript type definitions
│   ├── ui/                     # Reusable UI + form components
│   └── utils/                  # Utility functions (cn, format, validation)
├── turbo.json                  # Turborepo pipeline config
├── package.json                # npm workspace definition
└── package.json                # Root scripts (build, dev, lint, type-check)
```

---

## Aplikasi Utama (`apps/web`)

### Routing

| Path | Deskripsi |
|---|---|
| `/` | Root redirect (cek auth → dashboard atau login) |
| `/login` | Halaman login dengan demo account quick-fill |
| `/dashboard` | Router otomatis berdasarkan role user |
| `/dashboard/super-admin` | Dashboard Super Admin (manajemen tenant) |
| `/dashboard/admin` | Dashboard Admin IT (manajemen user) |
| `/dashboard/kepala-sekolah` | Dashboard Kepala Sekolah (akademik + keuangan) |
| `/dashboard/guru` | Dashboard Guru (presensi + penugasan) |
| `/dashboard/staff` | Dashboard Staff Keuangan (invoice + verifikasi) |
| `/dashboard/siswa` | Dashboard Siswa (presensi, tugas, SPP QRIS) |

### Layouts

- **Root Layout** (`app/layout.tsx`) — Font Inter, metadata, `AppProviders`
- **Dashboard Layout** (`app/(dashboard)/layout.tsx`) — Sidebar + Topbar + Content
- **Public Layout** (`app/(public)/layout.tsx`) — Layout tanpa sidebar

### Providers (hierarchy)

```
ThemeProvider → ToastProvider → QueryProvider → AuthProvider → SocketProvider
```

### Stores (Zustand)

- `auth-store` — User, session, tenant, persist ke localStorage
- `notification-store` — Notifications, unread count
- `sidebar-store` — Sidebar collapsed state

### Middleware

`src/middleware.ts` — Route protection dan tenant validation (hook Next.js middleware).

---

## Package Detail

### `@portal-sekolah/api-client`
Axios instance dengan interceptor untuk auth token (`Authorization`) dan tenant header (`X-Tenant-ID`). Endpoint modules: auth, users, classes, attendance, assignments, payments, notifications, dashboard.

### `@portal-sekolah/auth`
- **RBAC**: Permission matrix per role (`SUPER_ADMIN`, `ADMIN_IT`, `KEPALA_SEKOLAH`, `GURU`, `STAFF`, `SISWA`)
- **Tenant helpers**: Extract tenant dari subdomain, validasi akses tenant

### `@portal-sekolah/config`
Validasi environment variable dengan Zod schema (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_APP_URL`).

### `@portal-sekolah/constants`
Konstanta aplikasi: role definitions dengan hierarchy weight, route maps per role, API routes, socket event names.

### `@portal-sekolah/socket-client`
Socket.IO client dengan auto room join (tenant + user), typed event listeners, cleanup/unsubscribe helpers.

### `@portal-sekolah/types`
TypeScript types: `User`, `Session`, `Tenant`, `AttendanceRecord`, `Assignment`, `Submission`, `Payment`, `Notification`, `ApiResponse<T>`, `Role`.

### `@portal-sekolah/ui`
- **Base components**: Button, Input, Card, Dialog, Badge, Table, Select, Skeleton, Toast, Tooltip, dll.
- **Form components**: FormInput, FormSelect, FormTextarea, FormDatePicker, FormUpload (terintegrasi react-hook-form)
- **Tailwind preset**: Custom design tokens via CSS variables

### `@portal-sekolah/utils`
- `cn()` — clsx + tailwind-merge untuk className merging
- `formatCurrency()` — Format Rupiah
- `formatDate()` — Format tanggal Indonesia
- Validation schemas: phone, NISN, NIP

---

## Fitur Utama

### Multi-Tenant
Tenant diekstrak dari subdomain (misal `sekolah1.portalsekolah.id`). Header `X-Tenant-ID` dikirim otomatis via Axios interceptor. Super Admin dapat mengakses semua tenant.

### Role-Based Access Control (RBAC)
6 role dengan permission berbeda. Sidebar navigation otomatis menyesuaikan berdasarkan role. Hook `usePermission()` untuk cek permission di komponen.

### Mock Authentication (Demo)
Login page menyediakan 6 demo account quick-fill tanpa backend. User data disimpan di Zustand + cookie.

### QRIS Payment (Mockup)
Dashboard siswa memiliki simulasi pembayaran SPP via QRIS dengan popup dialog dan visual placeholder.

### Real-Time (WebSocket)
Socket.IO client dengan typed events untuk notifikasi, presensi, pembayaran, dan penugasan. Auto-connect saat login, auto-disconnect saat logout.

### Dark Mode
Toggle tema via `next-themes` dengan system preference detection. CSS variables untuk semua warna.

---

## Environment Variables

Salin `.env.example` ke `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Build Output

```
Route (app)                              Size  First Load JS
┌ ○ /                                   437 B         163 kB
├ ○ /_not-found                         993 B         104 kB
├ ○ /dashboard                          443 B         163 kB
├ ○ /dashboard/admin                   3.26 kB         143 kB
├ ○ /dashboard/guru                    3.14 kB         142 kB
├ ○ /dashboard/kepala-sekolah           3.1 kB         142 kB
├ ○ /dashboard/siswa                   3.97 kB         143 kB
├ ○ /dashboard/staff                   3.07 kB         142 kB
├ ○ /dashboard/super-admin             3.29 kB         143 kB
└ ○ /login                             6.79 kB         167 kB
  First Load JS shared by all           103 kB
  Middleware                            34.7 kB
```

---

## Scripts

| Script | Perintah | Deskripsi |
|---|---|---|
| Install | `npm install` | Install semua dependencies |
| Dev | `npm run dev` | Jalankan dev server |
| Build | `npm run build` | Build production |
| Type Check | `npm run type-check` | Cek TypeScript |
| Lint | `npm run lint` | Jalankan ESLint |
| Clean | `npm run clean` | Bersihkan cache Turborepo |

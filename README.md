# Portal Sekolah Frontend - Monorepo

Frontend monorepo modern, modular, dan multi-tenant untuk platform SaaS **Portal Sekolah**. Dibangun menggunakan **Turborepo + npm workspaces** dengan Next.js App Router dan arsitektur berbasis fitur (Feature-Based Architecture).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Monorepo Tooling**: Turborepo & npm Workspaces
- **Styling**: Tailwind CSS & shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Realtime**: Socket.IO Client
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Zod & React Hook Form
- **Animation**: Framer Motion

## Struktur Project
- `apps/web` - Aplikasi utama Next.js.
- `packages/ts-config` - Konfigurasi TypeScript bersama.
- `packages/eslint-config` - Konfigurasi ESLint bersama.
- `packages/types` - Type definitions global untuk API, Entitas, Auth, dll.
- `packages/constants` - Konstanta sistem seperti Role, Routing, Socket Events, API Routes.
- `packages/config` - Validasi env variabel menggunakan Zod.
- `packages/utils` - Utilitas bersama seperti format, helper date, kelas gabungan tailwind (`cn`).
- `packages/auth` - Logika otorisasi RBAC (Role-Based Access Control) dan penanganan Multi-Tenant.
- `packages/api-client` - SDK Klien HTTP (menggunakan Fetch/Axios terstandarisasi).
- `packages/socket-client` - WebSocket Client SDK terintegrasi.
- `packages/ui` - Pustaka Komponen UI bersama (shadcn/ui + form wrapper).

## Panduan Penggunaan

### Persyaratan
- Node.js >= 18
- npm >= 11

### Instalasi Dependensi
```bash
npm install
```

### Pengembangan (Local Dev)
```bash
npm run dev
```

### Verifikasi Type dan Linter
```bash
npm run type-check
npm run lint
```

### Build Produksi
```bash
npm run build
```

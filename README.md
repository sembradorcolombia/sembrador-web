# El Sembrador Colombia — Web

Event management web application for El Sembrador Colombia. A React SPA for showcasing events, handling attendee registrations, and providing an admin dashboard.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.7
- **Build tool:** Vite 7
- **Routing:** TanStack Router (file-based)
- **Data fetching:** TanStack Query
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (auth, database)
- **Analytics:** Google Analytics (GA4), Meta Pixel
- **Linting/Formatting:** Biome
- **Package manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_GA_MEASUREMENT_ID=<your-ga4-measurement-id>
VITE_META_PIXEL_ID=<your-meta-pixel-id>
```

### Install & Run

```bash
pnpm install
pnpm dev
```

The dev server starts on `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (includes type-check) |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests (Vitest) |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format with Biome |
| `pnpm check` | Full Biome check (lint + format) |

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── dashboard/     # Admin dashboard components
│   └── ui/            # Base UI primitives (button, input, dialog, etc.)
├── lib/
│   ├── hooks/         # Custom React hooks
│   └── services/      # Supabase queries and business logic
├── routes/            # File-based routes (TanStack Router)
│   ├── __root.tsx     # Root layout (providers, SEO, toasts)
│   ├── index.tsx      # Landing page (/)
│   ├── equilibrio.tsx # Event showcase with registration (/equilibrio)
│   ├── login.tsx      # Admin login (/login)
│   ├── dashboard.tsx  # Admin dashboard (/dashboard)
│   └── politica-de-datos.tsx  # Data privacy policy
├── main.tsx           # App entry point
├── styles.css         # Global styles (Tailwind imports)
└── routeTree.gen.ts   # Auto-generated — DO NOT edit
```

## Pages

- **`/`** — Landing page
- **`/equilibrio`** — Event showcase with speaker info and registration modals
- **`/login`** — Admin authentication
- **`/dashboard`** — Admin-only dashboard with event stats, subscriber tables, and email search
- **`/politica-de-datos`** — Data privacy policy (Ley 1581 de 2012)

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **Route files** in `src/routes/` are auto-detected; `routeTree.gen.ts` is generated automatically
- **Biome** handles linting and formatting — tab indentation, double quotes
- **TypeScript** strict mode is enabled
- **Tailwind CSS** utility classes for all styling

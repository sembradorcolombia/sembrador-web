# CLAUDE.md

## Project Overview

El Sembrador Colombia web application — a React 19 SPA built with TypeScript, Vite, and TanStack Router.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.7
- **Build tool:** Vite 7
- **Routing:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **Testing:** Vitest + @testing-library/react
- **Linting/Formatting:** Biome (replaces ESLint + Prettier)
- **Package manager:** pnpm

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Production build (includes tsc type-check)
pnpm preview      # Preview production build
pnpm test         # Run tests (Vitest, single run)
pnpm lint         # Lint with Biome
pnpm format       # Format with Biome
pnpm check        # Full Biome check (lint + format)
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── routes/        # File-based routes (TanStack Router)
│   ├── __root.tsx # Root layout
│   └── index.tsx  # Home page (/)
├── main.tsx       # App entry point
├── styles.css     # Global styles (Tailwind imports)
└── routeTree.gen.ts  # Auto-generated — DO NOT edit
```

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **Route files** in `src/routes/` are auto-detected; the route tree is generated automatically (`routeTree.gen.ts`)
- **Biome** handles both linting and formatting — uses tab indentation, double quotes
- **Biome excludes:** `src/routeTree.gen.ts` and `src/styles.css`
- **TypeScript** strict mode is enabled; unused variables and parameters are errors
- **Tailwind CSS** utility classes are used for all styling

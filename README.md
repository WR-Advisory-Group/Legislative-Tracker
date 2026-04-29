# Congress

> **Important:** This project is a **read-only viewer and search interface** for the `philippine_congress_bills` database. It has no capability to add or update bill data. All data ingestion is handled externally by the **Watcher** project combined with an **n8n workflow** — changes to the underlying data must go through that pipeline.

Web interface for searching Philippine Senate bills. Frontend is a React + Vite SPA styled after [senate.gov.ph](https://senate.gov.ph/legislative-documents/bills); backend is an Express API backed by MySQL.

## Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS 3, React Router 7, Axios
- **Backend:** Node.js + Express 4, TypeScript, MySQL2, Zod
- **Deployment:** Multi-stage Docker build (frontend → backend → runtime), served from a single container on port `4568`

## Project Layout

```
congress/
  src/                    # React SPA
    pages/                # BillsSearchPage, UploadPage
    components/           # layout, search, table, ui, upload
    api/client.ts         # Axios instance
  server/                 # Express API
    src/
      index.ts            # entry; serves /bills routes + static dist/
      routes/bills.ts     # /bills/search, filter options
      db.ts               # mysql2 pool
  Dockerfile              # 3-stage build
  docker-compose.yml
  SENATE_BILLS_DESIGN_BLUEPRINT.md   # design tokens reference
```

## Prerequisites

- Node.js 20+
- MySQL with a `bills` table (see `server/src/types.ts` for the schema shape)
- A `.env` file at the repo root (see below)

## Environment

Create `congress/.env` (same level as `package.json`). The server resolves this path in both dev and production (volume-mounted into the container at `/app/.env`).

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
PORT=4568
CORS_ORIGIN=http://localhost:5173
```

## Development

Run the frontend and backend in separate terminals.

```bash
# Frontend (Vite dev server on :5173)
npm install
npm run dev

# Backend (ts-node-dev on :4568)
cd server
npm install
npm run dev
```

The frontend talks to the backend via `src/api/client.ts` — set the base URL there if it differs from the default.

## Build

```bash
# Frontend → dist/
npm run build

# Backend → server/dist/
cd server && npm run build
```

## Production / Docker

The Dockerfile builds the frontend, builds the backend, and ships a single Node runtime that serves the API under `/bills` and the SPA for everything else.

```bash
docker compose up -d --build
```

The container listens on `4568` and reads `/app/.env` (mounted read-only from `./.env`).

## API

Base URL: `/bills`

| Method | Path             | Description                              |
|--------|------------------|------------------------------------------|
| GET    | `/bills/search`  | Paginated bills search with filters/sort |

Query params for `/search`: `q`, `congress`, `type`, `author`, `primary_committee`, `legislative_status`, `sort_by` (one of `dateFiled`, `no`, `title`, `legislativeStatusDate`), `sort_order` (`ASC`/`DESC`), `page`, `per_page` (max 200).

## Scripts

Root:
- `npm run dev` — Vite dev server
- `npm run build` — type-check + production build
- `npm run lint` — ESLint
- `npm run preview` — preview built frontend

`server/`:
- `npm run dev` — ts-node-dev with auto-reload
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server

## Design Reference

`SENATE_BILLS_DESIGN_BLUEPRINT.md` documents the color palette, typography, spacing, and component patterns extracted from the senate.gov.ph bills page. Use it as the source of truth when adding UI.

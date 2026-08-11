# Kisaan AI — Project Status & Agent Guide (done.md)

> **Read this file first.** It tells you what has been built, how the code is
> organised, the conventions to follow, and what still needs doing. Update this
> file at the end of every work session so the next agent can pick up context
> without re-reading the whole codebase.

---

## 1. Project Overview

Kisaan AI is a farmer-focused AI companion app. It provides crop advice, weather,
market (mandi) prices, and farm/crop management. The UI is a mobile-first
**React + Vite** app with a **FastAPI + PostgreSQL** backend.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, React Router 6, React Query (TanStack), Tailwind CSS 3, shadcn/ui (Radix), Framer Motion, Recharts |
| Backend | FastAPI, SQLAlchemy 2, Pydantic v2, Alembic, python-jose, bcrypt/passlib |
| Database | PostgreSQL (hosted on Neon, via psycopg/psycopg2) |
| AI | Google Gemini (keyword-based fallback) |
| Weather | OpenWeatherMap (with fallback) |
| Tests | pytest (backend) |

---

## 2. Repository Layout

```
Kisaan-ai/
├── done.md                     <-- THIS FILE: status + agent guide
├── package.json                Frontend deps + scripts (npm)
├── vite.config.js              Vite config, /api proxy -> :8000
├── src/                        React frontend
│   ├── App.jsx                 Providers + auth-gated routing
│   ├── main.jsx                Entry point
│   ├── lib/
│   │   ├── api.js              Central API client (all backend calls)
│   │   ├── AuthContext.jsx     JWT auth state (token in localStorage)
│   │   ├── languageContext.jsx Multi-language translations + useLang()
│   │   ├── themeContext.jsx    Light/dark theme
│   │   ├── seniorContext.jsx   Senior-friendly mode
│   │   ├── mockData.js         Fallback/demo data (farmer, schemes…)
│   │   ├── query-client.js     React Query client instance
│   │   └── utils.js            cn() helper etc.
│   ├── components/
│   │   ├── layout/             AppLayout, BottomNav, MenuDrawer, PageHeader,
│   │   │                       VoiceButton, LanguageSheet
│   │   ├── farms/              FarmFormDialog (add/edit farm)
│   │   ├── crops/              CropFormDialog (add/edit crop)
│   │   ├── ui/                 shadcn/ui primitives + GlassCard, StatusChip,
│   │   │                       ConfirmDialog, form-field, OfflineIndicator…
│   └── pages/                  Home, Farms, FarmDetail, Crops, Market, AI,
│                               Settings, Login, Register, ForgotPassword,
│                               ResetPassword, VillageStatus, VerifiedAdvisories,
│                               Reports, Analytics, OfflineDownloads, Notifications,
│                               Help, About
└── backend/                    FastAPI app
    ├── alembic/                Migrations (versions/)
    ├── alembic.ini
    ├── requirements.txt
    ├── app/
    │   ├── main.py             FastAPI app + route mounting + CORS + /health
    │   ├── api/v1/             Routers: auth, users, farms, crops, insights
    │   ├── core/               config, security, exception_handlers
    │   ├── db/                 database.py (engine, SessionLocal, Base)
    │   ├── dependencies/       auth.py (get_current_user)
    │   ├── models/             user, farm, crop
    │   ├── schemas/            Pydantic: user, farm, crop, ai
    │   ├── services/           ai_service, auth_service, farm_service,
    │   │                       crop_service, weather_service, market_service
    │   └── exceptions/         auth, farm
    └── tests/                  conftest + test_auth, test_farms, test_crops,
                                test_insights, test_ai_fallback, test_main
```

---

## 3. What Has Been Done (in order)

### Committed history (`git log --oneline`)
1. **kisaan copilot frontend** — initial mobile-first UI shell with mock data.
2. **backend production** — FastAPI scaffolding, config, DB wiring, security.
3. **FARMS AND CROP BACKEND** — farm + crop models/schemas/services/routes + Alembic migrations + tests.
4. **APIS INTEGRATED** — frontend `api.js` client wired to backend routes.
5. **BACKEND INTEGRATION WITH FRONTEND** — AuthContext/login/register use real JWT; Home/AI/Market/Crops use real data.
6. **LOGIN AND SIGNUP AUTH PAGE** — polished auth flow, ProtectedRoute, auth-gated routing.

### Backend (FastAPI) — complete
- **Auth**: `POST /auth/register`, `POST /auth/login` returning JWT, `GET /users/me` profile. Password hashed with bcrypt via passlib. JWT via python-jose. Ownership protection on all farm/crop routes.
- **Farms**: full CRUD scoped to the authenticated user (`farm_service.py`).
- **Crops**: full CRUD nested under a farm (`/farms/{farm_id}/crops`), cascade-delete with farm.
- **AI Advisor**: `POST /insights/ai/ask` — Gemini integration with keyword-based offline fallback (`ai_service.py`).
- **Weather**: `GET /insights/weather` — OpenWeatherMap with graceful fallback.
- **Market**: `GET /insights/market/prices` (mandi prices) and `GET /insights/market/mandi` (nearby mandis).
- **DB**: PostgreSQL (Neon) via SQLAlchemy, Alembic migrations (users, farms, crops tables — crop column removed from farms in a later migration).
- **Tests**: pytest suite in `backend/tests/` (auth, farms, crops, insights, AI fallback, main/health). All passing (~34 tests).

### Frontend (React + Vite) — complete / in progress
- **API client** `src/lib/api.js`: central `request()` wrapper with Bearer token injection, 401 auto-logout, FastAPI 422 error parsing. All methods exposed under `api.*`.
- **Auth**: `AuthContext` uses backend JWT. Tokens stored in `localStorage` under `kisaan_token` (fallbacks read `base44_access_token` / `token`). `ProtectedRoute` + auth-gated routing in `App.jsx`.
- **Pages wired to real backend**: Home, AI, Market, Crops, Farms, FarmDetail.
- **Settings**: profile section (unique ID, username, email, logout).
- **Multi-language**: `languageContext.jsx` with English, Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali. UI strings through `t('key')`.
- **Theming**: light/dark via `themeContext`; senior-friendly mode via `seniorContext`.
- Build passes (`npm run build`, ~1691 modules).

### Latest work — Farms & Crops management UI (UNCOMMITTED as of this writing)
Working tree has changes not yet committed. **Commit these after verifying:**
- `src/components/farms/FarmFormDialog.jsx` — new farm add/edit dialog (validates name, soil, area, lat/lng).
- `src/components/crops/CropFormDialog.jsx` — new crop add/edit dialog (season KHARIF/RABI/ZAID, status PLANTED/GROWING/HARVESTED, planted/harvest dates).
- `src/components/ui/ConfirmDialog.jsx` — reusable delete-confirm dialog.
- `src/components/ui/form-field.jsx` — reusable labelled form field with error + hint.
- `src/pages/Farms.jsx` — list/create/edit/delete farms, loading/empty/error states.
- `src/pages/FarmDetail.jsx` — view a farm's summary + nested crop CRUD.
- `src/pages/Crops.jsx` — aggregate crops across all farms with selector chips + hero/status UI.
- `src/components/layout/MenuDrawer.jsx` — added `/farms` nav entry.
- `src/pages/Home.jsx` — dashboard now loads real farms + crops from backend; crop-status card falls back to an empty-state CTA when no farms exist.
- `src/App.jsx` — registered `/farms` and `/farms/:farmId` routes.
- `src/lib/api.js` — added farm + crop API methods (already shown in section 5).

### Latest work — Animation system (see §11)
- `src/lib/animation.js` — animejs v4 wrapper (entry/stagger/press/progress/count/slide/burst), `useScrollReveal`, `useReducedMotion`.
- `src/components/layout/PageTransition.jsx` — entrance/exit transitions per route (forwards `outletContext`).
- `src/components/ui/AnimatedProgressBar.jsx` — count+width animated bar with scroll reveal.
- `src/components/ui/GlassCard.jsx`, `BottomNav.jsx`, `MenuDrawer.jsx`, `LanguageSheet.jsx`, `PageHeader.jsx`, `KisaanMascot.jsx`, `button.jsx`, `StatusChip.jsx` — press/hover/entrance animations.
- `src/pages/Home/Crops/Market/Notifications/AI` — staggered entrances, typing reveal.

### Latest work — Bug-fix / hardening pass (see §12)

> The frontend is currently on branch **`backend-foundation`** (up to date with `origin/backend-foundation`).

---

## 4. Data Models (Backend)

### User (`app/models/user.py`)
`id`, `username`, `email` (unique), `hashed_password`, `created_at`. Has relation `farms`.

### Farm (`app/models/farm.py`)
`id`, `user_id` (FK users), `name`, `soil_type`, `area` (float), `latitude`, `longitude`, `created_at`. Relation `crops` with `cascade="all, delete-orphan"`.

### Crop (`app/models/crop.py`)
`id`, `farm_id` (FK farms, ondelete CASCADE), `name`, `variety` (nullable), `season` (enum KHARIF/RABI/ZAID), `planted_at` (date), `expected_harvest` (date, nullable), `status` (enum PLANTED/GROWING/HARVESTED), `created_at`.

---

## 5. API Endpoints

All under `/api` (Vite proxy forwards `/api` → `http://localhost:8000`).

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT |
| GET | `/users/me` | Current user profile |
| GET | `/farms` | List user farms |
| POST | `/farms` | Create farm |
| GET | `/farms/{id}` | Farm detail |
| PUT | `/farms/{id}` | Update farm |
| DELETE | `/farms/{id}` | Delete farm (+ crops) |
| GET | `/farms/{id}/crops` | List crops in farm |
| POST | `/farms/{id}/crops` | Create crop |
| GET | `/farms/{id}/crops/{cid}` | Crop detail |
| PUT | `/farms/{id}/crops/{cid}` | Update crop |
| DELETE | `/farms/{id}/crops/{cid}` | Delete crop |
| POST | `/insights/ai/ask` | Ask AI advisor |
| GET | `/insights/weather` | Weather (opt. `?latitude&longitude`) |
| GET | `/insights/market/prices` | Mandi prices |
| GET | `/insights/market/mandi` | Nearby mandis |
| GET | `/` | Root banner |
| GET | `/health` | Health + DB connectivity |

Auth-protected routes require `Authorization: Bearer <jwt>`.

---

## 6. How to Run

### Backend
```
cd backend
# create/activate venv, install: pip install -r requirements.txt
# set env vars in backend/.env (DATABASE_URL, SECRET_KEY, GEMINI_KEY, OPENWEATHER_KEY, CORS_ORIGINS)
alembic upgrade head          # apply migrations
uvicorn app.main:app --reload --port 8000
```
Run tests: `cd backend && pytest` (or with venv: `venv\Scripts\activate` then `pytest`).

### Frontend
```
npm install
npm run dev        # Vite dev server; /api proxied to :8000
npm run build      # production build
npm run lint       # eslint --quiet
npm run typecheck  # tsc -p ./jsconfig.json
```

---

## 7. Conventions & Instructions for Future Agents

**Do this at the start of every task:**
1. Read this `done.md`.
2. Run `git status` and `git log --oneline -10` to see uncommitted work and branch.
3. Check `.env` / config for required secrets (never commit real secrets).

**Coding conventions:**
- **Frontend is JavaScript (JSX)**, not TypeScript (despite a `tsc` typecheck script). Match existing style: named `export default`, single quotes, no semicolons where the codebase omits them, 2-space indent.
- **Import alias**: `@/` maps to `src/`. Use `@/components/...`, `@/lib/...`, `@/pages/...`.
- **Do not add code comments** unless asked — the codebase has minimal comments.
- **All backend calls go through `src/lib/api.js`** — add new API methods there, never call `fetch` directly in pages.
- **Auth token** read from `localStorage` keys `kisaan_token` / `base44_access_token` / `token` (see `api.js getToken()`).
- **UI strings**: add to `languageContext.jsx` `translations` for every supported language and access via `useLang().t('key')`. Keep Hindi (`hi`) special-casing consistent — several pages do `const isHindi = lang === 'hi'`.
- **UI components**: reuse `@/components/ui/*` primitives, `GlassCard`, `StatusChip`, `ConfirmDialog`, `FormField`. Mobile-first; use `glass` utility classes.
- **Data fetching**: pages use local `useState` + `useEffect` calling `api.*` (see Farms/FarmDetail). Some pages use React Query. When adding a new data page, follow the existing Farms/FarmDetail pattern (loading → error → empty → data states).
- **Routing**: register new protected pages inside the `<Route element={<AppLayout />}>` block in `App.jsx`.
- **Backend**: put route logic in `app/api/v1/<resource>.py`, business logic in `app/services/<resource>_service.py`, Pydantic schemas in `app/schemas/`, models in `app/models/`. Add Alembic migrations for schema changes. Add pytest coverage under `backend/tests/`.
- **Ownership**: always scope queries to `current_user` to preserve the ownership pattern used for farms/crops.

**Before finishing a task:**
- Run `npm run build` (and `npm run lint`) for frontend changes; run `pytest` for backend changes.
- Commit only when the user asks. Use a concise message matching repo style (e.g. `FARMS AND CROP BACKEND`).
- **Update this `done.md`** — add what changed, new routes, new conventions, and refresh the status/uncommitted-work sections.

---

## 8. Current Git State

- Branch: `backend-foundation` (tracking `origin/backend-foundation`).
- **Uncommitted**: Farms/FarmDetail/Crops UI, form dialogs, ConfirmDialog, form-field, Home + MenuDrawer + App + api.js changes, the full animation system (§11), and the bug-fix/hardening pass (§12).
- Verify with `npm run lint`, `npm run typecheck`, `npm run build` before committing.

---

## 9. Docker & Deployment

### Docker Setup (added)

The project now has full Docker support so anyone can run it with a single command:

| File | Purpose |
|------|---------|
| `Dockerfile` | Frontend multi-stage build (Node 20 → Nginx) |
| `backend/Dockerfile` | Backend Python 3.12 image with auto-migrations |
| `nginx.conf` | Nginx config: SPA routing + `/api` proxy to backend |
| `docker-compose.yml` | Orchestrates frontend, backend, and PostgreSQL 16 |
| `.dockerignore` | Root build context exclusions |
| `backend/.dockerignore` | Backend build context exclusions |
| `.env.example` | Frontend env template |
| `backend/.env.example` | Backend env template |
| `DEPLOYMENT.md` | Full Docker + deployment guide |

### Run with Docker

```bash
cp backend/.env.example backend/.env
cp .env.example .env
# Edit backend/.env with your secrets
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:8000`
- Health: `http://localhost:8000/health`

### Backend Deployment

See `DEPLOYMENT.md` for detailed instructions. Options include:
- **Render** (recommended, free tier) — set root dir to `backend`, build: `pip install -r requirements.txt`, start: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Railway** — root dir `backend`, auto-deploy on push
- **VPS** — `docker-compose up -d --build`
- **Manual** — venv + uvicorn

---

## 10. Future Tasks / Backlog

- Notifications endpoint + UI
- Verified advisories endpoint
- Reports / Analytics endpoints
- Village status endpoint
- Offline downloads endpoint
- Crop health scoring API
- ForgotPassword / ResetPassword pages (routes already defined in `App.jsx`, placeholder pages exist)
- Photo upload / leaf-disease detection via AI
- Expand language coverage to all UI strings
- CI/CD pipeline (GitHub Actions for automated tests + deploy)

---

## 11. Animation System

- `src/lib/animation.js` wraps **animejs v4** (which uses **named exports only** — import `{ animate as anime, stagger }`, there is no default export). Helpers: `animateEntrance`, `animateStaggerEntrance`, `animateScalePop`, `animatePress`/`animateRelease`, `animateProgress`, `animateCount`, `animateSlideFadeIn/Out`, `animateFloat`, `animateBreathe`, `animateSuccessBurst`, `animateShake`, plus `useScrollReveal()` and `useReducedMotion()`.
- `prefersReducedMotion()` is exported; components gate all JS animations on it. **Important:** elements set to `opacity: 0` and only revealed by JS must set `opacity: 1` in the reduced-motion branch, or content stays invisible for those users.
- `PageTransition` renders the `<Outlet>` directly (it forwards an optional `outletContext` prop) — do not nest a second `<Outlet>` around it.

## 12. Bug-fix / Hardening Pass (uncommitted)

Everything below now verified with `npm run lint`, `npm run build`, `npm run typecheck` passing:

- **App-crash fix**: `AppLayout` now passes `outletContext` into `PageTransition`, which forwards it to its `<Outlet>` so `PageHeader`'s `useOutletContext().openMenu/openLanguage` no longer throws.
- **`src/lib/api.js`**:
  - `request()` parses JSON via `text()` + `JSON.parse` and returns `null` on `204`, so `DELETE /farms|/crops` no longer fails on empty responses.
  - 401 session-expiry redirect is **skipped for `/auth/*`** endpoints so a failed login shows the real error instead of "session expired".
  - Errors carry a `status` property (fixes Crops 401 detection).
  - `getWeather` no longer drops valid `(0,0)` coordinates.
  - Added `resetPasswordRequest`/`resetPassword`.
- **`src/lib/AuthContext.jsx`**: `login()` is now awaitable (awaited by Login/Register before navigating, fixing the transient login-screen flash); `logout()` clears all three token keys and the React Query cache.
- **Removed `db.*` ghost calls** in `ForgotPassword`, `ResetPassword`, `PageNotFound` (replaced with `api.*`); wired `/forgot-password` and `/reset-password` routes.
- **`src/pages/Home.jsx`**: `Promise.all` → `Promise.allSettled` (one failing endpoint no longer blanks the dashboard), guarded `rec.action.split`, fallback `topMarket`, enabled alert "Check" link, reduced-motion scheme cards no longer stuck at `opacity:0`.
- **`src/pages/Market.jsx`**: normalized `trend`/`suggestion` to known keys to prevent `Element type is invalid` crashes.
- **`src/pages/AI.jsx`**: `TypingText` guards non-string text; AI response fields normalized before append.
- **`src/pages/FarmDetail.jsx`**: repaired corrupted UTF-8 (garbled Hindi + emoji).
- **`src/pages/Crops.jsx`**: real 401 detection via `e.status`, "Check leaf" quick action navigates to `/ai`.
- **`src/components/ui/OfflineIndicator.jsx`**: subscribes to `online`/`offline` events (was hardcoded online).
- **`src/components/mascot/KisaanMascot.jsx`**: removed dead `onSuccess`/celebration logic and effect churn.
- **`src/components/ProtectedRoute.jsx`**: `checkUserAuth` → `checkAuth` (dead code, latent crash removed).
- **Wired previously-dead buttons**: Reports download (visual state), OfflineDownloads save (stateful), VerifiedAdvisories read-more (expandable body), Help cards (`tel:`/WhatsApp links), RecommendationCard Do-it/Wait + Why (toggle/expand). Added `done` translation key across all 7 languages.
- **Persistence**: language and theme now persist to `localStorage` (`kisaan_lang`, `kisaan_theme`).
- **`jsconfig.json`** created so `npm run typecheck` works (was pointing at a missing file).
- **White-screen crash fix (animejs v3→v4 migration)**: `src/lib/animation.js` called `anime({ targets, ... })` (v3 style) and returned `.finished`, but the installed **animejs v4.5.0** requires `animate(targets, params)` and returns a thenable animation object — the old signature passed the config as `targets`, leaving `parameters` `undefined` and throwing `Cannot read properties of undefined (reading 'keyframes')` inside `JSAnimation`. Rewrote all 13 helpers to `animate(targets, { ... })`, replaced string `cubicBezier(...)`/`easeInOutSine` easings with the v4 `cubicBezier()`/`eases.inOutSine` functions, and return the animation object (thenable) so existing `.then()` / `Promise.all` / `.pause()` consumers keep working.
- **DOM nesting fix**: `AuthLayout` rendered the `footer` prop inside a `<p>` while `Login`/`Settings` pass block-level `<div>`s in it (React `validateDOMNesting` warning). The footer container is now a `<div>` (same classes, no visual change).
- Verified: `npm run lint`, `npm run typecheck`, `npm run build` (1804 modules) all pass; dev server boots and serves `HTTP 200`.

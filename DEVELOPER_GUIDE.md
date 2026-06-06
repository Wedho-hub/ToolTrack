# ToolTrack — Developer Guide

**Stack:** MongoDB · Express · React 18 · Node.js (MERN)  
**Repository:** https://github.com/Wedho-hub/ToolTrack  
**Live backend:** https://tooltrack.onrender.com  
**Live frontend:** https://tooltracking.netlify.app

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Local Development Setup](#3-local-development-setup)
4. [Environment Variables](#4-environment-variables)
5. [Data Models](#5-data-models)
6. [Authentication System](#6-authentication-system)
7. [API Reference](#7-api-reference)
8. [Return Verification Workflow](#8-return-verification-workflow)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Deployment](#10-deployment)
11. [Known Constraints & Gotchas](#11-known-constraints--gotchas)
12. [Extension Guide](#12-extension-guide)

---

## 1. Architecture Overview

```
Browser (React SPA on Netlify)
        │
        │  HTTPS / JSON  (Axios + JWT Bearer token)
        ▼
Express REST API (Node.js on Render)
        │
        │  Mongoose ODM
        ▼
MongoDB Atlas (cloud cluster)
```

The frontend is a single-page application built with React 18 and Vite. It communicates exclusively through a JSON REST API. Authentication is stateless — the browser stores a JWT in `localStorage` and sends it on every request via an Axios interceptor.

The backend is a standard Express application using ES module syntax (`import`/`export`). All business logic is in controllers; routes are thin wrappers. Mongoose models enforce schema validation at the ODM level.

There is no server-side rendering, no WebSockets, and no message queue. The app is deliberately kept simple so it is easy to extend or hand off.

---

## 2. Project Structure

```
ToolTrack/
│
├── README.md               # Project overview and quick-start
├── USER_GUIDE.md           # End-user documentation
├── DEVELOPER_GUIDE.md      # This file
├── DEPLOYMENT_GUIDE.md     # Production deployment checklist
│
├── backend/
│   ├── server.js           # Express app: middleware, routes, error handler
│   ├── package.json        # Backend dependencies (ES modules)
│   ├── .env                # Local secrets — never committed
│   │
│   ├── config/
│   │   └── db.js           # Mongoose connection with retry logic
│   │
│   ├── models/
│   │   ├── Tool.js         # Tool schema (see §5)
│   │   └── User.js         # User schema with pre-save password hash
│   │
│   ├── controllers/
│   │   ├── authController.js    # register, login, getCurrentUser
│   │   ├── toolController.js    # CRUD + assign + requestReturn + confirmReturn + rejectReturn
│   │   └── userController.js    # Admin user management (getAll, getById, update, delete)
│   │
│   ├── middleware/
│   │   └── authMiddleware.js    # protect (JWT verify) + authorize (role guard)
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── toolRoutes.js        # /api/tools/*
│   │   └── userRoutes.js        # /api/users/*
│   │
│   └── scripts/
│       └── resetPassword.js    # CLI utility to reset a user's password
│
└── frontend/
    ├── index.html          # SPA shell — imports Bootstrap Icons CDN
    ├── vite.config.js      # Vite config (React plugin)
    ├── package.json        # Frontend dependencies
    ├── api.js              # Axios instance + all API call definitions
    ├── .env                # Local dev (VITE_API_URL=http://localhost:5000)
    ├── .env.production     # Production (VITE_API_URL=https://tooltrack.onrender.com)
    │
    └── src/
        ├── main.jsx        # ReactDOM.createRoot, imports Bootstrap CSS
        ├── App.jsx         # Router + route definitions + AuthProvider
        ├── App.css         # Minimal root override
        ├── index.css       # Reset (replaces Vite defaults)
        │
        ├── contexts/
        │   └── AuthContext.jsx   # token, user, login(), logout(), loading
        │
        ├── components/
        │   ├── Navbar.jsx        # Shared sticky navigation bar
        │   └── ProtectedRoute.jsx # Wrapper: redirect to /login if unauthenticated
        │
        ├── pages/
        │   ├── Welcome.jsx       # Public marketing landing page
        │   ├── Login.jsx         # Split-panel auth form
        │   ├── Register.jsx      # Registration with role picker + strength meter
        │   ├── Dashboard.jsx     # Worker view: assigned tools, request return
        │   ├── ViewTools.jsx     # Read-only inventory browser with search/filter
        │   ├── ManageTools.jsx   # Admin panel: table, pending returns, assign modal
        │   ├── AddEditTool.jsx   # Add/edit tool form (admin only)
        │   └── NotFound.jsx      # 404 catch-all
        │
        └── styles/
            ├── global.css        # CSS variables, base styles, utilities
            ├── dashboard.css     # Dashboard-specific styles
            ├── bootstrap-custom.css
            └── comments.css
```

---

## 3. Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A MongoDB instance (local or [MongoDB Atlas free tier](https://www.mongodb.com/atlas))

### Step 1 — Clone

```bash
git clone https://github.com/Wedho-hub/ToolTrack.git
cd ToolTrack
```

### Step 2 — Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 3 — Create environment files

**`backend/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tooltrack
JWT_SECRET=dev-secret-change-in-production
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

> `.env` files are in `.gitignore` and are never committed. Only `.env.production` (which contains no secrets — just the public Render URL) is committed.

### Step 4 — Start servers

```bash
# Terminal 1
cd backend && npm run dev      # nodemon, restarts on changes

# Terminal 2
cd frontend && npm run dev     # Vite HMR, runs on :5173
```

Open [http://localhost:5173](http://localhost:5173).

### Step 5 — Seed an admin account

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@demo.com","password":"admin123","role":"admin"}' \
  | python -m json.tool
```

---

## 4. Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | Full MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs. Use at least 64 random characters in production. |
| `FRONTEND_URL` | Yes | Deployed frontend URL — added to the CORS allowlist |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Set to `production` on Render to suppress dev error stacks |

### Frontend (`frontend/.env` / `frontend/.env.production`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL (without `/api` — the `api.js` module appends it automatically) |

> **Why two env files?** Vite uses `.env` in `npm run dev` and `.env.production` in `npm run build`. The production file is committed because it contains only a public URL, not a secret.

---

## 5. Data Models

### Tool (`backend/models/Tool.js`)

```js
{
  name:               String   required
  description:        String
  category:           Enum     ['Hand Tools','Power Tools','Measuring Tools','Safety Equipment','Other']
  totalQuantity:      Number   default: 1
  availableQuantity:  Number   default: 1
  location:           String
  condition:          Enum     ['new','good','fair','poor','damaged']  default: 'good'
  imageUrl:           String
  status:             Enum     ['available','in-use','pending-return','damaged']  default: 'available'
  assignedTo:         ObjectId ref: 'User'  default: null
  returnRequestedAt:  Date     default: null   — set when worker calls requestReturn
  returnRequestedBy:  ObjectId ref: 'User'  default: null   — the user who requested
  createdAt:          Date     (auto)
  updatedAt:          Date     (auto)
}
```

**Status transitions:**

```
available  ──(assign)──►  in-use  ──(requestReturn)──►  pending-return
    ▲                                                           │
    └──────────────────────(confirmReturn)──────────────────────┘
                                                                │
                                       (rejectReturn)──►  in-use (reverts)
```

### User (`backend/models/User.js`)

```js
{
  name:       String   required
  email:      String   required, unique
  password:   String   bcrypt-hashed via pre-save hook (10 salt rounds)
  role:       Enum     ['admin','worker']  default: 'worker'
  createdAt:  Date     (auto)
  updatedAt:  Date     (auto)
}
```

> The password is hashed in a Mongoose `pre('save')` hook. The raw password is never stored. The comparison happens in `authController.login` using `bcrypt.compare`.

---

## 6. Authentication System

### Token lifecycle

1. Client POSTs credentials to `/api/auth/login`
2. Server validates, signs a JWT: `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })`
3. Token returned in response body
4. Client stores token in `localStorage`
5. Axios request interceptor (`frontend/api.js`) reads token and sets `Authorization: Bearer <token>` on every request
6. Axios response interceptor catches 401 responses, removes the token, and redirects to `/login`
7. `backend/middleware/authMiddleware.js:protect` verifies the token on every protected route and attaches the full user document to `req.user`

### Role guard

```js
// Usage in routes:
router.post('/tools/:id/assign',
  authMiddleware.protect,
  authMiddleware.authorize('admin'),  // rejects with 403 if role !== 'admin'
  toolController.assignTool
);
```

`authorize(...roles)` is a middleware factory that checks `req.user.role` against the allowed list.

### Frontend route protection

`ProtectedRoute` wraps routes in `App.jsx`:

```jsx
<Route path="/manage-tools" element={
  <ProtectedRoute requiredRole="admin">
    <ManageTools />
  </ProtectedRoute>
} />
```

- If no token → redirect to `/login`
- If token but wrong role → redirect to `/dashboard`
- While auth state loads → show spinner

---

## 7. API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth — `/api/auth`

| Method | Path | Access | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{ name, email, password, role }` | `{ token, name, email, role, _id }` |
| POST | `/auth/login` | Public | `{ email, password }` | `{ token, name, email, role, _id }` |
| GET | `/auth/me` | Protected | — | User object |

### Tools — `/api/tools`

| Method | Path | Access | Body | Returns |
|---|---|---|---|---|
| GET | `/tools` | Protected | — | `{ success, tools[] }` |
| GET | `/tools/my-tools` | Protected | — | `{ success, tools[] }` |
| GET | `/tools/:id` | Protected | — | `{ success, tool }` |
| POST | `/tools` | Admin | `{ name, description, category, quantity, location, condition, imageUrl }` | `{ success, tool }` |
| PUT | `/tools/:id` | Admin | Any tool fields | `{ success, tool }` |
| DELETE | `/tools/:id` | Admin | — | `{ success, message }` |
| POST | `/tools/:id/assign` | Admin | `{ userId }` | `{ success, tool, message }` |
| POST | `/tools/:id/request-return` | Protected (assignee or admin) | — | `{ success, tool, message }` |
| POST | `/tools/:id/confirm-return` | Admin | — | `{ success, tool, message }` |
| POST | `/tools/:id/reject-return` | Admin | `{ reason? }` | `{ success, tool, message }` |

### Users — `/api/users`

| Method | Path | Access | Body | Returns |
|---|---|---|---|---|
| GET | `/users` | Admin | — | `{ success, users[] }` |
| GET | `/users/:id` | Admin | — | `{ success, user }` |
| PUT | `/users/:id` | Admin | Any user fields | `{ success, user }` |
| DELETE | `/users/:id` | Admin | — | `{ success, message }` |

### Health check

```
GET /api/health
Response: { "status": "OK", "message": "Server is running" }
```

### Error format

All errors follow the same shape:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

HTTP status codes used: `200`, `201`, `400` (bad request), `401` (unauthenticated), `403` (forbidden), `404` (not found), `500` (server error).

---

## 8. Return Verification Workflow

### Why it exists

Without it, a worker could click "Return" on their phone while the tool is still at a job site. The tool would immediately show as available, other workers could be told to pick it up, and it would not be there. This creates inventory loss.

### How it works (backend detail)

**`POST /tools/:id/request-return`** (`toolController.requestReturn`)
- Validates: tool exists, is assigned, not already pending
- Validates: requesting user is the assignee OR an admin
- Sets `status = 'pending-return'`, `returnRequestedAt = now`, `returnRequestedBy = req.user.id`
- Does NOT change `assignedTo`, `availableQuantity`, or anything else

**`POST /tools/:id/confirm-return`** (`toolController.confirmReturn`)
- Admin only
- Validates: tool is in `pending-return` state
- Sets `assignedTo = null`, `availableQuantity += 1` (capped at totalQuantity), `status = 'available'`
- Clears `returnRequestedAt` and `returnRequestedBy`

**`POST /tools/:id/reject-return`** (`toolController.rejectReturn`)
- Admin only
- Validates: tool is in `pending-return` state
- Sets `status = 'in-use'` (reverts to previous state)
- Clears `returnRequestedAt` and `returnRequestedBy`
- Optionally logs a reason (returned in response message)

### Frontend integration

- **Dashboard.jsx** — "Request Return" button only appears for `in-use` tools. `pending-return` tools show a spinner badge and an explanation.
- **ManageTools.jsx** — The blue "Pending Returns" panel is shown at the top only when `pendingReturns.length > 0`. Each row shows Accept (green) and Reject (red, opens modal with reason field).
- **ViewTools.jsx** — `pending-return` shows as a blue "Pending Return" badge. Available as a filter option.

---

## 9. Frontend Architecture

### State management

Global state is limited to authentication (`AuthContext`). Everything else is local component state fetched from the API on mount. There is no Redux, Zustand, or other state library — the app is simple enough that Context + `useState` is sufficient.

### `AuthContext.jsx`

```
Provides: { token, user, login(token, userData), logout(), loading }
```

On mount: if a token exists in `localStorage`, it calls `GET /auth/me` to validate it and populate the user object. If the token is expired or invalid, it clears localStorage and sets `user = null`.

`loading` is `true` during this initial check. `ProtectedRoute` and page components wait for `loading === false` before rendering content.

### `api.js` — Axios instance

All API calls go through a single Axios instance configured in `frontend/api.js`. The base URL is determined at build time from `VITE_API_URL`. The module normalizes the URL to always end with `/api`.

Two interceptors are registered:
- **Request**: attaches `Authorization: Bearer <token>` from `localStorage`
- **Response**: on 401, clears `localStorage` and redirects to `/login`

### Route structure (`App.jsx`)

```
/              → Welcome        (public)
/login         → Login          (public)
/register      → Register       (public)
/dashboard     → Dashboard      (protected)
/view-tools    → ViewTools      (protected)
/add-tool      → AddEditTool    (admin)
/manage-tools  → ManageTools    (admin)
/manage-tools/add       → AddEditTool  (admin)
/manage-tools/edit/:id  → AddEditTool  (admin)
*              → NotFound       (catch-all)
```

### CSS approach

- Bootstrap 5 handles layout, grid, and components
- Bootstrap Icons loaded via CDN in `index.html`
- Custom CSS variables defined in `src/styles/global.css` (`--primary-color`, `--shadow-md`, etc.)
- Inline styles used for one-off values (gradient backgrounds, border-radius on modals)
- `hover-lift` utility class adds card hover animation

---

## 10. Deployment

Full details are in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Summary:

| Layer | Platform | Trigger |
|---|---|---|
| Frontend | Netlify | Auto-deploy on push to `main` |
| Backend | Render | Auto-deploy on push to `main` |
| Database | MongoDB Atlas | Manual (connection string in Render env vars) |

**Critical:** The `frontend/public/_redirects` file (`/* /index.html 200`) is required for Netlify SPA routing. Without it, any page refresh on a non-root URL returns a 404.

**Render cold starts:** The free tier of Render spins down after 15 minutes of inactivity. The first request after a sleep takes 30–60 seconds. The frontend shows a spinner while this happens.

---

## 11. Known Constraints & Gotchas

**One assignee per tool record.** The schema stores a single `assignedTo` ObjectId. If you have 5 identical drills, you need 5 separate tool records (or increment `totalQuantity` and track them as a pool rather than individually). Individual tracking is recommended for accountability.

**No email notifications.** Return requests, rejections, and assignments are visible in the UI but there is no email or push notification system. Workers must check their dashboard.

**Password reset requires CLI.** There is no "forgot password" flow in the UI. Admins must run `backend/scripts/resetPassword.js` from the terminal.

**JWT_SECRET security.** The default value in `backend/.env` is `your_jwt_secret_key`. This MUST be changed to a strong random string before sharing with real users. Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Render free tier.** The backend sleeps after 15 minutes of inactivity. Consider upgrading to a paid Render instance or using a cron service to ping `/api/health` every 10 minutes if uptime is critical.

**MongoDB Atlas free tier.** The free M0 cluster has a 512 MB storage limit and limited connection count. Sufficient for hundreds of tools and users; consider upgrading for large organizations.

---

## 12. Extension Guide

The codebase is intentionally lean. Here are the most likely extensions and where to make them.

### Add email notifications

1. Install `nodemailer` in the backend
2. Create `backend/services/emailService.js`
3. Call it from `toolController.assignTool`, `toolController.confirmReturn`, and `toolController.rejectReturn`
4. Add `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` to `.env`

### Add a tool request workflow (worker requests → admin approves)

1. Add a `ToolRequest` model with fields: `requestedBy`, `tool` (or `toolCategory`), `status`, `message`
2. Add `POST /api/requests` (worker), `GET /api/requests` (admin), `POST /api/requests/:id/approve` (admin)
3. Add a "Request a Tool" button on the Dashboard / ViewTools page
4. Add a "Pending Requests" panel to ManageTools alongside the existing Pending Returns panel

### Add QR code labels

1. Install `qrcode` in the frontend (`npm install qrcode`)
2. On each tool in ManageTools, add a "Print QR" button
3. Generate a QR code containing the tool ID URL (e.g. `https://tooltracking.netlify.app/tools/<id>`)
4. Open a print dialog with the generated QR image

### Add a maintenance log

1. Add a `MaintenanceRecord` model: `{ tool, date, description, performedBy, cost }`
2. Add routes under `/api/tools/:id/maintenance`
3. Add a "Maintenance History" tab on the tool detail view

### Add CSV export

1. Install `papaparse` in the frontend
2. Add an "Export CSV" button on ViewTools / ManageTools
3. Call `Papa.unparse(tools)` and trigger a file download

### Add dark mode

1. Add a `data-theme="dark"` attribute to `<html>` via a toggle in Navbar
2. Mirror all CSS variables in `global.css` under `[data-theme="dark"] { ... }`
3. Persist the preference in `localStorage`

### Replace inline toast with a library

Currently the app uses simple inline `useState`-based toasts. To add stacking, persistence, or animations:

1. `npm install react-hot-toast` (or `react-toastify`) in `frontend/`
2. Wrap the app in the `<Toaster />` provider in `main.jsx`
3. Replace `showToast(message, type)` calls across Dashboard, ManageTools with `toast.success()` / `toast.error()`

# ToolTrack — Tool Inventory & Assignment Management

**ToolTrack** is a production-ready full-stack web application that gives organizations real-time control over their physical tool inventory. Admins manage and assign tools; workers see exactly what they've been issued and can return it with one click.

Live demo: [tooltracking.netlify.app](https://tooltracking.netlify.app)  
Backend API: [tooltrack.onrender.com](https://tooltrack.onrender.com/api/health)

**Documentation:**
- [User Guide](USER_GUIDE.md) — step-by-step guide for admins and workers
- [Developer Guide](DEVELOPER_GUIDE.md) — architecture, API reference, extension guide
- [Deployment Guide](DEPLOYMENT_GUIDE.md) — production deployment checklist

---

## Why ToolTrack?

Most teams track tools on spreadsheets — or not at all. ToolTrack replaces that with a clean, role-aware web app backed by a secure REST API. It's designed to be easy to hand off, extend, or white-label.

---

## Feature Highlights

| Feature | Details |
|---|---|
| **Inventory Management** | Add tools with name, category, condition, quantity, location, and image |
| **Tool Assignment** | Assign tools to workers; availability counts update automatically |
| **Verified Returns** | Workers submit a return request; admin physically inspects and confirms before the tool is released back to stock |
| **Reject Return** | Admin can reject a return with a reason — tool stays assigned to the worker until physically received |
| **Role-Based Access** | Admins have full CRUD control; workers see only their assigned tools |
| **Search & Filter** | Filter by name, category, or status across the full inventory |
| **JWT Authentication** | 30-day tokens, auto-logout on expiry, bcrypt-hashed passwords |
| **Password Strength Meter** | Live feedback during registration |
| **Responsive Design** | Fully usable on mobile, tablet, and desktop |
| **404 Handling** | Graceful not-found page with navigation recovery |

---

## Tech Stack

### Frontend
- **React 18** with Vite — fast dev server and optimized production builds
- **React Router v6** — client-side routing with protected routes
- **Bootstrap 5** — responsive grid and utility classes
- **Axios** — HTTP client with request/response interceptors
- **Context API** — lightweight global auth state

### Backend
- **Node.js + Express** — REST API with clean controller/route separation
- **MongoDB + Mongoose** — flexible document store with ODM
- **JWT** — stateless authentication with `jsonwebtoken`
- **bcryptjs** — password hashing with salted rounds
- **CORS** — configured for local dev and production domains

### Infrastructure
- **Frontend**: Netlify (CI/CD via Git push)
- **Backend**: Render.com
- **Database**: MongoDB Atlas (cloud)

---

## Project Structure

```
ToolTrack/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getCurrentUser
│   │   ├── toolController.js     # CRUD + assign + return
│   │   └── userController.js     # Admin user management
│   ├── middleware/authMiddleware.js  # JWT verify + role guard
│   ├── models/
│   │   ├── Tool.js               # Tool schema
│   │   └── User.js               # User schema (pre-save hash)
│   ├── routes/                   # Express routers
│   └── server.js                 # App entry, CORS, error handling
│
└── frontend/
    ├── api.js                    # Axios instance + interceptors
    └── src/
        ├── components/
        │   ├── Navbar.jsx        # Shared sticky navigation
        │   └── ProtectedRoute.jsx
        ├── contexts/AuthContext.jsx
        ├── pages/
        │   ├── Welcome.jsx       # Marketing landing page
        │   ├── Login.jsx         # Split-panel login
        │   ├── Register.jsx      # Register with role picker + strength meter
        │   ├── Dashboard.jsx     # Worker: assigned tools + return
        │   ├── ViewTools.jsx     # All tools with search/filter
        │   ├── ManageTools.jsx   # Admin: table view + assign modal
        │   ├── AddEditTool.jsx   # Add/edit tool form
        │   └── NotFound.jsx      # 404 page
        └── styles/global.css     # CSS variables + utility classes
```

---

## User Roles

| Action | Worker | Admin |
|---|---|---|
| View all tools | ✅ | ✅ |
| View assigned tools | ✅ | ✅ |
| Request a return | ✅ | ✅ |
| Accept / reject return requests | ❌ | ✅ |
| Add / edit / delete tools | ❌ | ✅ |
| Assign tools to workers | ❌ | ✅ |
| Manage users | ❌ | ✅ |

---

## API Reference

### Auth — `/api/auth`
```
POST   /api/auth/register    Register a new user (returns JWT)
POST   /api/auth/login       Login (returns JWT)
GET    /api/auth/me          Get current user  [protected]
```

### Tools — `/api/tools`
```
GET    /api/tools            List all tools    [protected]
GET    /api/tools/my-tools   User's tools      [protected]
GET    /api/tools/:id        Single tool       [protected]
POST   /api/tools            Create tool       [admin]
PUT    /api/tools/:id        Update tool       [admin]
DELETE /api/tools/:id        Delete tool       [admin]
POST   /api/tools/:id/assign          Assign to user       [admin]
POST   /api/tools/:id/request-return  Worker requests return [protected]
POST   /api/tools/:id/confirm-return  Admin accepts return   [admin]
POST   /api/tools/:id/reject-return   Admin rejects return   [admin]
```

### Users — `/api/users`
```
GET    /api/users            List all users    [admin]
GET    /api/users/:id        Single user       [admin]
PUT    /api/users/:id        Update user       [admin]
DELETE /api/users/:id        Delete user       [admin]
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB (local) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1 — Clone and install

```bash
git clone https://github.com/your-username/ToolTrack.git
cd ToolTrack

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2 — Configure environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tooltrack
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3 — Start dev servers

```bash
# Terminal 1 — backend (runs on :5000)
cd backend && npm run dev

# Terminal 2 — frontend (runs on :5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4 — Create your first admin

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@demo.com","password":"admin123","role":"admin"}'
```

Or use the Register page and select **Admin** role.

---

## Production Deployment

### Frontend (Netlify)

```bash
cd frontend && npm run build
# Deploy the dist/ folder, or connect your repo for auto-deploy
```

Set environment variable in Netlify: `VITE_API_URL=https://your-backend.onrender.com`

Add a `_redirects` file inside `frontend/public/`:
```
/*  /index.html  200
```

### Backend (Render / any Node host)

Set environment variables:
```
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<strong secret>
FRONTEND_URL=https://your-app.netlify.app
NODE_ENV=production
```

Health check endpoint: `GET /api/health`

### PM2 (self-hosted)

```bash
npm install -g pm2
pm2 start backend/server.js --name tooltrack-api
pm2 save && pm2 startup
```

---

## Data Models

### Tool
```js
{
  name:              String   (required)
  description:       String
  category:          Enum ['Hand Tools','Power Tools','Measuring Tools','Safety Equipment','Other']
  totalQuantity:     Number   (default: 1)
  availableQuantity: Number   (default: 1)
  location:          String
  condition:         Enum ['new','good','fair','poor','damaged']
  imageUrl:          String
  status:              Enum ['available','in-use','pending-return','damaged']
  assignedTo:          ObjectId → User
  returnRequestedAt:   Date (set when worker submits return request)
  returnRequestedBy:   ObjectId → User (who submitted the request)
  createdAt / updatedAt: timestamps
}
```

### User
```js
{
  name:     String (required)
  email:    String (required, unique)
  password: String (bcrypt-hashed, pre-save hook)
  role:     Enum ['admin','worker'] (default: 'worker')
  createdAt / updatedAt: timestamps
}
```

---

## Potential Extensions

- Email notifications when a tool is assigned or overdue
- Tool request workflow (workers request; admin approves)
- QR code labels for physical tools
- Maintenance scheduling and service history
- CSV export of inventory or assignment history
- Dark mode

---

## License

MIT — free to use, modify, and distribute.

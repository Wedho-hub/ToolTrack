# ToolTrack — Production Deployment Guide

**Live URLs:**
- Frontend: https://tooltracking.netlify.app
- Backend API: https://tooltrack.onrender.com
- Health check: https://tooltrack.onrender.com/api/health

---

## Architecture

```
GitHub (main branch)
    │
    ├── push → Netlify auto-builds frontend  (frontend/dist → CDN)
    └── push → Render auto-deploys backend   (Node.js service)
                    │
                    └── connects to MongoDB Atlas cluster
```

---

## Backend (Render)

### Environment variables

Set these in your **Render dashboard → Service → Environment**:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret (64+ hex chars — see below) |
| `FRONTEND_URL` | `https://tooltracking.netlify.app` |
| `NODE_ENV` | `production` |

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Build settings (Render dashboard)

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm install` |
| Start command | `node server.js` |
| Node version | 18 or higher |

### Verify backend is running

```bash
curl https://tooltrack.onrender.com/api/health
# Expected: {"status":"OK","message":"Server is running"}
```

> **Cold start note:** Render free tier services sleep after 15 minutes of inactivity. The first request after waking takes 30–60 seconds. The frontend shows a loading spinner during this time. Consider a free uptime monitor (e.g. UptimeRobot) to ping `/api/health` every 10 minutes.

---

## Frontend (Netlify)

### Environment variables

Set in **Netlify dashboard → Site → Environment variables**:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://tooltrack.onrender.com` |

> Do not include `/api` at the end — `frontend/api.js` appends it automatically.

### Build settings (Netlify dashboard)

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |
| Node version | 18 |

### SPA routing

The file `frontend/public/_redirects` is committed to the repo:

```
/*  /index.html  200
```

This tells Netlify to serve the React app for all routes, preventing 404s on page refresh. **Do not delete this file.**

### Manual build and deploy

If auto-deploy is not connected:

```bash
cd frontend
npm run build         # outputs to frontend/dist/
# Drag and drop frontend/dist/ into Netlify dashboard, or:
npx netlify deploy --prod --dir=dist
```

---

## Database (MongoDB Atlas)

### Connection string format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your Atlas values. The database name (`<dbname>`) can be `tooltrack` — MongoDB creates it on first write.

### Network access

In Atlas → **Network Access**, ensure your Render server's IP is whitelisted. For Render free tier (dynamic IPs), allow `0.0.0.0/0` (all IPs) — acceptable for non-sensitive data; restrict to a static IP if you upgrade.

### Free tier limits (M0)

- 512 MB storage
- Shared CPU/RAM
- No dedicated ops advisors
- Sufficient for hundreds of tools and users

---

## Git → CI/CD Flow

Both Netlify and Render watch the `main` branch on GitHub. A `git push origin main` triggers:

1. Netlify: runs `npm run build` in `frontend/`, deploys `dist/`
2. Render: pulls `backend/`, runs `npm install`, restarts the service

No manual steps needed after initial setup.

---

## Common Issues & Solutions

| Symptom | Cause | Fix |
|---|---|---|
| All API calls return 404 | Wrong `VITE_API_URL` | Check Netlify env var — must be `https://tooltrack.onrender.com` (no trailing `/api`) |
| CORS error in browser console | `FRONTEND_URL` not set on Render | Add `FRONTEND_URL=https://tooltracking.netlify.app` in Render environment |
| Login fails in production but works locally | `JWT_SECRET` mismatch | Make sure Render's `JWT_SECRET` matches what tokens were signed with |
| Page refresh returns 404 on Netlify | Missing `_redirects` | Confirm `frontend/public/_redirects` exists with `/* /index.html 200` |
| Backend takes 30–60s to respond | Render cold start | Expected on free tier — add uptime monitor to keep it warm |
| "Cannot connect to MongoDB" in Render logs | IP not whitelisted in Atlas | Set Atlas Network Access to `0.0.0.0/0` or whitelist Render IPs |
| Frontend build fails on Netlify | Missing env var | Add `VITE_API_URL` to Netlify environment variables |
| JWT token invalid after new deploy | `JWT_SECRET` changed | Changing the secret invalidates all existing tokens — users must log in again |

---

## Password Reset (CLI)

There is no in-app password reset. To reset a user's password:

```bash
cd backend
node scripts/resetPassword.js <email> <new-password>
```

Run this from the Render Shell or locally with your production `MONGO_URI` set.

---

## Deployment Checklist

### First-time setup

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] Atlas Network Access allows Render IPs (`0.0.0.0/0` for free tier)
- [ ] Render service created, root directory set to `backend`
- [ ] Render environment variables set: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV`
- [ ] Render start command: `node server.js`
- [ ] Backend health check returns 200: `https://tooltrack.onrender.com/api/health`
- [ ] Netlify site created, base directory set to `frontend`
- [ ] Netlify environment variable set: `VITE_API_URL`
- [ ] Netlify build succeeds and site is live
- [ ] `frontend/public/_redirects` present in repo (committed)
- [ ] Test registration and login on live site
- [ ] Test adding a tool, assigning, requesting return, confirming return

### After each deployment

- [ ] Health check passes
- [ ] Can log in with existing credentials
- [ ] No CORS errors in browser console
- [ ] Return workflow functions end-to-end

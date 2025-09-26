# Production Deployment Guide - Render + Netlify

## Issues Fixed:
✅ Route import/export mismatch in auth routes
✅ Environment variable validation
✅ CORS configuration for production
✅ Frontend API URL configuration

## Backend Deployment (Render)

### 1. Environment Variables on Render
Set these environment variables in your Render dashboard:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tooltrack
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 2. Render Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

## Frontend Deployment (Netlify)

### 1. Update Frontend .env File
Replace the placeholder in `frontend/.env` with your actual Render URL:

```
VITE_API_URL=https://your-render-app-name.onrender.com/api
```

### 2. Netlify Environment Variables
In your Netlify dashboard, set:

```
VITE_API_URL=https://your-render-app-name.onrender.com/api
```

### 3. Netlify Build Settings
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18 or higher

## Testing Your Deployment

### 1. Test Backend Health Check
Visit: `https://your-render-app-name.onrender.com/api/health`
Should return: `{"status":"OK","message":"Server is running"}`

### 2. Test CORS
Check browser console for CORS errors when accessing your Netlify frontend.

### 3. Test Authentication
Try registering and logging in through your deployed frontend.

## Common Issues & Solutions

### Issue: "Connection Refused" Error
- **Cause**: Backend not running or wrong API URL
- **Solution**: Verify Render deployment is active and VITE_API_URL is correct

### Issue: CORS Error
- **Cause**: Frontend URL not in CORS allowlist
- **Solution**: Set FRONTEND_URL environment variable on Render

### Issue: "Invalid JWT" Error
- **Cause**: JWT_SECRET mismatch between environments
- **Solution**: Ensure JWT_SECRET is set consistently

### Issue: Database Connection Error
- **Cause**: MONGO_URI not set or incorrect
- **Solution**: Verify MongoDB connection string in Render environment variables

## URLs to Replace

1. **In frontend/.env**: Replace `your-render-app-name` with your actual Render app name
2. **In Render env vars**: Replace `your-netlify-app` with your actual Netlify app name
3. **In MongoDB URI**: Replace with your actual MongoDB connection string
4. **JWT_SECRET**: Generate a secure random string (at least 32 characters)

## Verification Checklist

- [ ] Backend deploys successfully on Render
- [ ] Frontend builds and deploys on Netlify
- [ ] Health check endpoint returns 200 OK
- [ ] No CORS errors in browser console
- [ ] Registration works in production
- [ ] Login works in production
- [ ] JWT tokens are properly generated and validated

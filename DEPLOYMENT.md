# Deployment Configuration Guide

## Overview
- **Frontend**: Deployed on Vercel at https://mastoride.vercel.app
- **Backend**: Deployed on Railway at https://mastoride-web-dev-production-d469.up.railway.app

## Frontend Setup (Vercel)

### Environment Variables
Add this to your Vercel project settings:

```
REACT_APP_BACKEND_URL=https://mastoride-web-dev-production-d469.up.railway.app
```

### Local Development
1. Copy `.env.example` to `.env`
2. Update values as needed for local testing
3. Run `npm start` to test locally

## Backend Setup (Railway)

### Environment Variables
Add these to your Railway project settings:

```
MONGO_URL=mongodb+srv://Student:Student1@cluster0.p8zkoia.mongodb.net/
PORT=5001
FRONTEND_URL=https://mastoride.vercel.app
NODE_ENV=production
```

### CORS Configuration
The backend now supports:
- Local development: `http://localhost:3000`
- Production frontend: `https://mastoride.vercel.app`
- Custom domain (if configured via FRONTEND_URL environment variable)

### Key Changes Made
1. ✅ Updated CORS to allow Vercel frontend URL
2. ✅ Added credentials support for cookies/sessions
3. ✅ Made PORT configurable via environment variable
4. ✅ Added flexible origin checking for multiple environments

## Testing the Setup

### 1. Test Backend Health
```bash
curl https://mastoride-web-dev-production-d469.up.railway.app/health
```

Expected response:
```json
{"status":"ok","time":"2025-12-02T..."}
```

### 2. Test Frontend Connection
1. Visit https://mastoride.vercel.app
2. Try logging in or making API calls
3. Check browser console for CORS errors (should be none)

## Deployment Checklist

### Before Deploying Frontend to Vercel:
- [ ] Set `REACT_APP_BACKEND_URL` environment variable
- [ ] Build succeeds locally: `npm run build`
- [ ] Connect GitHub repository to Vercel
- [ ] Deploy from `Frontend-deployment` branch

### Before Deploying Backend to Railway:
- [ ] Set all environment variables (MONGO_URL, FRONTEND_URL, etc.)
- [ ] Verify MongoDB connection string is correct
- [ ] Ensure PORT is dynamic (uses process.env.PORT)
- [ ] Test CORS allows your frontend domain

## Custom Domain (Optional)
If you configure a custom domain like `www.mastoride.com`:

1. Update Vercel with your domain
2. Update Railway environment variable:
   ```
   FRONTEND_URL=https://www.mastoride.com
   ```
3. Update frontend `.env`:
   ```
   REACT_APP_BACKEND_URL=https://mastoride-web-dev-production-d469.up.railway.app
   ```

## Troubleshooting

### CORS Errors
- Verify FRONTEND_URL is set correctly in Railway
- Check that your frontend URL matches exactly (including https://)
- Clear browser cache and retry

### API Connection Issues
- Verify REACT_APP_BACKEND_URL is set in Vercel
- Check Railway logs for errors
- Ensure MongoDB is accessible from Railway

### Environment Variables Not Working
- In Vercel: Redeploy after adding environment variables
- In Railway: Restart the service after updating variables
- Variables must be set in deployment platform, not just in code

# Railway Deployment Guide

## Quick Setup

1. **Visit Railway**: Go to [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Link your GitHub account
3. **Deploy Project**: Click "Deploy from GitHub" and select this repository
4. **Set Root Directory**: Set deploy path to `apps/backend`

## Environment Variables

In your Railway project dashboard, add these environment variables:

### Required Variables
```bash
DATABASE_URL=postgresql://neondb_owner:npg_rQiPx0npOY5A@ep-autumn-star-a1h0bm5w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=demo-jwt-secret-key-for-development-only
JWT_EXPIRES_IN=7d
PORT=7010
NODE_ENV=production
DEMO_MODE=true
FRONTEND_URL=https://coupon-management-frontend.vercel.app
```

### Optional Email Variables
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Pantum Coupons
```

## Build Configuration

Railway will automatically use:
- **Build Command**: `pnpm railway:build`
- **Start Command**: `pnpm railway:start`
- **Health Check**: `/health` endpoint

## Features

- ✅ Automatic database migration and seeding
- ✅ Health checks for reliability
- ✅ Proper error handling and logging
- ✅ CORS configured for frontend
- ✅ Demo coupons pre-loaded

## API Endpoints

Once deployed, your API will be available at:
- **Root**: `https://your-app.railway.app/`
- **Health**: `https://your-app.railway.app/health`
- **API**: `https://your-app.railway.app/api/*`

## Demo Coupons

The following coupons will be automatically created:
- `MV4Q-J7KQ-KU` - 15% off (min $30)
- `XCMK-1OCK-E6` - 15% off (min $30)
- `4F1I-AD1K-GH` - 20% off (min $50)
- `EXPIRED-DEMO` - Expired (for testing)

## Troubleshooting

1. **Build fails**: Check that all environment variables are set
2. **Database errors**: Verify DATABASE_URL is correct
3. **CORS issues**: Ensure FRONTEND_URL matches your frontend domain
4. **Health check fails**: Check Railway logs for startup errors
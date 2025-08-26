# Quick Deployment Guide

## 🚀 Deploy to Vercel + Neon (Free)

### 1. Database Setup (Neon)
1. Go to https://neon.tech
2. Create account → New project
3. Copy connection string: `postgresql://...`

### 2. Push to GitHub
```bash
# In project root
git init
git add .
git commit -m "🚀 Initial deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/pantum-coupon-system.git
git push -u origin main
```

### 3. Deploy Frontend (Vercel)
1. Go to https://vercel.com/new
2. Import GitHub repo
3. **Framework**: Next.js
4. **Root Directory**: `apps/frontend`
5. **Build Command**: `cd ../.. && pnpm build --filter=frontend`
6. **Install Command**: `cd ../.. && pnpm install`
7. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
   ```

### 4. Deploy Backend (Vercel)
1. Create new Vercel project (same repo)
2. **Root Directory**: `apps/backend`
3. **Build Command**: `cd ../.. && pnpm build --filter=backend`  
4. **Install Command**: `cd ../.. && pnpm install`
5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://your-neon-connection-string
   JWT_SECRET=your-super-secret-key-change-this
   NODE_ENV=production
   DEMO_MODE=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Pantum Coupons
   ```

### 5. Initialize Production Database
```bash
# Set your production database URL
export DATABASE_URL="your-neon-connection-string"

# Initialize schema and data
cd apps/backend
pnpm db:push
pnpm seed
```

### 6. Update Frontend API URL
Update frontend environment with your backend URL:
```
NEXT_PUBLIC_API_URL=https://your-backend-abc123.vercel.app/api
```

## 🎯 Alternative: Railway (All-in-One)

### Single Command Deploy:
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`
4. Add PostgreSQL: `railway add postgresql`
5. Deploy frontend and backend separately

## 🔗 URLs After Deployment
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.vercel.app` 
- **API Health**: `https://your-backend.vercel.app/health`

## ✅ Verify Deployment
Test these URLs:
- Frontend homepage
- Purchase demo flow
- Coupon validation
- Admin panel
- API health check

## 🆘 Troubleshooting
- **Build fails**: Check build logs, ensure dependencies are installed
- **API errors**: Verify DATABASE_URL and environment variables
- **CORS issues**: Update CORS origins in backend code
- **Database issues**: Run `pnpm db:push` and `pnpm seed`

Total deployment time: **~15 minutes** ⚡
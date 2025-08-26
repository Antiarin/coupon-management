# Deployment Guide

This guide covers deploying the Pantum Coupon System to various platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with the repository
- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, or similar)

### Step 1: Deploy Frontend

1. **Import to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project" 
   - Connect your GitHub repository
   - Select the repository

2. **Configure Frontend Deployment**
   ```
   Framework: Next.js
   Root Directory: apps/frontend
   Build Command: cd ../.. && pnpm build --filter=frontend
   Install Command: cd ../.. && pnpm install
   Output Directory: .next
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
   NEXT_PUBLIC_APP_NAME=Pantum Coupon System
   ```

### Step 2: Deploy Backend

1. **Create New Vercel Project**
   - Import the same repository
   - Create a separate project for the backend

2. **Configure Backend Deployment**
   ```
   Root Directory: apps/backend
   Build Command: cd ../.. && pnpm build --filter=backend
   Install Command: cd ../.. && pnpm install
   ```

3. **Environment Variables**
   ```
   DATABASE_URL=your-postgresql-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Pantum Coupons
   FRONTEND_URL=https://your-frontend-url.vercel.app
   DEMO_MODE=true
   ```

### Step 3: Set Up Database

1. **Create PostgreSQL Database**
   - Use Vercel Postgres, Neon, or any PostgreSQL provider
   - Copy the connection string

2. **Initialize Database**
   ```bash
   # Set DATABASE_URL environment variable
   export DATABASE_URL="your-connection-string"
   
   # Navigate to backend directory
   cd apps/backend
   
   # Push schema and seed data
   pnpm db:push
   pnpm seed
   ```

### Step 4: Configure Custom Domains (Optional)

1. **Frontend Domain**
   - Add custom domain in Vercel dashboard
   - Configure DNS records

2. **Backend Domain**
   - Add custom domain for API
   - Update NEXT_PUBLIC_API_URL in frontend

## 🐳 Docker Deployment

### Frontend Dockerfile
```dockerfile
# apps/frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build --filter=frontend

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Backend Dockerfile
```dockerfile
# apps/backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend/ ./apps/backend/

# Build application
WORKDIR /app/apps/backend
RUN pnpm build

# Expose port
EXPOSE 3001

# Start application
CMD ["pnpm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pantum_coupons
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/pantum_coupons
      JWT_SECRET: your-secret-key
      NODE_ENV: production
      DEMO_MODE: true
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🌐 Railway Deployment

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub

2. **Deploy Backend**
   ```
   Root Directory: apps/backend
   Build Command: pnpm build
   Start Command: pnpm start
   ```

3. **Deploy Frontend**
   ```
   Root Directory: apps/frontend
   Build Command: pnpm build
   Start Command: pnpm start
   ```

4. **Add PostgreSQL Database**
   - Add PostgreSQL plugin in Railway
   - Copy connection string to backend environment

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-production-key
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Pantum Coupons
FRONTEND_URL=https://your-frontend-domain.com
DEMO_MODE=false
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_NAME=Pantum Coupon System
```

## 📊 Health Checks

### API Health Check
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Database Health Check
```bash
# Test database connection
curl https://your-backend-url.com/api/admin/analytics
```

## 🔍 Monitoring

### Recommended Monitoring Tools
- **Vercel Analytics**: Built-in for Vercel deployments
- **Sentry**: Error tracking and performance monitoring
- **LogTail**: Log aggregation and analysis
- **UptimeRobot**: Uptime monitoring

### Custom Health Monitoring
Add to your monitoring system:
- Frontend: `https://your-domain.com`
- Backend Health: `https://your-api-domain.com/health`
- Database: Monitor API response times

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   pnpm clean
   pnpm install
   pnpm build
   ```

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Ensure SSL mode is correct

3. **CORS Errors**
   - Update CORS configuration in backend
   - Verify frontend URL in backend environment

4. **Missing Environment Variables**
   - Check all required variables are set
   - Verify variable names match exactly

### Debug Commands
```bash
# Check environment variables
pnpm --filter=backend run start

# Test database connection
pnpm --filter=backend run db:studio

# Verify build output
pnpm build
```

## 📋 Deployment Checklist

- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] Database schema pushed (`pnpm db:push`)
- [ ] Demo data seeded (`pnpm seed`)
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] CORS configured correctly
- [ ] Health checks passing
- [ ] SSL certificates configured
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build applications
        run: pnpm build
        
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

This guide should help you deploy the Pantum Coupon System to production successfully! 🚀
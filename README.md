# Pantum Coupon Generation & Management System

A full-stack TypeScript application for generating, validating, and managing discount coupons for Pantum products. Built with Next.js 16, Express.js, and PostgreSQL in a Turborepo monorepo.

**Live Demo:** https://coupon-management-frontend.vercel.app

## Features

- **Coupon Generation** with OTP verification via phone number
- **Coupon Validation** with real-time discount calculation
- **Admin Dashboard** with analytics, search, and filtering
- **Demo Purchase Flow** to simulate end-to-end coupon lifecycle
- **PWA Support** with manifest and icons
- **SEO Optimized** with structured data, sitemap, robots.txt, and Open Graph tags
- **Accessible** (WCAG AA compliant) with ARIA labels and keyboard navigation
- **Security Headers** (CSP, HSTS, X-Frame-Options, COOP, etc.)
- **Google Analytics** integration

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Radix UI, TanStack Query |
| Backend | Express.js, Prisma ORM, Zod validation, Nodemailer |
| Database | PostgreSQL (Neon) |
| Monorepo | Turborepo, pnpm |
| Deployment | Vercel (frontend), Railway (backend) |

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

### Setup

```bash
# Clone and install
git clone https://github.com/Antiarin/coupon-management.git
cd pantum-coupon-system
pnpm install

# Configure environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
# Edit both files with your values

# Set up database
cd apps/backend
pnpm db:push
pnpm seed
cd ../..

# Start development
pnpm dev
```

This starts:
- Frontend: http://localhost:3010
- Backend API: http://localhost:7010

## Project Structure

```
pantum-coupon-system/
├── apps/
│   ├── frontend/          # Next.js 16 app
│   └── backend/           # Express.js API
├── packages/
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
├── turbo.json
└── package.json
```

## API Endpoints

### Coupons
- `GET /api/coupons/validate/:code?orderValue=` - Validate a coupon
- `POST /api/coupons/apply` - Apply/use a coupon

### Generate Coupon (OTP Flow)
- `POST /api/generate/request-otp` - Send OTP to phone
- `POST /api/generate/verify-and-generate` - Verify OTP and generate coupon
- `POST /api/generate/resend-otp` - Resend OTP
- `GET /api/generate/invoice/:id` - Lookup invoice details

### Purchases
- `POST /api/purchases/create` - Create purchase and generate coupon

### Admin
- `GET /api/admin/coupons` - List coupons (with search/filter)
- `POST /api/admin/coupons` - Create manual coupon
- `GET /api/admin/analytics` - Dashboard statistics

## Deployment

### Frontend (Vercel)

1. Import repo on Vercel, set root directory to `apps/frontend`
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Backend (Railway)

1. Create a new Railway project, connect your GitHub repo
2. Set root directory to `apps/backend`
3. Add environment variables from `apps/backend/.env.example`
4. Railway will use the existing Dockerfile

### Database

Use any PostgreSQL provider (Neon, Supabase, Railway Postgres). Update `DATABASE_URL` in your backend environment.

## Scripts

```bash
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm check-types      # Type checking

# Database (from apps/backend)
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
pnpm seed             # Seed demo data
```

## SEO

- Structured data (JSON-LD) for Organization, WebApplication, BreadcrumbList, and FAQPage
- Dynamic sitemap with ISR revalidation at `/sitemap.xml`
- Robots.txt with public/private route rules at `/robots.txt`
- Open Graph and Twitter Card meta tags on all pages
- Canonical URLs with `alternates.canonical`
- Google Analytics via `@next/third-parties`
- PWA manifest with app icons
- Semantic HTML with proper heading hierarchy
- Static generation on the home page for fast LCP

## License

MIT

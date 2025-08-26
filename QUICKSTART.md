# 🚀 Quick Start Guide

Get the Pantum Coupon System up and running in minutes!

## Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database

## 1️⃣ Clone & Install

```bash
# Clone the repository
cd /Users/antiarin/Documents/github/pantum-coupon-system

# Run the automated setup
./setup.sh
```

OR manually:

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# Set up database
cd apps/backend
pnpm db:push
pnpm seed
cd ../..
```

## 2️⃣ Start Development

```bash
# Start both frontend and backend
pnpm dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 3️⃣ Try the Demo

### 🛒 Simulate a Purchase
1. Go to http://localhost:3000/purchase-demo
2. Select a product and enter customer details
3. Complete the demo purchase
4. Get your generated coupon code!

### 🎫 Validate a Coupon
1. Go to http://localhost:3000/validate-coupon
2. Enter coupon code: `SAVE-15-DEMO` (or use your generated code)
3. Add optional order value to see discount calculation

### 🔧 Admin Panel
1. Go to http://localhost:3000/admin
2. View coupon statistics and management
3. Search and filter coupons

## 4️⃣ API Testing

Test the REST API directly:

```bash
# Health check
curl http://localhost:3001/health

# Validate coupon
curl "http://localhost:3001/api/coupons/validate/SAVE-15-DEMO?orderValue=100"

# Get analytics
curl http://localhost:3001/api/admin/analytics
```

## 🎯 Demo Features

- **Sample Coupon Codes**: Pre-loaded for testing
- **Spoofed Email**: Email delivery is simulated
- **Mock Invoice Validation**: Always returns success
- **Realistic Data**: Products, customers, and orders

## 📱 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:3000 | Landing page with navigation |
| Purchase Demo | http://localhost:3000/purchase-demo | Simulate product purchase |
| Validate Coupon | http://localhost:3000/validate-coupon | Test coupon codes |
| Admin Panel | http://localhost:3000/admin | Manage coupons and analytics |

## 🔧 Troubleshooting

**Database Connection Error?**
```bash
# Update DATABASE_URL in apps/backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/pantum_coupons"
```

**Port Already in Use?**
```bash
# Kill existing processes
lsof -ti:3000,3001 | xargs kill
```

**Build Errors?**
```bash
# Clean and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

## 🚀 Next Steps

1. **Customize Products**: Edit the seed data in `apps/backend/prisma/seed.ts`
2. **Add Authentication**: Implement JWT middleware for admin routes  
3. **Email Setup**: Configure SMTP settings in production
4. **Deploy**: Follow `DEPLOYMENT.md` for production deployment

## 💡 Sample Data

The system comes pre-loaded with:
- ✅ 4 demo users (including admin)
- ✅ 5 Pantum products
- ✅ 3+ sample coupons with different discount types
- ✅ Purchase order history

Happy coding! 🎉

---

**Need help?** Check the full [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md) guides.
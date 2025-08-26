# Pantum Coupon Generation & Management System

A full-stack TypeScript application for generating, validating, and managing discount coupons for Pantum products. Built with Next.js, Express.js, and PostgreSQL in a turborepo monorepo structure.

![Demo Screenshot](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop)

## 🚀 Features

### Core Functionality
- **Automatic Coupon Generation**: Generate unique coupon codes after product purchase
- **Flexible Discount Rules**: Support for percentage and fixed-amount discounts
- **Smart Validation**: Real-time coupon validation with configurable rules
- **Usage Tracking**: Monitor coupon usage and enforce limits
- **Email Delivery**: Automatic coupon delivery via email (demo mode available)

### Admin Panel
- **Dashboard Analytics**: Track coupon statistics and usage rates
- **Coupon Management**: View, search, and filter all issued coupons
- **Manual Creation**: Create custom coupons with specific rules
- **Real-time Updates**: Live data with React Query

### Demo Features
- **Spoofed Invoice Parsing**: Always returns success for demo purposes
- **Sample Data**: Pre-seeded database with realistic demo data
- **Mock Email Delivery**: Simulated email sending for testing

## 🏗️ Tech Stack

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **TypeScript**: Full type safety
- **UI Components**: Radix UI primitives

### Backend (Express.js)
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based (ready for implementation)
- **Validation**: Zod schema validation
- **Email**: Nodemailer integration
- **Security**: Helmet, CORS, rate limiting

### Infrastructure
- **Monorepo**: Turborepo for build optimization
- **Package Manager**: pnpm for efficient dependency management
- **Deployment**: Vercel-ready configuration
- **Database**: PostgreSQL (compatible with Vercel Postgres)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pantum-coupon-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   **Backend (.env)**:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```
   
   Edit `apps/backend/.env` with your database and email settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pantum_coupons"
   JWT_SECRET="your-super-secret-jwt-key"
   SMTP_HOST="smtp.gmail.com"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   DEMO_MODE=true
   ```

   **Frontend (.env.local)**:
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```
   
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Set up the database**
   ```bash
   cd apps/backend
   pnpm db:push
   pnpm seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   pnpm dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📱 Usage

### For Customers

1. **Purchase Demo**: Visit `/purchase-demo` to simulate a product purchase
2. **Get Coupon**: Receive a unique coupon code automatically
3. **Validate Coupon**: Use `/validate-coupon` to check coupon validity and calculate discounts

### For Administrators

1. **Admin Dashboard**: Visit `/admin` to access the management panel
2. **View Analytics**: Monitor coupon statistics and usage rates
3. **Manage Coupons**: Search, filter, and manage all issued coupons
4. **Create Manual Coupons**: Generate custom coupons with specific rules

### API Endpoints

#### Coupon Management
- `GET /api/coupons/validate/:code` - Validate a coupon code
- `POST /api/coupons/apply` - Apply/use a coupon
- `GET /api/coupons/:code` - Get coupon details

#### Purchase System
- `POST /api/purchases/create` - Create purchase and generate coupon
- `POST /api/purchases/validate-invoice` - Validate invoice/serial number

#### Admin Panel
- `GET /api/admin/coupons` - List all coupons with filters
- `POST /api/admin/coupons` - Create manual coupon
- `GET /api/admin/analytics` - Get system statistics

## 🚀 Deployment

### Vercel Deployment

The application is optimized for Vercel deployment with both frontend and serverless backend.

1. **Fork/Clone to GitHub**

2. **Deploy Frontend to Vercel**
   - Import your GitHub repository
   - Set root directory to `apps/frontend`
   - Configure environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
     ```

3. **Deploy Backend to Vercel**
   - Create another Vercel project for the backend
   - Set root directory to `apps/backend`
   - Configure environment variables (database, SMTP, etc.)

4. **Set up PostgreSQL**
   - Use Vercel Postgres, Neon, or any PostgreSQL provider
   - Update `DATABASE_URL` in backend environment

5. **Initialize Database**
   ```bash
   pnpm db:push
   pnpm seed
   ```

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY apps/backend ./
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Database Schema

### Key Tables

- **coupons**: Store coupon codes, discounts, and rules
- **users**: Customer information and admin accounts
- **products**: Pantum product catalog
- **purchase_orders**: Order records and invoice details
- **coupon_usage**: Track coupon redemptions
- **coupon_rules**: Flexible rule configurations

## 🔧 Development

### Project Structure
```
pantum-coupon-system/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Express.js API
├── packages/
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

### Available Scripts

```bash
# Development
pnpm dev              # Start all applications
pnpm build            # Build all applications
pnpm lint             # Lint all packages
pnpm check-types      # Type checking

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
pnpm seed             # Seed demo data
```

### Adding New Features

1. **Backend API Endpoint**: Add to `apps/backend/src/routes/`
2. **Frontend Page**: Add to `apps/frontend/src/app/`
3. **UI Component**: Add to `packages/ui/src/` for sharing
4. **Database Changes**: Update `apps/backend/prisma/schema.prisma`

## 🧪 Demo Data

The system comes with pre-seeded demo data:

- **Sample Coupons**: Various discount types and statuses
- **Demo Products**: Pantum printers, cartridges, and accessories
- **Test Users**: Admin and customer accounts
- **Purchase Orders**: Realistic order history

### Sample Coupon Codes (for testing)
- `SAVE-15-DEMO` - 15% discount coupon
- `FLAT-20-TEST` - $20 fixed discount
- `EXPIRED-DEMO` - Expired coupon (for error testing)

## 🛡️ Security Features

- **Rate Limiting**: API protection against abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Helmet Security**: HTTP security headers

## 📈 Analytics & Monitoring

- **Usage Statistics**: Track coupon generation and redemption
- **Performance Metrics**: Monitor API response times
- **Error Tracking**: Comprehensive logging system
- **Admin Dashboard**: Real-time analytics visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Email**: Contact support@pantum.com (in production)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic coupon generation and validation
- ✅ Admin panel with analytics
- ✅ Demo mode with sample data
- ✅ Vercel deployment ready

### Phase 2 (Future)
- [ ] User authentication and profiles
- [ ] Advanced coupon rules engine
- [ ] Bulk coupon operations
- [ ] Email template customization
- [ ] Multi-language support

### Phase 3 (Advanced)
- [ ] API rate limiting per user
- [ ] Webhook integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile app support
- [ ] Barcode/QR code generation

---

Built with ❤️ for Pantum by the development team. This is a demonstration application showcasing modern full-stack development practices.
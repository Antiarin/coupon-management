#!/bin/bash

# Pantum Coupon System Setup Script

echo "🚀 Setting up Pantum Coupon System..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Set up environment files if they don't exist
if [ ! -f "apps/backend/.env" ]; then
    echo "⚙️ Creating backend environment file..."
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Please edit apps/backend/.env with your database credentials"
fi

if [ ! -f "apps/frontend/.env.local" ]; then
    echo "⚙️ Creating frontend environment file..."
    cp apps/frontend/.env.example apps/frontend/.env.local
fi

# Generate Prisma client
echo "🗄️ Setting up database..."
cd apps/backend
pnpm db:generate

# Check if database is accessible
if pnpm db:push --accept-data-loss 2>/dev/null; then
    echo "✅ Database schema updated successfully"
    
    # Seed the database
    echo "🌱 Seeding demo data..."
    pnpm seed
    echo "✅ Demo data seeded successfully"
else
    echo "⚠️ Could not connect to database. Please:"
    echo "   1. Make sure PostgreSQL is running"
    echo "   2. Update DATABASE_URL in apps/backend/.env"
    echo "   3. Run 'pnpm db:push' and 'pnpm seed' manually"
fi

cd ../..

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Update database credentials in apps/backend/.env (if needed)"
echo "2. Start the development servers:"
echo "   pnpm dev"
echo ""
echo "3. Open your browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""
echo "4. Try the demo:"
echo "   - Purchase demo: http://localhost:3000/purchase-demo"
echo "   - Validate coupon: http://localhost:3000/validate-coupon"
echo "   - Admin panel: http://localhost:3000/admin"
echo ""
echo "Happy coding! 🚀"
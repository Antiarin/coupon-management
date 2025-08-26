import { PrismaClient } from '@prisma/client';
import { CouponGenerator } from '../src/utils/couponGenerator';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.couponUsage.deleteMany();
  await prisma.couponRule.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@pantum.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo Customer',
        role: 'USER',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} demo users`);

  // Create demo products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Pantum P2502W Wireless Laser Printer',
        description: 'Compact wireless monochrome laser printer perfect for home and small office use',
        price: 99.99,
        category: 'Printers',
        imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pantum P3255DN Network Laser Printer',
        description: 'High-speed duplex network laser printer with advanced features',
        price: 199.99,
        category: 'Printers',
        imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pantum TL-410H High Yield Toner Cartridge',
        description: 'Original high-yield toner cartridge for Pantum laser printers',
        price: 49.99,
        category: 'Cartridges',
        imageUrl: 'https://images.unsplash.com/photo-1586953983027-d7508698449c?w=400',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Premium Copy Paper A4 500 Sheets',
        description: 'High-quality 80gsm A4 copy paper for professional printing',
        price: 12.99,
        category: 'Paper',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pantum Printer Stand with Storage',
        description: 'Adjustable printer stand with built-in storage compartments',
        price: 79.99,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1586953983027-d7508698449c?w=400',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} demo products`);

  // Create demo purchase orders
  const purchaseOrders = await Promise.all([
    prisma.purchaseOrder.create({
      data: {
        orderNumber: 'PAN-2024-001',
        customerName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        totalAmount: 99.99,
        productId: products[0].id,
        serialNumber: 'P2502W-001234',
        invoiceUrl: 'https://example.com/invoices/PAN-2024-001.pdf',
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        orderNumber: 'PAN-2024-002',
        customerName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        totalAmount: 199.99,
        productId: products[1].id,
        serialNumber: 'P3255DN-005678',
        invoiceUrl: 'https://example.com/invoices/PAN-2024-002.pdf',
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        orderNumber: 'PAN-2024-003',
        customerName: 'Demo Customer',
        email: 'demo@example.com',
        phone: '+1234567892',
        totalAmount: 49.99,
        productId: products[2].id,
        serialNumber: 'TL410H-123456',
      },
    }),
  ]);

  console.log(`✅ Created ${purchaseOrders.length} demo purchase orders`);

  // Generate coupons for the purchase orders
  const coupons = [];
  
  for (const purchaseOrder of purchaseOrders) {
    const coupon = await CouponGenerator.createCouponAfterPurchase(purchaseOrder.id);
    coupons.push(coupon);
  }

  // Create some additional manual coupons for demo
  const manualCoupons = await Promise.all([
    CouponGenerator.createCoupon({
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minimumOrderValue: 150,
      maxDiscountAmount: 50,
      expiryDays: 60,
      usageLimit: 1,
    }),
    CouponGenerator.createCoupon({
      discountType: 'FIXED_AMOUNT',
      discountValue: 20,
      minimumOrderValue: 80,
      expiryDays: 45,
      usageLimit: 1,
    }),
    CouponGenerator.createCoupon({
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minimumOrderValue: 30,
      expiryDays: 30,
      usageLimit: 3,
    }),
  ]);

  coupons.push(...manualCoupons);

  console.log(`✅ Created ${coupons.length} demo coupons`);

  // Create some coupon usage records
  await prisma.couponUsage.create({
    data: {
      couponId: coupons[0].id,
      userId: users[1].id,
      orderValue: 150.00,
      discount: 22.50,
    },
  });

  // Update the coupon status to used
  await prisma.coupon.update({
    where: { id: coupons[0].id },
    data: {
      usedCount: 1,
      status: 'USED',
    },
  });

  console.log(`✅ Created demo coupon usage records`);

  // Create some expired coupons for demo
  const expiredCoupon = await prisma.coupon.create({
    data: {
      code: 'EXPIRED-DEMO',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minimumOrderValue: 50,
      expiresAt: new Date('2024-01-01'), // Past date
      usageLimit: 1,
      status: 'EXPIRED',
    },
  });

  console.log(`✅ Created expired coupon: ${expiredCoupon.code}`);

  console.log(`🎉 Database seeding completed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${products.length} products created`);
  console.log(`   - ${purchaseOrders.length} purchase orders created`);
  console.log(`   - ${coupons.length + 1} coupons created (including expired)`);
  console.log(`   - 1 coupon usage record created`);

  console.log(`\n🎫 Sample coupon codes:`);
  coupons.slice(0, 3).forEach((coupon, index) => {
    console.log(`   ${index + 1}. ${coupon.code} - ${coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '%' : '$' + coupon.discountValue} off`);
  });
  console.log(`   4. ${expiredCoupon.code} - EXPIRED (for testing)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
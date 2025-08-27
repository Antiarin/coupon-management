import { PrismaClient } from '@prisma/client';
import { CouponGenerator } from '../src/utils/couponGenerator';

declare const process: {
  exit: (code: number) => void;
};

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
  const coupons: any[] = [];
  
  for (const purchaseOrder of purchaseOrders) {
    const coupon = await CouponGenerator.createCouponAfterPurchase(purchaseOrder.id);
    coupons.push(coupon);
  }

  // Create demo coupons with EXACT codes from frontend
  const fixedCoupons = [
    { code: 'MV4Q-J7KQ-KU', discountType: 'PERCENTAGE' as const, discountValue: 15, minimumOrderValue: 30 },
    { code: 'XCMK-1OCK-E6', discountType: 'PERCENTAGE' as const, discountValue: 15, minimumOrderValue: 30 },
    { code: '4F1I-AD1K-GH', discountType: 'PERCENTAGE' as const, discountValue: 20, minimumOrderValue: 50 },
  ];

  const manualCoupons = await Promise.all(
    fixedCoupons.map(async (couponData) => {
      // Check if coupon already exists
      const existing = await prisma.coupon.findUnique({
        where: { code: couponData.code }
      });
      
      if (existing) {
        console.log(`   ⚠️ Coupon ${couponData.code} already exists, skipping...`);
        return existing;
      }

      return prisma.coupon.create({
        data: {
          code: couponData.code,
          discountType: couponData.discountType,
          discountValue: couponData.discountValue,
          minimumOrderValue: couponData.minimumOrderValue,
          maxDiscountAmount: couponData.discountType === 'PERCENTAGE' ? couponData.discountValue * 2 : undefined,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          usageLimit: 5,
          usedCount: 0,
          status: 'ACTIVE',
        },
      });
    })
  );

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

  console.log(`\n🎫 Available demo coupon codes (matching frontend):`);
  console.log(`   📌 Active coupons:`);
  console.log(`      • MV4Q-J7KQ-KU - 15% off (min $30)`);
  console.log(`      • XCMK-1OCK-E6 - 15% off (min $30)`);
  console.log(`      • 4F1I-AD1K-GH - 20% off (min $50)`);
  console.log(`   ❌ Expired coupon:`);
  console.log(`      • EXPIRED-DEMO - For testing expired coupon flow`);
  console.log(`\n   🎲 Additional generated coupons from purchases:`);
  coupons.slice(0, 3).forEach((coupon, index) => {
    console.log(`      ${index + 1}. ${coupon.code} - ${coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '%' : '$' + coupon.discountValue} off`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFreshInvoice() {
  try {
    // Get a product first
    const product = await prisma.product.findFirst();
    
    if (!product) {
      console.error('No products found. Please seed the database first.');
      return;
    }

    // Generate unique invoice number with timestamp
    const timestamp = Date.now();
    const invoiceNumber = `INV-${timestamp}`;

    // Create a new purchase order without a coupon
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: invoiceNumber,
        customerName: 'Demo Customer',
        email: 'demo@example.com',
        phone: '+1234567890',
        totalAmount: 199.99,
        productId: product.id,
      },
    });

    console.log('✅ Created fresh invoice for testing:');
    console.log('📋 Invoice Number:', order.orderNumber);
    console.log('📱 Phone Number:', order.phone);
    console.log('\nUse this invoice number in the Generate Coupon page!');
    
  } catch (error) {
    console.error('Error creating invoice:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFreshInvoice();
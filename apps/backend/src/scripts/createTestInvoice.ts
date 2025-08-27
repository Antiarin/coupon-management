import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestInvoice() {
  try {
    // Get a product first
    const product = await prisma.product.findFirst();
    
    if (!product) {
      console.error('No products found. Please seed the database first.');
      return;
    }

    // Create a new purchase order without a coupon
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: 'TEST-INV-001',
        customerName: 'Test Customer',
        email: 'test@example.com',
        phone: '+9876543210',
        totalAmount: 299.99,
        productId: product.id,
      },
    });

    console.log('✅ Created test invoice:', order.orderNumber);
    console.log('Phone number:', order.phone);
    
  } catch (error) {
    console.error('Error creating test invoice:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestInvoice();
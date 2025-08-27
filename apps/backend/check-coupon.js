const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function checkCoupon() {
  try {
    // Check if the specific coupon exists
    const coupon = await prisma.coupon.findUnique({
      where: { code: '116R-FPAO-TM' }
    })
    
    console.log('Coupon 116R-FPAO-TM:', coupon)
    
    // List all available coupons
    const allCoupons = await prisma.coupon.findMany({
      select: {
        code: true,
        discountValue: true,
        isActive: true,
        expiresAt: true,
        usedCount: true,
        usageLimit: true
      }
    })
    
    console.log('\nAll available coupons:')
    allCoupons.forEach(c => {
      console.log(`- ${c.code}: ${c.discountValue}% off, Active: ${c.isActive}, Used: ${c.usedCount}/${c.usageLimit}`)
    })
    
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCoupon()
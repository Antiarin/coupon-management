import crypto from 'crypto';
import { prisma } from '../lib/prisma';

export class CouponGenerator {
  
  static generateCode(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      result += chars[randomIndex];
    }
    
    // Add some structure to make it look more professional
    // Format: XXXX-XXXX-XX
    if (length === 10) {
      return `${result.slice(0, 4)}-${result.slice(4, 8)}-${result.slice(8, 10)}`;
    }
    
    return result;
  }

  static async generateUniqueCouponCode(maxRetries: number = 5): Promise<string> {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      const code = this.generateCode();
      
      // Check if code already exists
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code }
      });
      
      if (!existingCoupon) {
        return code;
      }
      
      attempts++;
    }
    
    throw new Error('Failed to generate unique coupon code after maximum retries');
  }

  static calculateExpiryDate(days: number = 30): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }

  static async createCoupon(data: {
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    minimumOrderValue?: number;
    maxDiscountAmount?: number;
    expiryDays?: number;
    usageLimit?: number;
    productId?: string;
    purchaseOrderId?: string;
  }) {
    const code = await this.generateUniqueCouponCode();
    const expiresAt = this.calculateExpiryDate(data.expiryDays || 30);

    return await prisma.coupon.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minimumOrderValue: data.minimumOrderValue,
        maxDiscountAmount: data.maxDiscountAmount,
        expiresAt,
        usageLimit: data.usageLimit || 1,
        productId: data.productId,
        purchaseOrderId: data.purchaseOrderId,
      },
      include: {
        product: true,
        purchaseOrder: true,
        rules: true,
      }
    });
  }

  static async createCouponAfterPurchase(purchaseOrderId: string) {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { product: true }
    });

    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }

    // Default coupon rules based on product category
    const discountRules = this.getDiscountRulesByCategory(
      purchaseOrder.product.category,
      purchaseOrder.totalAmount
    );

    return await this.createCoupon({
      discountType: discountRules.type,
      discountValue: discountRules.value,
      minimumOrderValue: discountRules.minimumOrderValue,
      maxDiscountAmount: discountRules.maxDiscountAmount,
      expiryDays: 90, // 3 months validity
      usageLimit: 1,
      productId: purchaseOrder.productId,
      purchaseOrderId: purchaseOrder.id,
    });
  }

  private static getDiscountRulesByCategory(category: string, orderAmount: number) {
    const rules = {
      'Printers': {
        type: 'PERCENTAGE' as const,
        value: 15,
        minimumOrderValue: 100,
        maxDiscountAmount: 50,
      },
      'Cartridges': {
        type: 'PERCENTAGE' as const,
        value: 20,
        minimumOrderValue: 50,
        maxDiscountAmount: 30,
      },
      'Paper': {
        type: 'FIXED_AMOUNT' as const,
        value: 10,
        minimumOrderValue: 25,
        maxDiscountAmount: undefined,
      },
      'Accessories': {
        type: 'PERCENTAGE' as const,
        value: 10,
        minimumOrderValue: 30,
        maxDiscountAmount: 20,
      },
      default: {
        type: 'PERCENTAGE' as const,
        value: 10,
        minimumOrderValue: Math.max(50, orderAmount * 0.3),
        maxDiscountAmount: 25,
      }
    };

    return rules[category as keyof typeof rules] || rules.default;
  }

  static async validateCoupon(code: string, orderValue?: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: {
        product: true,
        rules: true,
        usage: true,
      }
    });

    if (!coupon) {
      return { isValid: false, error: 'Coupon not found' };
    }

    if (coupon.status !== 'ACTIVE') {
      return { isValid: false, error: 'Coupon is not active' };
    }

    if (!coupon.isActive) {
      return { isValid: false, error: 'Coupon is disabled' };
    }

    if (new Date() > coupon.expiresAt) {
      return { isValid: false, error: 'Coupon has expired' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { isValid: false, error: 'Coupon usage limit reached' };
    }

    if (coupon.minimumOrderValue && orderValue && orderValue < coupon.minimumOrderValue) {
      return { 
        isValid: false, 
        error: `Minimum order value of $${coupon.minimumOrderValue} required` 
      };
    }

    return { isValid: true, coupon };
  }

  static calculateDiscount(coupon: any, orderValue: number): number {
    if (coupon.discountType === 'PERCENTAGE') {
      const discount = (orderValue * coupon.discountValue) / 100;
      return coupon.maxDiscountAmount 
        ? Math.min(discount, coupon.maxDiscountAmount)
        : discount;
    } else {
      return coupon.discountValue;
    }
  }
}
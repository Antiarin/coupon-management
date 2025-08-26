import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CouponGenerator } from '../utils/couponGenerator';
import { validateRequest } from '../middleware/validateRequest';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';

const router = Router();

// Validate coupon
router.get(
  '/validate/:code',
  [
    param('code').isString().isLength({ min: 3 }),
    query('orderValue').optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const orderValue = req.query.orderValue ? parseFloat(req.query.orderValue as string) : undefined;

      const validation = await CouponGenerator.validateCoupon(code, orderValue);

      if (!validation.isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: validation.error,
        });
      }

      const discount = orderValue ? CouponGenerator.calculateDiscount(validation.coupon, orderValue) : 0;

      res.json({
        success: true,
        data: {
          coupon: validation.coupon,
          discount,
          orderValue,
        },
      });
    } catch (error) {
      logger.error('Error validating coupon:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to validate coupon',
      });
    }
  }
);

// Apply coupon (use it)
router.post(
  '/apply',
  [
    body('code').isString().isLength({ min: 3 }),
    body('userId').isString(),
    body('orderValue').isFloat({ min: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { code, userId, orderValue } = req.body;

      const validation = await CouponGenerator.validateCoupon(code, orderValue);

      if (!validation.isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: validation.error,
        });
      }

      const discount = CouponGenerator.calculateDiscount(validation.coupon!, orderValue);

      // Create usage record
      await prisma.couponUsage.create({
        data: {
          couponId: validation.coupon!.id,
          userId,
          orderValue,
          discount,
        },
      });

      // Update coupon usage count
      const updatedCoupon = await prisma.coupon.update({
        where: { id: validation.coupon!.id },
        data: {
          usedCount: { increment: 1 },
          status: validation.coupon!.usedCount + 1 >= validation.coupon!.usageLimit ? 'USED' : 'ACTIVE',
        },
      });

      res.json({
        success: true,
        data: {
          coupon: updatedCoupon,
          discount,
          orderValue,
          finalAmount: orderValue - discount,
        },
      });
    } catch (error) {
      logger.error('Error applying coupon:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to apply coupon',
      });
    }
  }
);

// Get coupon details
router.get(
  '/:code',
  [param('code').isString().isLength({ min: 3 })],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { code } = req.params;

      const coupon = await prisma.coupon.findUnique({
        where: { code },
        include: {
          product: true,
          purchaseOrder: true,
          rules: true,
          usage: {
            include: {
              user: {
                select: { id: true, email: true, name: true },
              },
            },
          },
        },
      });

      if (!coupon) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Coupon not found',
        });
      }

      res.json({
        success: true,
        data: coupon,
      });
    } catch (error) {
      logger.error('Error fetching coupon:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch coupon',
      });
    }
  }
);

export { router as couponRouter };
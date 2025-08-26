import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CouponGenerator } from '../utils/couponGenerator';
import { validateRequest } from '../middleware/validateRequest';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all coupons with filters and pagination
router.get(
  '/coupons',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['ACTIVE', 'USED', 'EXPIRED', 'CANCELLED']),
    query('search').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const skip = (page - 1) * limit;

      const whereClause: any = {};

      if (status) {
        whereClause.status = status;
      }

      if (search) {
        whereClause.OR = [
          { code: { contains: search, mode: 'insensitive' } },
          { purchaseOrder: { customerName: { contains: search, mode: 'insensitive' } } },
          { purchaseOrder: { email: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [coupons, total] = await Promise.all([
        prisma.coupon.findMany({
          where: whereClause,
          include: {
            product: true,
            purchaseOrder: {
              select: {
                orderNumber: true,
                customerName: true,
                email: true,
                totalAmount: true,
              },
            },
            usage: {
              include: {
                user: {
                  select: { email: true, name: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.coupon.count({ where: whereClause }),
      ]);

      res.json({
        success: true,
        data: {
          coupons,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error fetching admin coupons:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch coupons',
      });
    }
  }
);

// Create manual coupon
router.post(
  '/coupons',
  [
    body('discountType').isIn(['PERCENTAGE', 'FIXED_AMOUNT']),
    body('discountValue').isFloat({ min: 0 }),
    body('minimumOrderValue').optional().isFloat({ min: 0 }),
    body('maxDiscountAmount').optional().isFloat({ min: 0 }),
    body('expiryDays').optional().isInt({ min: 1 }),
    body('usageLimit').optional().isInt({ min: 1 }),
    body('productId').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const couponData = req.body;

      const coupon = await CouponGenerator.createCoupon(couponData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: coupon,
        message: 'Coupon created successfully',
      });
    } catch (error) {
      logger.error('Error creating manual coupon:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to create coupon',
      });
    }
  }
);

// Update coupon status
router.patch(
  '/coupons/:id/status',
  [
    body('status').isIn(['ACTIVE', 'CANCELLED']),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const coupon = await prisma.coupon.update({
        where: { id },
        data: { status },
        include: {
          product: true,
          purchaseOrder: true,
        },
      });

      res.json({
        success: true,
        data: coupon,
        message: `Coupon status updated to ${status}`,
      });
    } catch (error) {
      logger.error('Error updating coupon status:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to update coupon status',
      });
    }
  }
);

// Get analytics/statistics
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalCoupons,
      activeCoupons,
      usedCoupons,
      expiredCoupons,
      totalUsage,
      recentCoupons,
    ] = await Promise.all([
      prisma.coupon.count(),
      prisma.coupon.count({ where: { status: 'ACTIVE' } }),
      prisma.coupon.count({ where: { status: 'USED' } }),
      prisma.coupon.count({ where: { status: 'EXPIRED' } }),
      prisma.couponUsage.count(),
      prisma.coupon.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          purchaseOrder: {
            select: { customerName: true, email: true },
          },
        },
      }),
    ]);

    // Calculate usage rate
    const usageRate = totalCoupons > 0 ? (usedCoupons / totalCoupons) * 100 : 0;

    res.json({
      success: true,
      data: {
        statistics: {
          totalCoupons,
          activeCoupons,
          usedCoupons,
          expiredCoupons,
          totalUsage,
          usageRate: parseFloat(usageRate.toFixed(2)),
        },
        recentCoupons,
      },
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

export { router as adminRouter };
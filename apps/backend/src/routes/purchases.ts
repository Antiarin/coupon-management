import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CouponGenerator } from '../utils/couponGenerator';
import { validateRequest } from '../middleware/validateRequest';
import { logger } from '../utils/logger';
import { EmailService } from '../services/emailService';
import { prisma } from '../lib/prisma';

const router = Router();

// Create purchase and generate coupon (demo version)
router.post(
  '/create',
  [
    body('customerName').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('phone').optional().isMobilePhone('any'),
    body('productId').isString(),
    body('totalAmount').isFloat({ min: 0 }),
    body('serialNumber').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { customerName, email, phone, productId, totalAmount, serialNumber } = req.body;

      // For demo mode, find or create a product if the provided productId doesn't exist
      let validProductId = productId;
      
      if (process.env.DEMO_MODE === 'true') {
        // Check if product exists, if not, get the first available product
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
          const firstProduct = await prisma.product.findFirst();
          if (firstProduct) {
            validProductId = firstProduct.id;
          } else {
            throw new Error('No products available in database');
          }
        }
      }

      // Generate unique order number
      const orderNumber = `PAN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create purchase order
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          orderNumber,
          customerName,
          email,
          phone,
          totalAmount,
          productId: validProductId,
          serialNumber,
        },
        include: {
          product: true,
        },
      });

      // Generate coupon automatically
      const coupon = await CouponGenerator.createCouponAfterPurchase(purchaseOrder.id);

      // Send email with coupon (in demo mode, we just log it)
      if (process.env.DEMO_MODE === 'true') {
        logger.info(`[DEMO] Coupon ${coupon.code} would be emailed to ${email}`);
      } else {
        await EmailService.sendCouponEmail(email, customerName, coupon, purchaseOrder);
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          purchaseOrder,
          coupon,
          message: process.env.DEMO_MODE === 'true' 
            ? 'Purchase created successfully! In demo mode, coupon email is simulated.' 
            : 'Purchase created successfully! Coupon has been sent to your email.'
        },
      });
    } catch (error) {
      logger.error('Error creating purchase:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to create purchase',
      });
    }
  }
);

// Validate invoice/serial number (spoofed for demo)
router.post(
  '/validate-invoice',
  [
    body('invoiceNumber').optional().isString(),
    body('serialNumber').optional().isString(),
    body('email').isEmail(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { invoiceNumber, serialNumber, email } = req.body;

      if (process.env.DEMO_MODE === 'true') {
        // In demo mode, always return success with mock data
        const mockValidation = {
          isValid: true,
          purchaseData: {
            orderNumber: `PAN-DEMO-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            customerName: 'Demo Customer',
            email,
            totalAmount: 299.99,
            product: {
              name: 'Pantum P2502W Wireless Laser Printer',
              category: 'Printers'
            },
            invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
            serialNumber: serialNumber || `SN${Math.random().toString().substr(2, 10)}`,
          }
        };

        return res.json({
          success: true,
          data: mockValidation,
          message: 'Demo mode: Invoice validation spoofed as successful'
        });
      }

      // In real implementation, this would validate against actual invoice system
      // For now, we'll check against our database
      const purchaseOrder = await prisma.purchaseOrder.findFirst({
        where: {
          OR: [
            { orderNumber: invoiceNumber },
            { serialNumber },
          ],
          email,
        },
        include: {
          product: true,
        },
      });

      if (!purchaseOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Purchase not found with provided details',
        });
      }

      res.json({
        success: true,
        data: {
          isValid: true,
          purchaseData: purchaseOrder,
        },
      });
    } catch (error) {
      logger.error('Error validating invoice:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to validate invoice',
      });
    }
  }
);

export { router as purchaseRouter };
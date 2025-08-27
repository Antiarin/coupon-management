import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { CouponGenerator } from '../utils/couponGenerator';
import { validateRequest } from '../middleware/validateRequest';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';

const router = Router();

// Get invoice details (phone number)
router.get(
  '/invoice/:orderNumber',
  async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;

      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { orderNumber },
        select: {
          orderNumber: true,
          phone: true,
          customerName: true,
          email: true,
        },
      });

      if (!purchaseOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Invoice not found',
        });
      }

      res.json({
        success: true,
        data: purchaseOrder,
      });
    } catch (error) {
      logger.error('Error fetching invoice details:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to fetch invoice details',
      });
    }
  }
);

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; phoneNumber: string; invoiceNumber: string; expires: number }>();

// Generate OTP based on environment
const generateOTP = (): string => {
  // In demo/development mode, use fixed OTP for testing
  if (process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true') {
    return '123456';
  }
  
  // In production, generate random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock SMS service
const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  // In production, integrate with real SMS service (Twilio, AWS SNS, etc.)
  logger.info(`[MOCK SMS] Sending to ${phoneNumber}: ${message}`);
  return true;
};

// Step 1: Request OTP
router.post(
  '/request-otp',
  [
    body('phoneNumber')
      .isString()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Invalid phone number format'),
    body('invoiceNumber')
      .isString()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Invalid invoice number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { phoneNumber, invoiceNumber } = req.body;

      // Check if invoice exists and is valid
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { orderNumber: invoiceNumber },
        include: { coupons: true },
      });

      if (!purchaseOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Invoice not found',
        });
      }

      // Check if coupon already generated for this invoice
      if (purchaseOrder.coupons.length > 0) {
        const activeCoupon = purchaseOrder.coupons.find(c => c.status === 'ACTIVE');
        if (activeCoupon) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: 'A coupon has already been generated for this invoice',
            existingCoupon: activeCoupon.code,
          });
        }
      }

      // Generate OTP
      const otp = generateOTP();
      const sessionId = `${phoneNumber}-${Date.now()}`;
      
      // Store OTP with 5 minute expiration
      otpStore.set(sessionId, {
        otp,
        phoneNumber,
        invoiceNumber,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      });

      // Send OTP via SMS (mocked)
      const message = `Your Pantum Coupon verification code is: ${otp}. Valid for 5 minutes.`;
      await sendSMS(phoneNumber, message);

      // In development/demo mode, also log the OTP for testing
      if (process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true') {
        logger.info(`[DEMO/DEV MODE] OTP for ${phoneNumber}: ${otp}`);
      }

      res.json({
        success: true,
        data: {
          sessionId,
          message: 'OTP sent successfully',
          expiresIn: 300, // seconds
          // Include OTP in demo/development mode for testing
          ...((process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true') && { devOtp: otp }),
        },
      });
    } catch (error) {
      logger.error('Error requesting OTP:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to send OTP',
      });
    }
  }
);

// Step 2: Verify OTP and Generate Coupon
router.post(
  '/verify-and-generate',
  [
    body('sessionId').isString().withMessage('Invalid session'),
    body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP format'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { sessionId, otp } = req.body;

      // Retrieve OTP session
      const otpSession = otpStore.get(sessionId);

      if (!otpSession) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'Invalid or expired session',
        });
      }

      // Check if OTP expired
      if (Date.now() > otpSession.expires) {
        otpStore.delete(sessionId);
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'OTP has expired. Please request a new one.',
        });
      }

      // Verify OTP
      if (otpSession.otp !== otp) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'Invalid OTP',
        });
      }

      // OTP verified, now generate coupon
      const { invoiceNumber } = otpSession;

      // Get purchase order with product details
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { orderNumber: invoiceNumber },
        include: { 
          product: true,
          coupons: true,
        },
      });

      if (!purchaseOrder) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Purchase order not found',
        });
      }

      // Check again for existing active coupon
      const activeCoupon = purchaseOrder.coupons.find(c => c.status === 'ACTIVE');
      if (activeCoupon) {
        // Clear OTP session
        otpStore.delete(sessionId);
        
        return res.json({
          success: true,
          data: {
            coupon: activeCoupon,
            message: 'Existing coupon retrieved',
          },
        });
      }

      // Generate new coupon
      const newCoupon = await CouponGenerator.createCoupon({
        productId: purchaseOrder.productId,
        purchaseOrderId: purchaseOrder.id,
        discountType: 'PERCENTAGE' as const,
        discountValue: 15, // Default 15% discount
        usageLimit: 1,
        expiryDays: 30,
      });

      // Clear OTP session after successful generation
      otpStore.delete(sessionId);

      // Log the generation
      logger.info(`Coupon generated for invoice ${invoiceNumber}: ${newCoupon.code}`);

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          coupon: newCoupon,
          message: 'Coupon generated successfully',
          phoneNumber: otpSession.phoneNumber,
          invoiceNumber,
        },
      });
    } catch (error) {
      logger.error('Error verifying OTP and generating coupon:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to generate coupon',
      });
    }
  }
);

// Resend OTP
router.post(
  '/resend-otp',
  [
    body('sessionId').isString().withMessage('Invalid session'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.body;

      // Retrieve existing session
      const otpSession = otpStore.get(sessionId);

      if (!otpSession) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'Invalid session. Please start over.',
        });
      }

      // Generate new OTP
      const newOtp = generateOTP();
      
      // Update session with new OTP and reset expiration
      otpSession.otp = newOtp;
      otpSession.expires = Date.now() + 5 * 60 * 1000;
      otpStore.set(sessionId, otpSession);

      // Send new OTP via SMS (mocked)
      const message = `Your new Pantum Coupon verification code is: ${newOtp}. Valid for 5 minutes.`;
      await sendSMS(otpSession.phoneNumber, message);

      // In development/demo mode, also log the OTP
      if (process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true') {
        logger.info(`[DEMO/DEV MODE] New OTP for ${otpSession.phoneNumber}: ${newOtp}`);
      }

      res.json({
        success: true,
        data: {
          message: 'New OTP sent successfully',
          expiresIn: 300, // seconds
          // Include OTP in demo/development mode for testing
          ...((process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === 'true') && { devOtp: newOtp }),
        },
      });
    } catch (error) {
      logger.error('Error resending OTP:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Failed to resend OTP',
      });
    }
  }
);

// Cleanup expired OTP sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of otpStore.entries()) {
    if (now > session.expires) {
      otpStore.delete(sessionId);
    }
  }
}, 60 * 1000); // Run every minute

export { router as generateRouter };
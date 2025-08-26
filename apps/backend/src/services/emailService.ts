import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendCouponEmail(
    email: string, 
    customerName: string, 
    coupon: any, 
    purchaseOrder: any
  ) {
    try {
      const emailTemplate = this.generateCouponEmailTemplate(
        customerName, 
        coupon, 
        purchaseOrder
      );

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: `Your Pantum Coupon is Ready! Save ${coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '%' : '$' + coupon.discountValue}`,
        html: emailTemplate,
      };

      if (process.env.DEMO_MODE === 'true') {
        logger.info(`[DEMO] Email would be sent to ${email} with coupon ${coupon.code}`);
        return { success: true, demo: true };
      }

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Coupon email sent successfully to ${email}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send coupon email:', error);
      throw error;
    }
  }

  private static generateCouponEmailTemplate(
    customerName: string, 
    coupon: any, 
    purchaseOrder: any
  ): string {
    const discountText = coupon.discountType === 'PERCENTAGE' 
      ? `${coupon.discountValue}% off` 
      : `$${coupon.discountValue} off`;

    const minOrderText = coupon.minimumOrderValue 
      ? `Minimum order value: $${coupon.minimumOrderValue}` 
      : 'No minimum order required';

    const expiryDate = new Date(coupon.expiresAt).toLocaleDateString();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Pantum Coupon</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .coupon-box { 
          background: #f8f9fa; 
          border: 2px dashed #007bff; 
          border-radius: 10px; 
          padding: 25px; 
          margin: 30px 0; 
          text-align: center; 
        }
        .coupon-code { 
          font-size: 28px; 
          font-weight: bold; 
          color: #007bff; 
          letter-spacing: 3px; 
          margin: 15px 0; 
        }
        .discount { font-size: 24px; color: #28a745; font-weight: bold; }
        .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .btn { 
          background: #007bff; 
          color: white; 
          padding: 12px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          display: inline-block; 
          margin: 20px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Thank you for your purchase, ${customerName}!</h1>
          <p>Your exclusive Pantum coupon is ready</p>
        </div>

        <div class="coupon-box">
          <div class="discount">${discountText}</div>
          <div class="coupon-code">${coupon.code}</div>
          <p><strong>Copy this code to save on your next purchase!</strong></p>
        </div>

        <div class="details">
          <h3>Coupon Details:</h3>
          <ul>
            <li><strong>Discount:</strong> ${discountText}</li>
            <li><strong>Valid until:</strong> ${expiryDate}</li>
            <li><strong>${minOrderText}</strong></li>
            <li><strong>Usage limit:</strong> ${coupon.usageLimit} time(s)</li>
          </ul>

          <h3>Your Recent Purchase:</h3>
          <ul>
            <li><strong>Order:</strong> ${purchaseOrder.orderNumber}</li>
            <li><strong>Product:</strong> ${purchaseOrder.product.name}</li>
            <li><strong>Amount:</strong> $${purchaseOrder.totalAmount}</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'https://pantum-coupons.vercel.app'}" class="btn">
            Use Coupon Now
          </a>
        </div>

        <div class="footer">
          <p>This coupon was generated automatically after your purchase.</p>
          <p>Questions? Contact us at support@pantum.com</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
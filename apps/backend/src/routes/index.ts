import { Router } from 'express';
import { couponRouter } from './coupons';
import { adminRouter } from './admin';
import { purchaseRouter } from './purchases';
import { productRouter } from './products';
import { generateRouter } from './generate';

export const apiRouter = Router();

apiRouter.use('/coupons', couponRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/purchases', purchaseRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/generate', generateRouter);
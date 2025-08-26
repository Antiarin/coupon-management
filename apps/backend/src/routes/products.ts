import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

export { router as productRouter };
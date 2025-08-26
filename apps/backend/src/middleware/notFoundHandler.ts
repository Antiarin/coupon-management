import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
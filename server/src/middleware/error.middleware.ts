import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    switch (prismaError.code) {
      case 'P2002':
        sendError(res, `A record with this ${prismaError.meta?.target?.join(', ')} already exists.`, 409);
        return;
      case 'P2025':
        sendError(res, 'Record not found.', 404);
        return;
      default:
        sendError(res, 'Database error.', 500);
        return;
    }
  }

  sendError(res, err.message || 'Internal Server Error', 500);
};

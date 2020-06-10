import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

interface IErrorBody {
  status: string;
  message: string;
  stack?: string;
}

export default (
  err: Error,
  request: Request,
  response: Response<IErrorBody>,
  _: NextFunction,
): Response<IErrorBody> => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: `Error ${err.name}`,
    message: `Internal server error -> ${err.message}`,
    stack: `${err.stack}`,
  });
};

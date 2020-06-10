import { Response, NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';

import jwtConfig from '@config/jsonwebtoken';
import AppError from '@shared/errors/AppError';

interface IDecode {
  tgId: string;
  sub: string;
}

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('Authorization token is missing', 401);

  const [, token] = authHeader.split(' ');

  const decoded = verify(token, jwtConfig.secret);

  const { tgId, sub } = decoded as IDecode;

  request.user = {
    id: sub,
    tgId,
  };

  return next();
};

import { Request, Response, NextFunction } from 'express';
import { TokenService, TokenPayload } from '../../infrastructure/security/TokenService';
import { UnauthorizedError, ForbiddenError } from '../../core/errors/AppError';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Oturum açmanız gerekiyor.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = TokenService.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Geçersiz veya süresi dolmuş oturum anahtarı.'));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Bu işlem için yetkiniz bulunmamaktadır.'));
    }
    next();
  };
};

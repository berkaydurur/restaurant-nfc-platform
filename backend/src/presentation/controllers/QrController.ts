import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { QrUseCases } from '../../application/use-cases/qr/QrUseCases';
import { ForbiddenError } from '../../core/errors/AppError';

export class QrController {
  constructor(private qrUseCases: QrUseCases) {}

  public getWifiQr = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const result = await this.qrUseCases.getWifiQr(restaurantId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public getGoogleReviewQr = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const result = await this.qrUseCases.getGoogleReviewQr(restaurantId);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public getTableQr = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const tableNumber = req.query.table as string | undefined;
      const baseUrl = (req.query.baseUrl as string) || (process.env.FRONTEND_URL || 'http://localhost:4200');

      const result = await this.qrUseCases.getTableNfcQr(restaurantId, tableNumber, baseUrl);
      return res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  public getBatchTableQrs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const count = req.query.count ? parseInt(req.query.count as string, 10) : 10;
      const baseUrl = (req.query.baseUrl as string) || (process.env.FRONTEND_URL || 'http://localhost:4200');

      const tables = [];
      for (let i = 1; i <= Math.min(count, 50); i++) {
        const item = await this.qrUseCases.getTableNfcQr(restaurantId, `Masa ${i}`, baseUrl);
        tables.push(item);
      }

      return res.json({ success: true, data: tables });
    } catch (err) {
      next(err);
    }
  };
}

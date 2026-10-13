import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AnalyticsUseCases } from '../../application/use-cases/analytics/AnalyticsUseCases';
import { ForbiddenError } from '../../core/errors/AppError';

export class AnalyticsController {
  constructor(private analyticsUseCases: AnalyticsUseCases) {}

  public getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const stats = await this.analyticsUseCases.getStats(restaurantId, days);

      return res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  };
}

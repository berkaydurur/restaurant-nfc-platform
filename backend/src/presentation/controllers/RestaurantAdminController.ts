import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { RestaurantUseCases } from '../../application/use-cases/restaurant/RestaurantUseCases';
import { ForbiddenError, NotFoundError } from '../../core/errors/AppError';

export class RestaurantAdminController {
  constructor(private restaurantUseCases: RestaurantUseCases) {}

  public getMyRestaurant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) {
        throw new NotFoundError('Kullanıcıya atanmış bir restoran bulunamadı.');
      }

      const restaurant = await this.restaurantUseCases.getById(restaurantId);
      return res.json({ success: true, data: restaurant });
    } catch (err) {
      next(err);
    }
  };

  public updateMyRestaurant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) {
        throw new ForbiddenError('Restoran güncelleme yetkiniz yok.');
      }

      const updated = await this.restaurantUseCases.updateProfile(restaurantId, req.body);
      return res.json({ success: true, message: 'Restoran ayarları güncellendi.', data: updated });
    } catch (err) {
      next(err);
    }
  };
}

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { MenuUseCases } from '../../application/use-cases/menu/MenuUseCases';
import { ForbiddenError } from '../../core/errors/AppError';

export class MenuAdminController {
  constructor(private menuUseCases: MenuUseCases) {}

  public getFullMenu = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const menu = await this.menuUseCases.getFullMenuById(restaurantId);
      return res.json({ success: true, data: menu });
    } catch (err) {
      next(err);
    }
  };

  public getCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const categories = await this.menuUseCases.getCategories(restaurantId);
      return res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  };

  public createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const category = await this.menuUseCases.createCategory({
        restaurantId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  };

  public updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');
      const { id } = req.params;

      const updated = await this.menuUseCases.updateCategory(id, restaurantId, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');
      const { id } = req.params;

      await this.menuUseCases.deleteCategory(id, restaurantId);
      return res.json({ success: true, message: 'Kategori silindi.' });
    } catch (err) {
      next(err);
    }
  };

  public getItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const items = await this.menuUseCases.getItems(restaurantId);
      return res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  };

  public createItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');

      const item = await this.menuUseCases.createItem({
        restaurantId,
        ...req.body,
      });
      return res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  public updateItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');
      const { id } = req.params;

      const updated = await this.menuUseCases.updateItem(id, restaurantId, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  public toggleItemAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');
      const { id } = req.params;

      const item = await this.menuUseCases.toggleAvailability(id, restaurantId);
      return res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  public deleteItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      if (!restaurantId) throw new ForbiddenError('Restoran kimliği bulunamadı.');
      const { id } = req.params;

      await this.menuUseCases.deleteItem(id, restaurantId);
      return res.json({ success: true, message: 'Ürün silindi.' });
    } catch (err) {
      next(err);
    }
  };
}

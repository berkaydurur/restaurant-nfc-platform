import { Request, Response, NextFunction } from 'express';
import { AuthUseCases } from '../../application/use-cases/auth/AuthUseCases';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'E-posta ve şifre zorunludur.' });
      }

      const result = await this.authUseCases.login(email, password);
      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, email, password, restaurantName, restaurantSlug } = req.body;
      if (!userName || !email || !password || !restaurantName || !restaurantSlug) {
        return res.status(400).json({ success: false, message: 'Lütfen tüm alanları doldurunuz.' });
      }

      const result = await this.authUseCases.registerRestaurant({
        userName,
        email,
        password,
        restaurantName,
        restaurantSlug,
      });

      return res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Oturum bulunamadı.' });
      }

      const result = await this.authUseCases.getCurrentUser(req.user.userId);
      return res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  };
}

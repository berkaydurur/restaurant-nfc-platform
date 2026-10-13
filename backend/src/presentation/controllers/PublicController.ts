import { Request, Response, NextFunction } from 'express';
import { RestaurantUseCases } from '../../application/use-cases/restaurant/RestaurantUseCases';
import { MenuUseCases } from '../../application/use-cases/menu/MenuUseCases';
import { AnalyticsUseCases } from '../../application/use-cases/analytics/AnalyticsUseCases';
import { QrUseCases } from '../../application/use-cases/qr/QrUseCases';

export class PublicController {
  constructor(
    private restaurantUseCases: RestaurantUseCases,
    private menuUseCases: MenuUseCases,
    private analyticsUseCases: AnalyticsUseCases,
    private qrUseCases: QrUseCases
  ) {}

  public getDirectory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurants = await this.restaurantUseCases.getAllActive();
      return res.json({ success: true, data: restaurants });
    } catch (err) {
      next(err);
    }
  };

  public getRestaurantProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const restaurant = await this.restaurantUseCases.getPublicProfile(slug);
      return res.json({ success: true, data: restaurant });
    } catch (err) {
      next(err);
    }
  };

  public getRestaurantMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const menu = await this.menuUseCases.getFullMenuBySlug(slug);
      return res.json({ success: true, data: menu });
    } catch (err) {
      next(err);
    }
  };

  public getWifiQr = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const restaurant = await this.restaurantUseCases.getPublicProfile(slug);
      const wifiQr = await this.qrUseCases.getWifiQr(restaurant.id);
      return res.json({ success: true, data: wifiQr });
    } catch (err) {
      next(err);
    }
  };

  public trackNfcInteraction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const { eventType, tableNumber, metadata } = req.body;

      await this.analyticsUseCases.trackEvent({
        restaurantSlugOrId: slug,
        eventType: eventType || 'NFC_TAP',
        tableNumber,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      });

      return res.json({ success: true, message: 'Etkileşim kaydedildi.' });
    } catch (err) {
      next(err);
    }
  };
}

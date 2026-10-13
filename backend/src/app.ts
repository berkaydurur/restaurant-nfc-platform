import express from 'express';
import cors from 'cors';
import { PrismaRestaurantRepository } from './infrastructure/repositories/PrismaRestaurantRepository';
import { PrismaMenuRepository } from './infrastructure/repositories/PrismaMenuRepository';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaAnalyticsRepository } from './infrastructure/repositories/PrismaAnalyticsRepository';

import { AuthUseCases } from './application/use-cases/auth/AuthUseCases';
import { RestaurantUseCases } from './application/use-cases/restaurant/RestaurantUseCases';
import { MenuUseCases } from './application/use-cases/menu/MenuUseCases';
import { AnalyticsUseCases } from './application/use-cases/analytics/AnalyticsUseCases';
import { QrUseCases } from './application/use-cases/qr/QrUseCases';

import { AuthController } from './presentation/controllers/AuthController';
import { PublicController } from './presentation/controllers/PublicController';
import { RestaurantAdminController } from './presentation/controllers/RestaurantAdminController';
import { MenuAdminController } from './presentation/controllers/MenuAdminController';
import { AnalyticsController } from './presentation/controllers/AnalyticsController';
import { QrController } from './presentation/controllers/QrController';

import { authenticateJwt } from './presentation/middlewares/authMiddleware';
import { errorHandler } from './presentation/middlewares/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // 1. Initialize Repositories (Infrastructure Layer)
  const restaurantRepo = new PrismaRestaurantRepository();
  const menuRepo = new PrismaMenuRepository();
  const userRepo = new PrismaUserRepository();
  const analyticsRepo = new PrismaAnalyticsRepository();

  // 2. Initialize Use Cases (Application Layer)
  const authUseCases = new AuthUseCases(userRepo, restaurantRepo);
  const restaurantUseCases = new RestaurantUseCases(restaurantRepo);
  const menuUseCases = new MenuUseCases(menuRepo, restaurantRepo);
  const analyticsUseCases = new AnalyticsUseCases(analyticsRepo, restaurantRepo);
  const qrUseCases = new QrUseCases(restaurantRepo);

  // 3. Initialize Controllers (Presentation Layer)
  const authController = new AuthController(authUseCases);
  const publicController = new PublicController(restaurantUseCases, menuUseCases, analyticsUseCases, qrUseCases);
  const restaurantAdminController = new RestaurantAdminController(restaurantUseCases);
  const menuAdminController = new MenuAdminController(menuUseCases);
  const analyticsController = new AnalyticsController(analyticsUseCases);
  const qrController = new QrController(qrUseCases);

  // --- Routes ---
  const router = express.Router();

  // Auth routes
  router.post('/auth/login', authController.login);
  router.post('/auth/register', authController.register);
  router.get('/auth/me', authenticateJwt, authController.me);

  // Public customer routes (NFC tag destinations)
  router.get('/public/restaurants', publicController.getDirectory);
  router.get('/public/restaurants/:slug', publicController.getRestaurantProfile);
  router.get('/public/restaurants/:slug/menu', publicController.getRestaurantMenu);
  router.get('/public/restaurants/:slug/wifi-qr', publicController.getWifiQr);
  router.post('/public/restaurants/:slug/track', publicController.trackNfcInteraction);

  // Admin routes (Protected by JWT)
  router.get('/admin/restaurant', authenticateJwt, restaurantAdminController.getMyRestaurant);
  router.put('/admin/restaurant', authenticateJwt, restaurantAdminController.updateMyRestaurant);

  router.get('/admin/menu', authenticateJwt, menuAdminController.getFullMenu);
  router.get('/admin/menu/categories', authenticateJwt, menuAdminController.getCategories);
  router.post('/admin/menu/categories', authenticateJwt, menuAdminController.createCategory);
  router.put('/admin/menu/categories/:id', authenticateJwt, menuAdminController.updateCategory);
  router.delete('/admin/menu/categories/:id', authenticateJwt, menuAdminController.deleteCategory);

  router.get('/admin/menu/items', authenticateJwt, menuAdminController.getItems);
  router.post('/admin/menu/items', authenticateJwt, menuAdminController.createItem);
  router.put('/admin/menu/items/:id', authenticateJwt, menuAdminController.updateItem);
  router.patch('/admin/menu/items/:id/toggle', authenticateJwt, menuAdminController.toggleItemAvailability);
  router.delete('/admin/menu/items/:id', authenticateJwt, menuAdminController.deleteItem);

  router.get('/admin/analytics', authenticateJwt, analyticsController.getDashboardStats);

  router.get('/admin/qr/wifi', authenticateJwt, qrController.getWifiQr);
  router.get('/admin/qr/google-review', authenticateJwt, qrController.getGoogleReviewQr);
  router.get('/admin/qr/table', authenticateJwt, qrController.getTableQr);
  router.get('/admin/qr/batch-tables', authenticateJwt, qrController.getBatchTableQrs);

  app.use('/api', router);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

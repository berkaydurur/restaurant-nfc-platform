import { IAnalyticsRepository, IRestaurantRepository } from '../../../core/repositories';
import { NotFoundError } from '../../../core/errors/AppError';

export class AnalyticsUseCases {
  constructor(
    private analyticsRepository: IAnalyticsRepository,
    private restaurantRepository: IRestaurantRepository
  ) {}

  public async trackEvent(data: {
    restaurantSlugOrId: string;
    eventType: 'NFC_TAP' | 'MENU_VIEW' | 'WIFI_CONNECT' | 'GOOGLE_REVIEW' | 'WAITER_CALL';
    tableNumber?: string;
    metadata?: string;
  }) {
    // Try resolving by slug first, otherwise id
    let restaurant = await this.restaurantRepository.findBySlug(data.restaurantSlugOrId);
    if (!restaurant) {
      restaurant = await this.restaurantRepository.findById(data.restaurantSlugOrId);
    }

    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    return this.analyticsRepository.recordEvent({
      restaurantId: restaurant.id,
      eventType: data.eventType,
      tableNumber: data.tableNumber || null,
      metadata: data.metadata || null,
    });
  }

  public async getStats(restaurantId: string, days = 30) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    return this.analyticsRepository.getStats(restaurantId, days);
  }
}

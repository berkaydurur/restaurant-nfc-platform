import { RestaurantEntity, MenuCategoryEntity, MenuItemEntity, UserEntity, AnalyticsEventEntity } from '../entities';

export interface IRestaurantRepository {
  findById(id: string): Promise<RestaurantEntity | null>;
  findBySlug(slug: string): Promise<RestaurantEntity | null>;
  findAll(): Promise<RestaurantEntity[]>;
  create(data: Omit<RestaurantEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RestaurantEntity>;
  update(id: string, data: Partial<RestaurantEntity>): Promise<RestaurantEntity>;
  delete(id: string): Promise<void>;
}

export interface IMenuRepository {
  findCategoriesByRestaurant(restaurantId: string): Promise<MenuCategoryEntity[]>;
  findCategoryById(id: string): Promise<MenuCategoryEntity | null>;
  createCategory(data: Omit<MenuCategoryEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuCategoryEntity>;
  updateCategory(id: string, data: Partial<MenuCategoryEntity>): Promise<MenuCategoryEntity>;
  deleteCategory(id: string): Promise<void>;

  findItemsByRestaurant(restaurantId: string): Promise<MenuItemEntity[]>;
  findItemsByCategory(categoryId: string): Promise<MenuItemEntity[]>;
  findItemById(id: string): Promise<MenuItemEntity | null>;
  createItem(data: Omit<MenuItemEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItemEntity>;
  updateItem(id: string, data: Partial<MenuItemEntity>): Promise<MenuItemEntity>;
  deleteItem(id: string): Promise<void>;

  getFullMenu(restaurantId: string): Promise<{
    categories: (MenuCategoryEntity & { items: MenuItemEntity[] })[];
  }>;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
}

export interface IAnalyticsRepository {
  recordEvent(data: Omit<AnalyticsEventEntity, 'id' | 'createdAt'>): Promise<AnalyticsEventEntity>;
  getStats(restaurantId: string, days?: number): Promise<{
    totalNfcTaps: number;
    totalMenuViews: number;
    totalWifiConnects: number;
    totalGoogleReviews: number;
    totalWaiterCalls: number;
    recentEvents: AnalyticsEventEntity[];
    eventsByDate: { date: string; nfcTaps: number; menuViews: number; wifiConnects: number; reviews: number }[];
  }>;
}

import { IMenuRepository, IRestaurantRepository } from '../../../core/repositories';
import { NotFoundError, UnauthorizedError } from '../../../core/errors/AppError';
import { MenuCategoryEntity, MenuItemEntity } from '../../../core/entities';

export class MenuUseCases {
  constructor(
    private menuRepository: IMenuRepository,
    private restaurantRepository: IRestaurantRepository
  ) {}

  public async getFullMenuBySlug(slug: string) {
    const restaurant = await this.restaurantRepository.findBySlug(slug);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }
    return this.menuRepository.getFullMenu(restaurant.id);
  }

  public async getFullMenuById(restaurantId: string) {
    return this.menuRepository.getFullMenu(restaurantId);
  }

  public async getCategories(restaurantId: string) {
    return this.menuRepository.findCategoriesByRestaurant(restaurantId);
  }

  public async createCategory(data: {
    restaurantId: string;
    name: string;
    nameEn?: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
  }): Promise<MenuCategoryEntity> {
    return this.menuRepository.createCategory({
      restaurantId: data.restaurantId,
      name: data.name,
      nameEn: data.nameEn || null,
      description: data.description || null,
      icon: data.icon || '🍽️',
      sortOrder: data.sortOrder ?? 0,
      isActive: true,
    });
  }

  public async updateCategory(categoryId: string, restaurantId: string, data: Partial<MenuCategoryEntity>): Promise<MenuCategoryEntity> {
    const category = await this.menuRepository.findCategoryById(categoryId);
    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundError('Kategori bulunamadı veya yetkiniz yok.');
    }
    return this.menuRepository.updateCategory(categoryId, data);
  }

  public async deleteCategory(categoryId: string, restaurantId: string): Promise<void> {
    const category = await this.menuRepository.findCategoryById(categoryId);
    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundError('Kategori bulunamadı veya yetkiniz yok.');
    }
    await this.menuRepository.deleteCategory(categoryId);
  }

  public async getItems(restaurantId: string) {
    return this.menuRepository.findItemsByRestaurant(restaurantId);
  }

  public async createItem(data: {
    restaurantId: string;
    categoryId: string;
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    price: number;
    discountedPrice?: number;
    imageUrl?: string;
    isChefSpecial?: boolean;
    isPopular?: boolean;
    isNew?: boolean;
    dietaryTags?: string;
    allergens?: string;
    calories?: number;
    preparationTime?: number;
    sortOrder?: number;
  }): Promise<MenuItemEntity> {
    return this.menuRepository.createItem({
      restaurantId: data.restaurantId,
      categoryId: data.categoryId,
      name: data.name,
      nameEn: data.nameEn || null,
      description: data.description || null,
      descriptionEn: data.descriptionEn || null,
      price: data.price,
      discountedPrice: data.discountedPrice || null,
      imageUrl: data.imageUrl || null,
      isAvailable: true,
      isChefSpecial: data.isChefSpecial ?? false,
      isPopular: data.isPopular ?? false,
      isNew: data.isNew ?? false,
      dietaryTags: data.dietaryTags || null,
      allergens: data.allergens || null,
      calories: data.calories || null,
      preparationTime: data.preparationTime || null,
      sortOrder: data.sortOrder ?? 0,
    });
  }

  public async updateItem(itemId: string, restaurantId: string, data: Partial<MenuItemEntity>): Promise<MenuItemEntity> {
    const item = await this.menuRepository.findItemById(itemId);
    if (!item || item.restaurantId !== restaurantId) {
      throw new NotFoundError('Ürün bulunamadı veya yetkiniz yok.');
    }
    return this.menuRepository.updateItem(itemId, data);
  }

  public async toggleAvailability(itemId: string, restaurantId: string): Promise<MenuItemEntity> {
    const item = await this.menuRepository.findItemById(itemId);
    if (!item || item.restaurantId !== restaurantId) {
      throw new NotFoundError('Ürün bulunamadı veya yetkiniz yok.');
    }
    return this.menuRepository.updateItem(itemId, { isAvailable: !item.isAvailable });
  }

  public async deleteItem(itemId: string, restaurantId: string): Promise<void> {
    const item = await this.menuRepository.findItemById(itemId);
    if (!item || item.restaurantId !== restaurantId) {
      throw new NotFoundError('Ürün bulunamadı veya yetkiniz yok.');
    }
    await this.menuRepository.deleteItem(itemId);
  }
}

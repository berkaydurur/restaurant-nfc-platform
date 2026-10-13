import { IRestaurantRepository } from '../../../core/repositories';
import { NotFoundError } from '../../../core/errors/AppError';
import { RestaurantEntity } from '../../../core/entities';

export class RestaurantUseCases {
  constructor(private restaurantRepository: IRestaurantRepository) {}

  public async getPublicProfile(slug: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findBySlug(slug);
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundError(`"${slug}" isimli restoran bulunamadı veya henüz aktif değil.`);
    }
    return restaurant;
  }

  public async getById(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new NotFoundError('Restoran bulunamadı.');
    }
    return restaurant;
  }

  public async getAllActive(): Promise<RestaurantEntity[]> {
    return this.restaurantRepository.findAll();
  }

  public async updateProfile(id: string, updateData: Partial<RestaurantEntity>): Promise<RestaurantEntity> {
    const existing = await this.restaurantRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Restoran bulunamadı.');
    }

    // Do not allow slug overwrite if already taken
    if (updateData.slug && updateData.slug !== existing.slug) {
      const slugOwner = await this.restaurantRepository.findBySlug(updateData.slug);
      if (slugOwner && slugOwner.id !== id) {
        throw new Error('Bu kısa ad (slug) başka bir mekan tarafından kullanılıyor.');
      }
    }

    return this.restaurantRepository.update(id, updateData);
  }
}

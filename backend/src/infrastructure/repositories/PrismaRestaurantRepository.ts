import { prisma } from '../database/prisma';
import { IRestaurantRepository } from '../../core/repositories';
import { RestaurantEntity } from '../../core/entities';

export class PrismaRestaurantRepository implements IRestaurantRepository {
  public async findById(id: string): Promise<RestaurantEntity | null> {
    return prisma.restaurant.findUnique({ where: { id } });
  }

  public async findBySlug(slug: string): Promise<RestaurantEntity | null> {
    return prisma.restaurant.findUnique({ where: { slug } });
  }

  public async findAll(): Promise<RestaurantEntity[]> {
    return prisma.restaurant.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  public async create(data: Omit<RestaurantEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<RestaurantEntity> {
    return prisma.restaurant.create({ data });
  }

  public async update(id: string, data: Partial<RestaurantEntity>): Promise<RestaurantEntity> {
    return prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.restaurant.delete({ where: { id } });
  }
}

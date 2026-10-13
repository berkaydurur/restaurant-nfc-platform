import { prisma } from '../database/prisma';
import { IMenuRepository } from '../../core/repositories';
import { MenuCategoryEntity, MenuItemEntity } from '../../core/entities';

export class PrismaMenuRepository implements IMenuRepository {
  public async findCategoriesByRestaurant(restaurantId: string): Promise<MenuCategoryEntity[]> {
    return prisma.menuCategory.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  public async findCategoryById(id: string): Promise<MenuCategoryEntity | null> {
    return prisma.menuCategory.findUnique({ where: { id } });
  }

  public async createCategory(data: Omit<MenuCategoryEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuCategoryEntity> {
    return prisma.menuCategory.create({ data });
  }

  public async updateCategory(id: string, data: Partial<MenuCategoryEntity>): Promise<MenuCategoryEntity> {
    return prisma.menuCategory.update({
      where: { id },
      data,
    });
  }

  public async deleteCategory(id: string): Promise<void> {
    await prisma.menuCategory.delete({ where: { id } });
  }

  public async findItemsByRestaurant(restaurantId: string): Promise<MenuItemEntity[]> {
    return prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  public async findItemsByCategory(categoryId: string): Promise<MenuItemEntity[]> {
    return prisma.menuItem.findMany({
      where: { categoryId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  public async findItemById(id: string): Promise<MenuItemEntity | null> {
    return prisma.menuItem.findUnique({ where: { id } });
  }

  public async createItem(data: Omit<MenuItemEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItemEntity> {
    return prisma.menuItem.create({ data });
  }

  public async updateItem(id: string, data: Partial<MenuItemEntity>): Promise<MenuItemEntity> {
    return prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  public async deleteItem(id: string): Promise<void> {
    await prisma.menuItem.delete({ where: { id } });
  }

  public async getFullMenu(restaurantId: string): Promise<{
    categories: (MenuCategoryEntity & { items: MenuItemEntity[] })[];
  }> {
    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return { categories };
  }
}

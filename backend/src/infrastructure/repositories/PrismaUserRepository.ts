import { prisma } from '../database/prisma';
import { IUserRepository } from '../../core/repositories';
import { UserEntity } from '../../core/entities';

export class PrismaUserRepository implements IUserRepository {
  public async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as UserEntity | null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as UserEntity | null;
  }

  public async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    const user = await prisma.user.create({ data });
    return user as UserEntity;
  }
}

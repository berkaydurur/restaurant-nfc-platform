import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances in development
  const globalWithPrisma = global as typeof globalThis & {
    prismaInstance?: PrismaClient;
  };
  if (!globalWithPrisma.prismaInstance) {
    globalWithPrisma.prismaInstance = new PrismaClient();
  }
  prisma = globalWithPrisma.prismaInstance;
}

export { prisma };

import { PrismaClient } from '@prisma/client';

export const clearDB = async (prisma: PrismaClient) => {
  await prisma.book.deleteMany({});
  await prisma.author.deleteMany({});
};

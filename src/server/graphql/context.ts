import { PrismaClient } from '@prisma/client';

export type MyContextType = {
  prisma: PrismaClient
}

export const Context = (args: {prisma: PrismaClient}): MyContextType => ({
  prisma: args.prisma
});

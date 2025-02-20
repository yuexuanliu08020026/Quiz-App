import { PrismaClient } from '@prisma/client';

// just for global.prisma in lib-server/prisma.ts
declare global {
  var prisma: PrismaClient;
}
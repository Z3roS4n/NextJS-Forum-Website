import { PrismaClient } from '../generated/prisma';

declare global {
  // Permette di mantenere una singola istanza di Prisma durante lo sviluppo
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Usa globalThis per compatibilità sia Node che ambienti moderni (es. Turbopack)
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export { prisma };

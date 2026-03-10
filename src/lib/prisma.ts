import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function parseMySqlUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1) || undefined,
  };
}

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it in Vercel: Settings → Environment Variables.");
  const config = parseMySqlUrl(url);
  const adapter = new PrismaMariaDb({
    ...config,
    connectTimeout: 30_000, // 30s for slow/remote DB (e.g. Hostinger)
    connectionLimit: 2, // Hostinger limits max_connections_per_hour (e.g. 500); keep pool small
    idleTimeout: 60_000,
    acquireTimeout: 25_000, // wait longer to get a connection from pool (default 10s; Hostinger can be slow)
  });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrisma();
  globalForPrisma.prisma = client;
  return client;
}

// Lazy init: only connect when prisma is first used (avoids "DATABASE_URL is not set" during Vercel build).
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getPrisma(), prop);
  },
});

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

function createPrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
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

export const prisma =
  globalForPrisma.prisma ||
  createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
